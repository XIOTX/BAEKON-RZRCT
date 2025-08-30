import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import * as chokidar from 'chokidar';

const VAULT_PATH = path.resolve(__dirname, '../../../BAEKON-Research-Vault');

interface VaultDocument {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  lastModified: Date;
  tags: string[];
  links: string[];
}

class VaultManager {
  private documents: Map<string, VaultDocument> = new Map();
  private watcher: chokidar.FSWatcher | null = null;

  constructor() {
    this.initializeVault();
  }

  private initializeVault() {
    if (!fs.existsSync(VAULT_PATH)) {
      console.warn(`Vault not found at ${VAULT_PATH}`);
      return;
    }

    // Initial scan
    this.scanVault();

    // Watch for changes
    this.watcher = chokidar.watch(VAULT_PATH, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    this.watcher
      .on('add', (filePath: string) => this.handleFileChange(filePath))
      .on('change', (filePath: string) => this.handleFileChange(filePath))
      .on('unlink', (filePath: string) => this.handleFileDelete(filePath));

    console.log(`📚 Vault watcher initialized: ${VAULT_PATH}`);
  }

  private scanVault() {
    const scanDir = (dirPath: string) => {
      if (!fs.existsSync(dirPath)) return;
      
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
          scanDir(fullPath);
        } else if (item.endsWith('.md')) {
          this.processMarkdownFile(fullPath);
        }
      }
    };

    scanDir(VAULT_PATH);
    console.log(`📖 Scanned vault: ${this.documents.size} documents loaded`);
  }

  private handleFileChange(filePath: string) {
    if (filePath.endsWith('.md')) {
      this.processMarkdownFile(filePath);
    }
  }

  private handleFileDelete(filePath: string) {
    const id = this.pathToId(filePath);
    this.documents.delete(id);
  }

  private processMarkdownFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relativePath = path.relative(VAULT_PATH, filePath);
      const id = this.pathToId(filePath);
      
      // Extract title (first # heading or filename)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
      
      // Extract tags
      const tagMatches = content.match(/#[\w-]+/g) || [];
      const tags = tagMatches.map(tag => tag.slice(1));
      
      // Extract links
      const linkMatches = content.match(/\[\[([^\]]+)\]\]/g) || [];
      const links = linkMatches.map(link => link.slice(2, -2));
      
      // Determine category from path
      const category = this.pathToCategory(relativePath);
      
      const doc: VaultDocument = {
        id,
        title,
        content,
        path: relativePath,
        category,
        lastModified: fs.statSync(filePath).mtime,
        tags,
        links
      };
      
      this.documents.set(id, doc);
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  }

  private pathToId(filePath: string): string {
    return path.relative(VAULT_PATH, filePath).replace(/\\/g, '/');
  }

  private pathToCategory(relativePath: string): string {
    const parts = relativePath.split(path.sep);
    return parts[0] || 'uncategorized';
  }

  // Public API methods
  search(query: string, category?: string): VaultDocument[] {
    const results: VaultDocument[] = [];
    const searchTerm = query.toLowerCase();
    
    for (const doc of this.documents.values()) {
      if (category && doc.category !== category) continue;
      
      const searchableText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      if (searchableText.includes(searchTerm)) {
        results.push(doc);
      }
    }
    
    return results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  getDocument(id: string): VaultDocument | undefined {
    return this.documents.get(id);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    for (const doc of this.documents.values()) {
      categories.add(doc.category);
    }
    return Array.from(categories).sort();
  }

  getStats() {
    return {
      totalDocuments: this.documents.size,
      categories: this.getCategories().length,
      lastUpdate: new Date().toISOString()
    };
  }
}

const vaultManager = new VaultManager();

export default async function vaultRoutes(fastify: FastifyInstance) {
  // Search vault documents
  fastify.get('/vault/search', async (request, reply) => {
    const { q: query, category } = request.query as { q?: string; category?: string };
    
    if (!query) {
      return reply.code(400).send({ error: 'Query parameter required' });
    }
    
    const results = vaultManager.search(query, category);
    return { results, count: results.length };
  });

  // Get specific document
  fastify.get('/vault/document/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const doc = vaultManager.getDocument(decodeURIComponent(id));
    
    if (!doc) {
      return reply.code(404).send({ error: 'Document not found' });
    }
    
    return doc;
  });

  // Get vault statistics
  fastify.get('/vault/stats', async (request, reply) => {
    return vaultManager.getStats();
  });

  // Get categories
  fastify.get('/vault/categories', async (request, reply) => {
    return { categories: vaultManager.getCategories() };
  });
}
