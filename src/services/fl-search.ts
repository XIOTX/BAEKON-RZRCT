import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface FLDocument {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  author?: string;
  date?: string;
  filePath: string;
  images?: string[];
}

export interface SearchResult {
  document: FLDocument;
  score: number;
  matches: string[];
}

export class FLSearchService {
  private documents: FLDocument[] = [];
  private knowledgeBasePath: string;

  constructor() {
    this.knowledgeBasePath = path.join(process.cwd(), 'fl-knowledge-base');
    this.indexDocuments();
  }

  private async indexDocuments() {
    if (!fs.existsSync(this.knowledgeBasePath)) {
      console.warn('FL knowledge base not found at:', this.knowledgeBasePath);
      return;
    }

    const categories = fs.readdirSync(this.knowledgeBasePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(this.knowledgeBasePath, category);
      const files = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.md'));

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content: markdownContent } = matter(content);

        const document: FLDocument = {
          id: `${category}/${file.replace('.md', '')}`,
          title: frontmatter.title || file.replace('.md', '').replace(/-/g, ' '),
          content: markdownContent,
          excerpt: this.generateExcerpt(markdownContent),
          tags: frontmatter.tags || this.generateAutoTags(file, category, markdownContent),
          category,
          author: frontmatter.author,
          date: frontmatter.date,
          filePath,
          images: this.extractImages(markdownContent)
        };

        this.documents.push(document);
      }
    }

    console.log(`Indexed ${this.documents.length} FL documents`);
  }

  private generateAutoTags(filename: string, category: string, content: string): string[] {
    const tags: string[] = [];
    
    // Add category as a tag
    tags.push(category);
    
    // Extract tags from filename patterns
    if (filename.includes('tid-')) {
      tags.push('fl-post');
    }
    
    // Content-based tags
    const lowerContent = content.toLowerCase();
    const lowerTitle = filename.toLowerCase();
    
    // FL language families
    if (lowerContent.includes('aylid') || lowerTitle.includes('aylid')) tags.push('aylid');
    if (lowerContent.includes('drizza') || lowerTitle.includes('drizza')) tags.push('drizza');
    if (lowerContent.includes('romaniel') || lowerTitle.includes('romaniel')) tags.push('romaniel');
    if (lowerContent.includes('yid') || lowerTitle.includes('yid')) tags.push('yid');
    if (lowerContent.includes('ned') || lowerTitle.includes('ned')) tags.push('ned');
    if (lowerContent.includes('iress') || lowerTitle.includes('iress')) tags.push('iress');
    
    // Research themes
    if (lowerContent.includes('consciousness') || lowerTitle.includes('consciousness')) tags.push('consciousness-studies');
    if (lowerContent.includes('military') || lowerTitle.includes('warfare') || lowerTitle.includes('defense')) tags.push('military-applications');
    if (lowerContent.includes('linguistic') || lowerTitle.includes('language')) tags.push('linguistics');
    if (lowerContent.includes('crypto') || lowerTitle.includes('crypto')) tags.push('cryptography');
    if (lowerContent.includes('mystical') || lowerContent.includes('spiritual')) tags.push('mysticism');
    if (lowerContent.includes('time') || lowerTitle.includes('time')) tags.push('temporal-studies');
    if (lowerContent.includes('space') || lowerContent.includes('positioning')) tags.push('spatial-analysis');
    
    // Major topics
    if (lowerContent.includes('giselian') || lowerTitle.includes('giselian') || category === 'giselians') tags.push('giselians');
    if (lowerContent.includes('nodespace') || lowerTitle.includes('nodespace') || category === 'nodespaces') tags.push('nodespaces');
    if (lowerContent.includes('cassini') || lowerTitle.includes('cassini')) tags.push('cassini-diskus');
    
    // Difficulty levels based on content complexity
    if (lowerTitle.includes('overview') || lowerTitle.includes('intro')) {
      tags.push('introductory');
    } else if (content.length > 2000) {
      tags.push('advanced');
    } else {
      tags.push('intermediate');
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    const cleanContent = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .trim();

    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength).trim() + '...'
      : cleanContent;
  }

  private extractImages(content: string): string[] {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    const images: string[] = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push(match[1]);
    }

    return images;
  }

  public search(query: string, tags: string[] = [], category?: string): SearchResult[] {
    if (!query.trim() && tags.length === 0 && !category) {
      return this.documents.map(doc => ({ document: doc, score: 1, matches: [] }));
    }

    const results: SearchResult[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    for (const doc of this.documents) {
      let score = 0;
      const matches: string[] = [];

      // Category filter
      if (category && doc.category !== category) {
        continue;
      }

      // Tag filter
      if (tags.length > 0) {
        const docTags = doc.tags.map(tag => tag.toLowerCase());
        const hasAllTags = tags.every(tag => 
          docTags.some(docTag => docTag.includes(tag.toLowerCase()))
        );
        if (!hasAllTags) continue;
        score += tags.length * 10; // Boost for tag matches
      }

      // Text search
      if (queryTerms.length > 0) {
        const searchableText = `${doc.title} ${doc.content} ${doc.author || ''}`.toLowerCase();
        
        for (const term of queryTerms) {
          const termMatches = (searchableText.match(new RegExp(term, 'g')) || []).length;
          if (termMatches > 0) {
            score += termMatches;
            matches.push(term);
            
            // Boost for title matches
            if (doc.title.toLowerCase().includes(term)) {
              score += 5;
            }
          }
        }

        // Skip if no text matches when query provided
        if (queryTerms.length > 0 && matches.length === 0) {
          continue;
        }
      }

      if (score > 0 || (queryTerms.length === 0 && tags.length === 0)) {
        results.push({ document: doc, score, matches });
      }
    }

    // Sort by score descending
    return results.sort((a, b) => b.score - a.score);
  }

  public getAllTags(): string[] {
    const tagSet = new Set<string>();
    this.documents.forEach(doc => {
      doc.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  public getAllCategories(): string[] {
    const categorySet = new Set<string>();
    this.documents.forEach(doc => categorySet.add(doc.category));
    return Array.from(categorySet).sort();
  }

  public getDocumentById(id: string): FLDocument | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  public updateDocumentTags(id: string, newTags: string[]): boolean {
    const doc = this.getDocumentById(id);
    if (!doc) return false;

    // Update in memory
    doc.tags = newTags;

    // Update file
    try {
      const content = fs.readFileSync(doc.filePath, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      frontmatter.tags = newTags;
      
      const updatedContent = matter.stringify(markdownContent, frontmatter);
      fs.writeFileSync(doc.filePath, updatedContent);
      
      return true;
    } catch (error) {
      console.error('Error updating document tags:', error);
      return false;
    }
  }

  public reindex(): void {
    this.documents = [];
    this.indexDocuments();
  }
}

// Singleton instance
export const flSearchService = new FLSearchService();
