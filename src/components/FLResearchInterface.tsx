'use client';

import React, { useState, useEffect } from 'react';

interface FLDocument {
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

interface SearchResult {
  document: FLDocument;
  score: number;
  matches: string[];
}

export const FLResearchInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<FLDocument | null>(null);
  const [editingTags, setEditingTags] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  // Load initial data
  useEffect(() => {
    loadTags();
    loadCategories();
    performSearch(); // Load all documents initially
  }, []);

  const loadTags = async () => {
    try {
      const response = await fetch('/api/fl-tags');
      const data = await response.json();
      setAvailableTags(data.tags || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/fl-tags?type=categories');
      const data = await response.json();
      setAvailableCategories(data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
      if (selectedCategory) params.set('category', selectedCategory);

      const response = await fetch(`/api/fl-search?${params}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    setLoading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const startEditingTags = (document: FLDocument) => {
    setEditingTags(document.id);
    setTagInput(document.tags.join(', '));
  };

  const saveDocumentTags = async (documentId: string) => {
    try {
      const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('/api/fl-tags', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, tags: newTags })
      });

      if (response.ok) {
        // Update local state
        setResults(prev => prev.map(result => 
          result.document.id === documentId 
            ? { ...result, document: { ...result.document, tags: newTags } }
            : result
        ));
        
        if (selectedDocument?.id === documentId) {
          setSelectedDocument(prev => prev ? { ...prev, tags: newTags } : null);
        }

        // Refresh available tags
        loadTags();
        
        setEditingTags(null);
        setTagInput('');
      } else {
        console.error('Failed to update tags');
      }
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  // Trigger search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags, selectedCategory]);

  return (
    <div className="flex h-full bg-gray-900 text-gray-100">
      {/* Left Panel - Search & Filters */}
      <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search FL Documents
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search titles, content, authors..."
              className="cyber-input w-full"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="cyber-input w-full"
            >
              <option value="">All Categories</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Tags ({selectedTags.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`block w-full text-left px-3 py-1 text-xs rounded transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedTags.length > 0 || selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
                setSelectedCategory('');
              }}
              className="cyber-button w-full bg-red-500/20 hover:bg-red-500/30 text-red-400"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-400">
              Results ({results.length})
            </h3>
            {loading && <div className="text-cyan-400 text-sm">Searching...</div>}
          </div>

          <div className="space-y-2">
            {results.map((result, i) => (
              <div
                key={result.document.id}
                onClick={() => setSelectedDocument(result.document)}
                className={`cyber-border p-3 cursor-pointer transition-colors ${
                  selectedDocument?.id === result.document.id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : 'hover:bg-gray-800/50'
                }`}
              >
                <h4 className="text-orange-400 font-semibold text-sm mb-1">
                  {result.document.title}
                </h4>
                <p className="text-gray-400 text-xs mb-1">
                  {result.document.category} • {result.document.author}
                </p>
                <p className="text-gray-300 text-xs mb-2">
                  {result.document.excerpt}
                </p>
                
                {/* Tags */}
                {result.document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {result.document.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Document View */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedDocument ? (
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <h1 className="text-2xl font-bold text-orange-400 mb-2">
                {selectedDocument.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Category: {selectedDocument.category}</span>
                {selectedDocument.author && <span>Author: {selectedDocument.author}</span>}
                {selectedDocument.date && <span>Date: {selectedDocument.date}</span>}
              </div>
            </div>

            {/* Tag Management */}
            <div className="cyber-border p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-400">Tags</h3>
                {editingTags !== selectedDocument.id && (
                  <button
                    onClick={() => startEditingTags(selectedDocument)}
                    className="cyber-button text-xs px-3 py-1"
                  >
                    Edit Tags
                  </button>
                )}
              </div>

              {editingTags === selectedDocument.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter tags separated by commas..."
                    className="cyber-input w-full text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveDocumentTags(selectedDocument.id)}
                      className="cyber-button text-xs px-3 py-1 bg-green-500/20 text-green-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTags(null);
                        setTagInput('');
                      }}
                      className="cyber-button text-xs px-3 py-1 bg-red-500/20 text-red-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedDocument.tags.length > 0 ? (
                    selectedDocument.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No tags assigned</span>
                  )}
                </div>
              )}
            </div>

            {/* Document Content */}
            <div className="cyber-border p-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Content</h3>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 font-tertiary text-sm leading-relaxed">
                  {selectedDocument.content}
                </pre>
              </div>
            </div>

            {/* Images */}
            {selectedDocument.images && selectedDocument.images.length > 0 && (
              <div className="cyber-border p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedDocument.images.map((image, i) => (
                    <div key={i} className="cyber-border p-2">
                      <img
                        src={image}
                        alt={`Document image ${i + 1}`}
                        className="w-full h-auto rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-lg">Select a document to view details</p>
              <p className="text-sm">Use the search and filters to find FL research</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FLResearchInterface;
