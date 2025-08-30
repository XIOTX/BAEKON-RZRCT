'use client';

import { useState, useEffect } from 'react';
import { FLKnowledgeNode } from '@/lib/fl-knowledge';
import { AnasIndexSearch } from './AnasIndexSearch';
import { LexiconSearch } from './LexiconSearch';
import { VaultSearch } from './VaultSearch';
import { AnalysisView } from './AnalysisView';

interface ContentAreaProps {
  selectedPath: string[];
  content: {
    node: FLKnowledgeNode;
    path: string[];
    timestamp: number;
  } | null;
}

export function ContentArea({ selectedPath, content }: ContentAreaProps) {
  const [loading, setLoading] = useState(false);

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">BÆKON FL Research</h1>
          <p className="text-gray-400 max-w-md">
            Select a topic from the knowledge tree to begin exploring the Forgotten Languages corpus
          </p>
        </div>
      </div>
    );
  }

  const { node } = content;

  const renderContent = () => {
    switch (node.contentType) {
      case 'search':
        if (node.dataSource === 'anas-index') {
          return <AnasIndexSearch node={node} />;
        }
        if (node.dataSource === 'lexicon') {
          return <LexiconSearch node={node} />;
        }
        if (node.dataSource === 'vault') {
          return <VaultSearch node={node} />;
        }
        break;
        
      case 'analysis':
        return <AnalysisView node={node} />;
        
      case 'interactive':
        if (node.dataSource === 'lexicon') {
          return <LexiconSearch node={node} interactive={true} />;
        }
        break;
        
      case 'reference':
        return (
          <div className="p-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold mb-2">External References</h3>
              <p className="text-gray-300">
                This section provides links to external community sources and cross-references.
                Content is being prepared for integration.
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-6">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-2">Overview</h3>
              <p className="text-gray-300 mb-4">{node.description}</p>
              
              {node.children && node.children.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Subtopics:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {node.children.map(child => (
                      <div key={child.id} className="flex items-center p-2 bg-black/20 rounded">
                        <span className="mr-2">{child.icon}</span>
                        <span className={`text-sm ${child.color}`}>{child.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-purple-500/30 p-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-3">{node.icon}</span>
          <h1 className={`text-2xl font-bold ${node.color}`}>{node.title}</h1>
        </div>
        <p className="text-gray-400">{node.description}</p>
        
        {/* Breadcrumb */}
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <span>FL Research</span>
          {selectedPath.map((segment, index) => (
            <span key={index}>
              <span className="mx-2">→</span>
              <span className="text-gray-400">{segment}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-gray-400">Loading FL research data...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
