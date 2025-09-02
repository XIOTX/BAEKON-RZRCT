'use client';

import React, { useState, useEffect } from 'react';
import { getFileContent, ContentData } from '@/services/contentService';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ContentDisplayProps {
  selectedFile: {path: string, name: string, type: string} | null;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ selectedFile }) => {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalImage, setModalImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    if (selectedFile) {
      loadContent();
    } else {
      setContentData(null);
      setRawMarkdown(null);
    }
  }, [selectedFile]);

  const loadContent = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const content = await getFileContent(selectedFile.path, selectedFile.name, selectedFile.type);
      setContentData(content);

      // If this is an FL article, also load the raw markdown content
      if (selectedFile.path.startsWith('fl-knowledge-base/') && selectedFile.path.endsWith('.md')) {
        try {
          const response = await fetch(`/api/content?path=${encodeURIComponent(selectedFile.path)}`);
          if (response.ok) {
            const data = await response.json();
            setRawMarkdown(data.content);
          } else {
            setRawMarkdown(null);
          }
        } catch (markdownError) {
          console.error('Error loading markdown:', markdownError);
          setRawMarkdown(null);
        }
      } else {
        setRawMarkdown(null);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContentData({
        type: 'error',
        title: '❌ Error Loading File',
        description: 'Unable to load the selected file',
        content: 'Please try selecting a different file or check your connection.'
      });
      setRawMarkdown(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-lg mb-4">Content Loading...</div>
          <div className="text-gray-400">Preparing FL research data...</div>
        </div>
      </div>
    );
  }

  if (!selectedFile || !contentData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-purple-400 mb-4">🗂️ FL Research Explorer</h2>
        <p className="text-gray-300 mb-6">Welcome to the Forgotten Languages Research Environment</p>
        <p className="text-gray-400">Select a file from the explorer to begin your research journey.</p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 overflow-y-auto overflow-x-hidden">
      {/* File Header */}
      <div className="border-b border-cyan-400/30 pb-4">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{contentData.title}</h1>
        {contentData.path && (
          <div className="text-sm text-gray-400 font-mono">
            📁 {contentData.path}
            {contentData.size && <span className="ml-4">📏 {contentData.size}</span>}
          </div>
        )}
      </div>
      
      {/* File Description */}
      <div className="cyber-border p-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-3">Description</h3>
        <p className="text-gray-300 mb-4">{contentData.description}</p>
        <p className="text-gray-400">{contentData.content}</p>
      </div>

      {/* File Metadata */}
      {contentData.metadata && (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">File Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(contentData.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400 font-medium">{key}:</span>
                <span className="text-gray-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {contentData.features && (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3">Available Features</h3>
          <p className="text-gray-300">{contentData.features}</p>
        </div>
      )}

      {/* Sample Data Display */}
      {contentData.sampleData && (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">📋 Sample Data</h3>
          <div className="space-y-3">
            {contentData.sampleData.map((item, index) => (
              <div key={index} className="cyber-border p-4 bg-gray-900/30">
                {/* Database entries (Ana's Index, Vault) */}
                {item.title && (
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-cyan-400 text-sm">{item.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.confidence?.includes('High') ? 'bg-green-900/50 text-green-300' :
                        item.confidence?.includes('Medium') ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {item.confidence}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{item.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>📁 {item.category}</span>
                      <span>📅 {item.date}</span>
                      {item.contributor && <span>👤 {item.contributor}</span>}
                    </div>
                  </div>
                )}
                
                {/* Lexicon entries */}
                {item.term && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-purple-400">{item.term}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-cyan-400">{item.translation}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.confidence === 'High' ? 'bg-green-900/50 text-green-300' :
                        item.confidence === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {item.confidence}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      📁 {item.category}
                    </div>
                  </div>
                )}
                
                {/* Coordinate entries */}
                {item.lat && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-cyan-400">{item.id}</span>
                        <span className="text-gray-300 font-mono text-sm">
                          {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.confidence === 'High' ? 'bg-green-900/50 text-green-300' :
                        'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {item.confidence}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>📍 {item.type}</span>
                      <span>⛰️ {item.elevation}m</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualizations */}
      {contentData.visualizations && (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📊 Data Visualizations</h3>
          <div className="space-y-4">
            {contentData.visualizations.map((viz, index) => (
              <div key={index} className="cyber-border p-4 bg-gray-900/50">
                <h4 className="text-cyan-400 font-semibold mb-3">{viz.title}</h4>
                <pre className="text-green-400 text-xs font-mono whitespace-pre overflow-x-auto">
                  {viz.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Content Display */}
      {rawMarkdown ? (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📄 FL Research Document</h3>
          <div className="bg-gray-900/50 p-6 rounded border border-cyan-400/30">
            {/* Image Gallery */}
            {(() => {
              const imageMatches = rawMarkdown.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
              if (imageMatches) {
                return (
                  <div className="mb-6">
                    <h4 className="text-cyan-400 font-semibold mb-3">🖼️ Technical Diagrams ({imageMatches.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {imageMatches.map((match, index) => {
                        const [, alt, src] = match.match(/!\[([^\]]*)\]\(([^)]+)\)/) || [];
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-gray-800 border border-cyan-400/30 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={src} 
                                alt={alt}
                                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={() => {
                                  console.log('Image clicked:', src);
                                  setModalImage({src, alt});
                                }}
                                onError={(e) => {
                                  console.error('Failed to load image:', src);
                                  const target = e.currentTarget;
                                  target.style.border = '2px dashed #ef4444';
                                  target.style.background = '#1f2937';
                                }}
                              />
                            </div>
                            {alt && (
                              <span className="text-xs text-gray-400 text-center mt-1 leading-tight w-20">
                                {alt}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            {/* Display the rest of the content (images are skipped in MarkdownRenderer) */}
            <MarkdownRenderer content={rawMarkdown} />
          </div>
        </div>
      ) : contentData.documentContent && (
        <div className="cyber-border p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📄 Document Content</h3>
          <div className="bg-gray-900/50 p-6 rounded border border-cyan-400/30">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {contentData.documentContent}
            </pre>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => {
            console.log('Modal background clicked');
            setModalImage(null);
          }}
        >
          <div className="relative">
            <img 
              src={modalImage.src} 
              alt={modalImage.alt}
              className="max-w-[90vw] max-h-[90vh] rounded border border-cyan-400/50 shadow-2xl"
              onClick={(e) => {
                console.log('Image clicked in modal');
                e.stopPropagation();
              }}
            />
            <button 
              className="absolute -top-10 right-0 text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1 text-sm font-bold"
              onClick={(e) => {
                console.log('Close button clicked');
                e.stopPropagation();
                setModalImage(null);
              }}
            >
              CLOSE
            </button>
            {modalImage.alt && (
              <div className="absolute -bottom-10 left-0 right-0 text-center text-white text-sm">
                {modalImage.alt}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
