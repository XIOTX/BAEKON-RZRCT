'use client';

import { useState } from 'react';
import { FLKnowledgeNode } from '@/lib/fl-knowledge';

interface AnasIndexSearchProps {
  node: FLKnowledgeNode;
}

interface SearchResult {
  title: string;
  author: string;
  date_posted: string;
  tags: string;
  english_text?: string;
  full_text?: string;
}

export function AnasIndexSearch({ node }: AnasIndexSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAnasIndex = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8787/anas-index/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Ana's Index Search</h3>
        <p className="text-gray-300 text-sm mb-4">
          Search through 21.9MB of FL documents with full-text indexing [[memory:7577742]]
        </p>
        
        {/* Search Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchAnasIndex()}
            placeholder={`Search ${node.title.toLowerCase()} documents...`}
            className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={searchAnasIndex}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center text-red-400">
            <span className="mr-2">❌</span>
            <span className="font-semibold">Search Error</span>
          </div>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-cyan-400 font-semibold">
              Found {results.length} documents
            </h4>
            <div className="text-sm text-gray-400">
              📚 Ana's Index (FL Direct)
            </div>
          </div>
          
          {results.map((result, index) => (
            <div key={index} className="bg-black/20 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
              {/* Document Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="text-purple-400 font-semibold text-lg mb-1">
                    {result.title}
                  </h5>
                  <div className="text-sm text-gray-400">
                    By {result.author} • {result.date_posted}
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded">
                  ✅ High Confidence
                </div>
              </div>

              {/* Content Preview */}
              {result.english_text && (
                <div className="mb-3">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {result.english_text.substring(0, 300)}
                    {result.english_text.length > 300 && '...'}
                  </p>
                </div>
              )}

              {/* Tags */}
              {result.tags && (
                <div className="flex flex-wrap gap-2">
                  {result.tags.split(',').map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400">No documents found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">
            Try different search terms or check spelling
          </p>
        </div>
      )}

      {/* Initial State */}
      {!query && results.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-400">Enter search terms to explore FL documents</p>
          <p className="text-sm text-gray-500 mt-2">
            Search through titles, authors, content, and tags
          </p>
        </div>
      )}
    </div>
  );
}
