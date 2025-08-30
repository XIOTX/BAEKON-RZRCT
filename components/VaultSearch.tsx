'use client';

import { useState } from 'react';
import { FLKnowledgeNode } from '@/lib/fl-knowledge';

interface VaultSearchProps {
  node: FLKnowledgeNode;
}

export function VaultSearch({ node }: VaultSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVault = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:8787/vault/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Vault search failed');
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vault search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
        <h3 className="text-gray-400 font-semibold mb-2">Research Vault Search</h3>
        <p className="text-gray-300 text-sm mb-4">
          Search community-curated research documents and analysis
        </p>
        
        {/* Search Input */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchVault()}
            placeholder="Search vault documents..."
            className="flex-1 bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
          />
          <button
            onClick={searchVault}
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
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
              Found {results.length} vault documents
            </h4>
            <div className="text-sm text-gray-400">
              🗄️ Community Vault (Human Curated)
            </div>
          </div>
          
          {results.map((result, index) => (
            <div key={index} className="bg-black/20 border border-gray-700 rounded-lg p-4 hover:border-gray-500/50 transition-colors">
              <h5 className="text-gray-400 font-semibold text-lg mb-2">
                {result.title || `Document ${index + 1}`}
              </h5>
              <p className="text-gray-300 text-sm">
                {result.content || result.description || 'Community research document'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Initial State */}
      <div className="text-center py-8">
        <div className="text-4xl mb-4">🗄️</div>
        <p className="text-gray-400">Community Research Vault</p>
        <p className="text-sm text-gray-500 mt-2">
          Search through community-curated FL research documents
        </p>
      </div>
    </div>
  );
}
