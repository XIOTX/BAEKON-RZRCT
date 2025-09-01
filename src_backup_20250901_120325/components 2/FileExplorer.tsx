'use client';

import React, { useState } from 'react';

interface FileSystemItem {
  type: 'folder' | 'file';
  name: string;
  path: string;
  size?: string;
  fileType?: string;
  icon?: string;
  children?: FileSystemItem[];
}

interface FileExplorerProps {
  onFileSelect: (path: string, name: string, type: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'forgotten-languages': true,
  });
  const [selectedFile, setSelectedFile] = useState<string>('');

  const fileSystem: FileSystemItem[] = [
    {
      type: 'folder',
      name: 'forgotten-languages',
      path: 'forgotten-languages',
      children: [
        { type: 'file', name: 'overview.md', path: 'forgotten-languages/overview.md', size: '89KB', fileType: 'overview', icon: '📋' },
        {
          type: 'folder',
          name: 'military-defense',
          path: 'forgotten-languages/military-defense',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/military-defense/overview.md', size: '67KB', fileType: 'overview', icon: '📋' },
            {
              type: 'folder',
              name: 'sv17q-system',
              path: 'forgotten-languages/military-defense/sv17q-system',
              children: [
                { type: 'file', name: 'specifications.md', path: 'forgotten-languages/military-defense/sv17q-system/specifications.md', size: '124KB', fileType: 'markdown', icon: '📝' },
                { type: 'file', name: 'defense-integration.enc', path: 'forgotten-languages/military-defense/sv17q-system/defense-integration.enc', size: '892KB', fileType: 'encrypted', icon: '🔒' }
              ]
            },
            {
              type: 'folder',
              name: 'cassini-diskus',
              path: 'forgotten-languages/military-defense/cassini-diskus',
              children: [
                { type: 'file', name: 'coordinates.dat', path: 'forgotten-languages/military-defense/cassini-diskus/coordinates.dat', size: '3.2MB', fileType: 'data', icon: '📊' },
                { type: 'file', name: 'spatial-analysis.py', path: 'forgotten-languages/military-defense/cassini-diskus/spatial-analysis.py', size: '78KB', fileType: 'python', icon: '🐍' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'occult-spirituality',
          path: 'forgotten-languages/occult-spirituality',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/occult-spirituality/overview.md', size: '78KB', fileType: 'overview', icon: '📋' },
            {
              type: 'folder',
              name: 'giselians',
              path: 'forgotten-languages/occult-spirituality/giselians',
              children: [
                { type: 'file', name: 'sufism-connections.md', path: 'forgotten-languages/occult-spirituality/giselians/sufism-connections.md', size: '178KB', fileType: 'markdown', icon: '🌙' },
                { type: 'file', name: 'theosophy-analysis.pdf', path: 'forgotten-languages/occult-spirituality/giselians/theosophy-analysis.pdf', size: '923KB', fileType: 'pdf', icon: '✨' }
              ]
            },
            {
              type: 'folder',
              name: 'queltron-system',
              path: 'forgotten-languages/occult-spirituality/queltron-system',
              children: [
                { type: 'file', name: 'alchemy-symbols.svg', path: 'forgotten-languages/occult-spirituality/queltron-system/alchemy-symbols.svg', size: '67KB', fileType: 'svg', icon: '⚗️' },
                { type: 'file', name: 'transformation-protocols.md', path: 'forgotten-languages/occult-spirituality/queltron-system/transformation-protocols.md', size: '145KB', fileType: 'markdown', icon: '🔮' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'consciousness-studies',
          path: 'forgotten-languages/consciousness-studies',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/consciousness-studies/overview.md', size: '92KB', fileType: 'overview', icon: '📋' },
            {
              type: 'folder',
              name: 'nodespaces',
              path: 'forgotten-languages/consciousness-studies/nodespaces',
              children: [
                { type: 'file', name: 'topology.graph', path: 'forgotten-languages/consciousness-studies/nodespaces/topology.graph', size: '567KB', fileType: 'graph', icon: '🕸️' },
                { type: 'file', name: 'theory.pdf', path: 'forgotten-languages/consciousness-studies/nodespaces/theory.pdf', size: '1.8MB', fileType: 'pdf', icon: '📄' },
                { type: 'file', name: 'consciousness-studies.md', path: 'forgotten-languages/consciousness-studies/nodespaces/consciousness-studies.md', size: '234KB', fileType: 'markdown', icon: '💭' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'linguistic-systems',
          path: 'forgotten-languages/linguistic-systems',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/linguistic-systems/overview.md', size: '76KB', fileType: 'overview', icon: '📋' },
            {
              type: 'folder',
              name: 'core-languages',
              path: 'forgotten-languages/linguistic-systems/core-languages',
              children: [
                { type: 'file', name: 'aylid.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/aylid.lexicon', size: '1.2MB', fileType: 'lexicon', icon: '📜' },
                { type: 'file', name: 'yid.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/yid.lexicon', size: '856KB', fileType: 'lexicon', icon: '📜' },
                { type: 'file', name: 'ned.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/ned.lexicon', size: '432KB', fileType: 'lexicon', icon: '📜' },
                { type: 'file', name: 'drizza.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/drizza.lexicon', size: '234KB', fileType: 'lexicon', icon: '📜' }
              ]
            },
            {
              type: 'folder',
              name: 'translations',
              path: 'forgotten-languages/linguistic-systems/translations',
              children: [
                { type: 'file', name: 'aylid-english.dict', path: 'forgotten-languages/linguistic-systems/translations/aylid-english.dict', size: '2.1MB', fileType: 'dictionary', icon: '🔄' },
                { type: 'file', name: 'grammar-patterns.xml', path: 'forgotten-languages/linguistic-systems/translations/grammar-patterns.xml', size: '567KB', fileType: 'xml', icon: '📋' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'research-data',
          path: 'forgotten-languages/research-data',
          children: [
            { type: 'file', name: 'anas-index.db', path: 'forgotten-languages/research-data/anas-index.db', size: '21.9MB', fileType: 'database', icon: '🗄️' },
            { type: 'file', name: 'community-findings.db', path: 'forgotten-languages/research-data/community-findings.db', size: '4.7MB', fileType: 'database', icon: '🗄️' },
            { type: 'file', name: 'articles.json', path: 'forgotten-languages/research-data/articles.json', size: '2.4MB', fileType: 'json', icon: '📄' }
          ]
        }
      ]
    }
  ];

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const selectFile = (filePath: string, fileName: string, fileType: string) => {
    setSelectedFile(filePath);
    onFileSelect(filePath, fileName, fileType);
  };

  const renderFileSystemItem = (item: FileSystemItem, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders[item.path];
    const isSelected = selectedFile === item.path;
    const indentStyle = { paddingLeft: `${depth * 20 + 8}px` };

    if (item.type === 'folder') {
      return (
        <div key={item.path}>
          <div 
            className={`file-explorer-item folder-item ${isSelected ? 'selected' : ''}`}
            style={indentStyle}
            onClick={() => toggleFolder(item.path)}
          >
            <span className="expand-icon">
              {isExpanded ? '📂' : '📁'}
            </span>
            <span className="item-name">{item.name}</span>
            <span className="expand-arrow">{isExpanded ? '▼' : '▶'}</span>
          </div>
          {isExpanded && item.children && (
            <div className="folder-contents">
              {item.children.map(child => renderFileSystemItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          key={item.path}
          className={`file-explorer-item file-item ${isSelected ? 'selected' : ''}`}
          style={indentStyle}
          onClick={() => selectFile(item.path, item.name, item.fileType || '')}
        >
          <span className="file-icon">{item.icon}</span>
          <span className="item-name">{item.name}</span>
          <span className="file-size">{item.size}</span>
        </div>
      );
    }
  };

  return (
    <div className="cyber-border h-full flex flex-col">
      <div className="p-4 border-b border-cyan-400/30">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">🗂️ FL Research Explorer</h2>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-green-400">Connected</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="file-explorer-tree">
          {fileSystem.map(item => renderFileSystemItem(item))}
        </div>
      </div>
    </div>
  );
};
