'use client';

import React, { useState } from 'react';

interface SearchResult {
  title?: string;
  author?: string;
  date_posted?: string;
  english_text?: string;
  tags?: string;
  surface?: string;
  normalized?: string;
  gloss?: string;
  confidence?: number;
  pos?: string;
  content?: string;
  excerpt?: string;
}

export const SearchTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('anas');
  
  // Ana's Index Search
  const [anasQuery, setAnasQuery] = useState('');
  const [anasResults, setAnasResults] = useState<SearchResult[]>([]);
  const [anasLoading, setAnasLoading] = useState(false);
  const [anasError, setAnasError] = useState<string | null>(null);

  // Lexicon Search
  const [lexiconQuery, setLexiconQuery] = useState('');
  const [lexiconResults, setLexiconResults] = useState<SearchResult[]>([]);
  const [lexiconLoading, setLexiconLoading] = useState(false);
  const [lexiconError, setLexiconError] = useState<string | null>(null);

  // Vault Search
  const [vaultQuery, setVaultQuery] = useState('');
  const [vaultResults, setVaultResults] = useState<SearchResult[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const searchAnasIndex = async () => {
    if (!anasQuery.trim()) return;
    
    setAnasLoading(true);
    setAnasError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8787/anas-index/search?q=${encodeURIComponent(anasQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setAnasResults(data);
    } catch (err) {
      setAnasError(err instanceof Error ? err.message : 'Unknown error');
      setAnasResults([]);
    } finally {
      setAnasLoading(false);
    }
  };

  const searchLexicon = async () => {
    if (!lexiconQuery.trim()) return;
    
    setLexiconLoading(true);
    setLexiconError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8787/lexicon/search?q=${encodeURIComponent(lexiconQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setLexiconResults(data);
    } catch (err) {
      setLexiconError(err instanceof Error ? err.message : 'Unknown error');
      setLexiconResults([]);
    } finally {
      setLexiconLoading(false);
    }
  };

  const searchVault = async () => {
    if (!vaultQuery.trim()) return;
    
    setVaultLoading(true);
    setVaultError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8787/vault/search?q=${encodeURIComponent(vaultQuery)}`);
      if (!response.ok) throw new Error('Vault search failed');
      const data = await response.json();
      setVaultResults(data);
    } catch (err) {
      setVaultError(err instanceof Error ? err.message : 'Unknown error');
      setVaultResults([]);
    } finally {
      setVaultLoading(false);
    }
  };

  return (
    <div className="cyber-border h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-cyan-400/30">
        {[
          { id: 'anas', label: '📚 Ana\'s Index', icon: '📚' },
          { id: 'lexicon', label: '📜 Lexicon', icon: '📜' },
          { id: 'vault', label: '🗄️ Vault', icon: '🗄️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-cyan-400/20 text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'anas' && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={anasQuery}
                onChange={(e) => setAnasQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchAnasIndex()}
                placeholder="Search Ana's Index..."
                className="cyber-input flex-1"
              />
              <button 
                onClick={searchAnasIndex}
                disabled={anasLoading || !anasQuery.trim()}
                className="cyber-button px-4"
              >
                {anasLoading ? '...' : '🔍'}
              </button>
            </div>
            
            {anasError && (
              <div className="cyber-border p-3 border-red-500/50 bg-red-500/10">
                <p className="text-red-400 text-sm">Error: {anasError}</p>
              </div>
            )}
            
            {anasResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-auto">
                <p className="text-cyan-400 text-sm">Found {anasResults.length} results:</p>
                {anasResults.map((result, i) => (
                  <div key={i} className="cyber-border p-3">
                    <h4 className="text-purple-400 font-semibold text-sm mb-1">{result.title}</h4>
                    <p className="text-gray-400 text-xs mb-2">{result.author} • {result.date_posted}</p>
                    {result.english_text && (
                      <p className="text-gray-300 text-xs">{result.english_text.substring(0, 200)}...</p>
                    )}
                    {result.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.tags.split(',').map((tag, j) => (
                          <span key={j} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'lexicon' && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={lexiconQuery}
                onChange={(e) => setLexiconQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLexicon()}
                placeholder="Search FL Lexicon..."
                className="cyber-input flex-1"
              />
              <button 
                onClick={searchLexicon}
                disabled={lexiconLoading || !lexiconQuery.trim()}
                className="cyber-button px-4"
              >
                {lexiconLoading ? '...' : '🔍'}
              </button>
            </div>
            
            {lexiconError && (
              <div className="cyber-border p-3 border-red-500/50 bg-red-500/10">
                <p className="text-red-400 text-sm">Error: {lexiconError}</p>
              </div>
            )}
            
            {lexiconResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-auto">
                <p className="text-cyan-400 text-sm">Found {lexiconResults.length} entries:</p>
                {lexiconResults.map((result, i) => (
                  <div key={i} className="cyber-border p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-purple-400 font-semibold text-sm">{result.surface || result.normalized}</h4>
                      <span className="text-green-400 text-xs">
                        {Math.round((result.confidence || 0) * 100)}%
                      </span>
                    </div>
                    {result.gloss && (
                      <p className="text-gray-300 text-xs mb-1">"{result.gloss}"</p>
                    )}
                    {result.pos && (
                      <p className="text-gray-400 text-xs">Part of speech: {result.pos}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={vaultQuery}
                onChange={(e) => setVaultQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchVault()}
                placeholder="Search community vault..."
                className="cyber-input flex-1"
              />
              <button 
                onClick={searchVault}
                disabled={vaultLoading || !vaultQuery.trim()}
                className="cyber-button px-4"
              >
                {vaultLoading ? '...' : '🔍'}
              </button>
            </div>
            
            {vaultError && (
              <div className="cyber-border p-3 border-red-500/50 bg-red-500/10">
                <p className="text-red-400 text-sm">Error: {vaultError}</p>
              </div>
            )}
            
            {vaultResults.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-auto">
                <p className="text-cyan-400 text-sm">Found {vaultResults.length} results:</p>
                {vaultResults.map((result, i) => (
                  <div key={i} className="cyber-border p-3">
                    <h4 className="text-cyan-400 font-semibold text-sm">{result.title || 'Community Finding'}</h4>
                    <p className="text-gray-300 text-xs">{result.content || result.excerpt}</p>
                    {result.confidence && (
                      <div className="text-xs text-yellow-400 mt-1">
                        Confidence: {result.confidence}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
