'use client';

import { useState } from 'react';
import { FL_KNOWLEDGE_TREE, FLKnowledgeNode, getNodeByPath } from '@/lib/fl-knowledge';

interface KnowledgeTreeProps {
  selectedPath: string[];
  onPathSelect: (path: string[]) => void;
  onContentLoad: (content: any) => void;
}

export function KnowledgeTree({ selectedPath, onPathSelect, onContentLoad }: KnowledgeTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const selectNode = (path: string[]) => {
    onPathSelect(path);
    const node = getNodeByPath(path);
    if (node) {
      onContentLoad({
        node,
        path,
        timestamp: Date.now()
      });
    }
  };

  const renderNode = (node: FLKnowledgeNode, currentPath: string[] = [], depth: number = 0) => {
    const fullPath = [...currentPath, node.id];
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = JSON.stringify(selectedPath) === JSON.stringify(fullPath.slice(1)); // Remove 'root'
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center py-2 px-3 cursor-pointer rounded-lg transition-all duration-200
            hover:bg-purple-500/20 
            ${isSelected ? 'bg-purple-500/30 border-l-2 border-purple-400' : ''}
            ${depth > 0 ? 'ml-4' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            if (depth > 0) { // Don't select root
              selectNode(fullPath.slice(1));
            }
          }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <span className="mr-2 text-gray-400 text-sm">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          
          {/* Node Icon */}
          <span className="mr-3 text-lg">{node.icon}</span>
          
          {/* Node Content */}
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${node.color} truncate`}>
              {node.title}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {node.description}
            </div>
          </div>

          {/* Data Source Indicator */}
          {node.dataSource && (
            <div className="ml-2 text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
              {node.dataSource === 'anas-index' && '📚'}
              {node.dataSource === 'lexicon' && '📖'}
              {node.dataSource === 'vault' && '🗄️'}
              {node.dataSource === 'external' && '🔗'}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children!.map(child => 
              renderNode(child, fullPath, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">FL Knowledge Tree</h2>
        <p className="text-sm text-gray-400">
          Navigate the structured FL research environment
        </p>
      </div>
      
      {renderNode(FL_KNOWLEDGE_TREE)}
      
      {/* Status Indicator */}
      <div className="mt-6 p-3 bg-black/30 rounded-lg">
        <div className="text-xs text-gray-400 mb-2">System Status</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Ana's Index</span>
            <span className="text-green-400">✓ Online</span>
          </div>
          <div className="flex justify-between">
            <span>Lexicon</span>
            <span className="text-yellow-400">⚠ DB Issue</span>
          </div>
          <div className="flex justify-between">
            <span>Vault</span>
            <span className="text-green-400">✓ Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
