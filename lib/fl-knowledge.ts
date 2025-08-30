// FL Knowledge Structure - This is the authoritative hierarchy the AI uses to navigate
export interface FLKnowledgeNode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  children?: FLKnowledgeNode[];
  contentType?: 'search' | 'analysis' | 'reference' | 'interactive';
  dataSource?: 'anas-index' | 'lexicon' | 'vault' | 'external';
  aiGuidance?: string; // How the AI should introduce/explain this section
}

export const FL_KNOWLEDGE_TREE: FLKnowledgeNode = {
  id: 'root',
  title: 'BÆKON FL Research',
  description: 'Comprehensive Forgotten Languages research environment',
  icon: '🔬',
  color: 'text-cyan-400',
  children: [
    {
      id: 'core-languages',
      title: 'Core FL Languages',
      description: 'Synthetic languages and their linguistic systems',
      icon: '🗣️',
      color: 'text-blue-400',
      aiGuidance: 'These are the primary constructed languages in the FL corpus. Each has distinct grammatical patterns and lexical systems.',
      children: [
        {
          id: 'aylid',
          title: 'Aylid',
          description: 'Primary FL language with extensive documentation',
          icon: '📜',
          color: 'text-green-400',
          contentType: 'search',
          dataSource: 'anas-index',
          aiGuidance: 'Aylid is the most documented FL language. Search Ana\'s Index for grammatical patterns and usage examples.'
        },
        {
          id: 'yid',
          title: 'Yid', 
          description: 'Technical/scientific FL variant',
          icon: '⚗️',
          color: 'text-yellow-400',
          contentType: 'search',
          dataSource: 'anas-index'
        },
        {
          id: 'ned',
          title: 'Ned',
          description: 'Philosophical discourse language',
          icon: '🤔',
          color: 'text-purple-400',
          contentType: 'search',
          dataSource: 'anas-index'
        },
        {
          id: 'drizza',
          title: 'Drizza',
          description: 'Esoteric/religious contexts',
          icon: '🕯️',
          color: 'text-orange-400',
          contentType: 'search',
          dataSource: 'anas-index'
        },
        {
          id: 'translation-tools',
          title: 'Translation Systems',
          description: 'Lexicons and translation methodologies',
          icon: '🔄',
          color: 'text-cyan-400',
          contentType: 'interactive',
          dataSource: 'lexicon',
          aiGuidance: 'Access the 2,447-term lexicon with confidence scores. Use this for word-level analysis and translation validation.'
        }
      ]
    },
    {
      id: 'technical-systems',
      title: 'Technical Systems',
      description: 'Advanced FL technical concepts and applications',
      icon: '⚙️',
      color: 'text-red-400',
      aiGuidance: 'These represent the most complex and potentially significant aspects of FL research.',
      children: [
        {
          id: 'cassini-diskus',
          title: 'Cassini Diskus',
          description: 'Coordinate systems and spatial references (50 documents)',
          icon: '🛰️',
          color: 'text-blue-300',
          contentType: 'analysis',
          dataSource: 'anas-index',
          aiGuidance: 'Cassini Diskus is the most documented topic (50 docs). Focus on coordinate patterns and spatial relationships.'
        },
        {
          id: 'nodespaces',
          title: 'NodeSpaces',
          description: 'Information architecture theory (21 documents)',
          icon: '🕸️',
          color: 'text-green-300',
          contentType: 'analysis',
          dataSource: 'anas-index',
          aiGuidance: 'NodeSpaces theory relates to information organization. Cross-reference with consciousness studies.'
        },
        {
          id: 'defense-applications',
          title: 'Defense Applications',
          description: 'Military and security contexts (50 documents)',
          icon: '🛡️',
          color: 'text-red-300',
          contentType: 'analysis',
          dataSource: 'anas-index',
          aiGuidance: 'Highly sensitive area. Focus on documented technical aspects, avoid speculation.'
        }
      ]
    },
    {
      id: 'philosophical',
      title: 'Philosophical Frameworks',
      description: 'Theoretical foundations and consciousness studies',
      icon: '🧠',
      color: 'text-purple-400',
      aiGuidance: 'These areas explore the deeper implications of FL research for understanding language and consciousness.',
      children: [
        {
          id: 'philosophy-of-language',
          title: 'Philosophy of Language',
          description: 'Linguistic theory and meaning (23 documents)',
          icon: '💭',
          color: 'text-indigo-400',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'consciousness-studies',
          title: 'Consciousness Studies',
          description: 'Mind-language interaction research',
          icon: '🌟',
          color: 'text-pink-400',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'information-theory',
          title: 'Information Theory',
          description: 'Data structures and meaning transmission',
          icon: '📊',
          color: 'text-cyan-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        }
      ]
    },
    {
      id: 'esoteric',
      title: 'Esoteric Dimensions',
      description: 'Spiritual, mystical, and symbolic aspects',
      icon: '🔮',
      color: 'text-yellow-400',
      aiGuidance: 'These areas explore FL connections to spiritual and esoteric traditions. Maintain scholarly objectivity.',
      children: [
        {
          id: 'religion',
          title: 'Religious Contexts',
          description: 'FL in religious and spiritual texts (37 documents)',
          icon: '⛪',
          color: 'text-amber-400',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'sufism',
          title: 'Sufism',
          description: 'Islamic mystical traditions (19 documents)',
          icon: '☪️',
          color: 'text-emerald-400',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'theosophy',
          title: 'Theosophy',
          description: 'Theosophical connections (18 documents)',
          icon: '🕉️',
          color: 'text-orange-400',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'alchemy',
          title: 'Alchemy',
          description: 'Alchemical symbolism and practices (15 documents)',
          icon: '⚗️',
          color: 'text-yellow-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'dreams',
          title: 'Dream Studies',
          description: 'FL in dream contexts and analysis (10 documents)',
          icon: '💤',
          color: 'text-purple-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        }
      ]
    },
    {
      id: 'literary',
      title: 'Literary & Artistic',
      description: 'Creative expressions and artistic works',
      icon: '🎭',
      color: 'text-rose-400',
      aiGuidance: 'These represent the creative and artistic dimensions of FL research.',
      children: [
        {
          id: 'poetry',
          title: 'FL Poetry',
          description: 'Poetic works and analysis (8 documents)',
          icon: '📝',
          color: 'text-pink-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'millangivm',
          title: 'Millangivm',
          description: 'Specific literary corpus (21 documents)',
          icon: '📚',
          color: 'text-blue-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        },
        {
          id: 'de-altero-genere',
          title: 'De Altero Genere',
          description: 'Specialized literary works (11 documents)',
          icon: '📖',
          color: 'text-green-300',
          contentType: 'analysis',
          dataSource: 'anas-index'
        }
      ]
    },
    {
      id: 'community',
      title: 'Community Research',
      description: 'Community-driven analysis and discoveries',
      icon: '👥',
      color: 'text-teal-400',
      aiGuidance: 'Community research provides valuable insights but requires careful source verification.',
      children: [
        {
          id: 'vault-documents',
          title: 'Research Vault',
          description: 'Community-curated research documents',
          icon: '🗄️',
          color: 'text-gray-400',
          contentType: 'search',
          dataSource: 'vault'
        },
        {
          id: 'external-sources',
          title: 'External Sources',
          description: 'Cross-referenced community sources',
          icon: '🔗',
          color: 'text-blue-400',
          contentType: 'reference',
          dataSource: 'external'
        }
      ]
    }
  ]
};

// AI Behavioral Guidelines - How the AI should act in different contexts
export const AI_BEHAVIOR_PATTERNS = {
  greeting: "I'm your FL Research Guide. I can help you navigate the Forgotten Languages corpus with precision and provenance. What area interests you?",
  
  sourceAttribution: {
    "anas-index": "📚 Ana's Index (FL Direct)",
    "lexicon": "📖 Lexicon (FL Direct)", 
    "vault": "🗄️ Community Vault (Human Curated)",
    "external": "🔗 External Source (Community)",
    "speculation": "🤔 Analysis (AI Speculation)"
  },
  
  confidenceLevels: {
    high: "✅ High Confidence",
    medium: "⚠️ Medium Confidence", 
    low: "❓ Low Confidence",
    speculation: "💭 Speculative"
  },
  
  navigationPrompts: {
    overview: "Would you like an overview of this area or should we dive into specific documents?",
    drill_down: "I can show you related subtopics or search for specific terms. What interests you most?",
    cross_reference: "This connects to several other areas. Should we explore those connections?",
    search_suggest: "I can search the corpus for specific terms or concepts. What should we look for?"
  }
} as const;

// Helper functions for AI context
export function getNodeByPath(path: string[]): FLKnowledgeNode | null {
  let current = FL_KNOWLEDGE_TREE;
  
  for (const segment of path) {
    if (!current.children) return null;
    const found = current.children.find(child => child.id === segment);
    if (!found) return null;
    current = found;
  }
  
  return current;
}

export function getAIGuidanceForPath(path: string[]): string {
  const node = getNodeByPath(path);
  return node?.aiGuidance || "I can help you explore this area of FL research.";
}
