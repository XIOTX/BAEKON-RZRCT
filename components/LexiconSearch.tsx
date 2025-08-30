'use client';

import { useState } from 'react';
import { FLKnowledgeNode } from '@/lib/fl-knowledge';

interface LexiconSearchProps {
  node: FLKnowledgeNode;
  interactive?: boolean;
}

interface LexiconResult {
  surface?: string;
  normalized?: string;
  gloss?: string;
  pos?: string;
  confidence?: number;
}

export function LexiconSearch({ node, interactive = false }: LexiconSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LexiconResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLexicon = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8787/lexicon/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Lexicon search failed - database connection issue');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lexicon search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <h3 className="text-green-400 font-semibold mb-2">FL Lexicon Search</h3>
        <p className="text-gray-300 text-sm mb-4">
          Search through 2,447 FL terms with confidence scores and grammatical information
        </p>
        
        {/* Search Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLexicon()}
            placeholder="Search FL lexicon terms..."
            className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
          />
          <button
            onClick={searchLexicon}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? 'SEARCHING...' : 'SEARCH'}
          </button>
        </div>
      </div>

      {/* Database Issue Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center text-yellow-400 mb-2">
          <span className="mr-2">⚠️</span>
          <span className="font-semibold">Database Connection Issue</span>
        </div>
        <p className="text-gray-300 text-sm">
          The lexicon database is currently experiencing connection issues. 
          This is a PostgreSQL configuration problem that needs to be resolved.
        </p>
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
              Found {results.length} lexicon entries
            </h4>
            <div className="text-sm text-gray-400">
              📖 Lexicon (FL Direct)
            </div>
          </div>
          
          {results.map((result, index) => (
            <div key={index} className="bg-black/20 border border-gray-700 rounded-lg p-4 hover:border-green-500/50 transition-colors">
              {/* Term Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="text-green-400 font-semibold text-lg mb-1">
                    {result.surface || result.normalized}
                  </h5>
                  {result.gloss && (
                    <p className="text-gray-300 italic">"{result.gloss}"</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded mb-1">
                    {Math.round((result.confidence || 0) * 100)}% confidence
                  </div>
                  {result.pos && (
                    <div className="text-xs text-gray-400">
                      {result.pos}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-gray-400">No lexicon entries found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">
            Try different search terms or check spelling
          </p>
        </div>
      )}

      {/* Initial State */}
      {!query && results.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-400">Enter terms to search the FL lexicon</p>
          <p className="text-sm text-gray-500 mt-2">
            Search FL terms, English translations, and grammatical information
          </p>
        </div>
      )}
    </div>
  );
}
