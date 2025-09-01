'use client';

import React, { useState } from 'react';

const CpuChipIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
  </svg>
);

const CubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

const CubeTransparentIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  </svg>
);

const OverviewIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.5 2C6.567 2 5 3.567 5 5.5C5 5.68016 5.01364 5.85714 5.03993 6.02997C3.32436 6.25523 2 7.72295 2 9.5C2 10.4793 2.40223 11.3647 3.05051 12C2.40223 12.6353 2 13.5207 2 14.5C2 15.9018 2.82359 17.1104 4.01353 17.6693C4.00457 17.7785 4 17.8888 4 18C4 20.2091 5.79086 22 8 22C9.19469 22 10.2671 21.4762 11 20.6458V3.05051C10.3647 2.40223 9.47934 2 8.5 2ZM13 3.05051V20.6458C13.7329 21.4762 14.8053 22 16 22C18.2091 22 20 20.2091 20 18C20 17.8888 19.9954 17.7785 19.9865 17.6693C21.1764 17.1104 22 15.9018 22 14.5C22 13.5207 21.5978 12.6353 20.9495 12C21.5978 11.3647 22 10.4793 22 9.5C22 7.72295 20.6756 6.25523 18.9601 6.02997C18.9864 5.85714 19 5.68016 19 5.5C19 3.567 17.433 2 15.5 2C14.5207 2 13.6353 2.40223 13 3.05051Z" />
  </svg>
);

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
    'research-modules': true,
    'forgotten-languages': true,
  });
  const [selectedFile, setSelectedFile] = useState<string>('');

  const fileSystem: FileSystemItem[] = [
    {
      type: 'folder',
      name: 'forgotten-languages',
      path: 'forgotten-languages',
      icon: 'cube', // Cube for categories
      children: [
        { type: 'file', name: 'overview.md', path: 'forgotten-languages/overview.md', size: '89KB', fileType: 'overview', icon: '◈' },
        {
          type: 'folder',
          name: 'military-defense',
          path: 'forgotten-languages/military-defense',
          icon: 'cube-transparent', // Cube transparent for subcategories
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/military-defense/overview.md', size: '67KB', fileType: 'overview', icon: '◈' },
            {
              type: 'folder',
              name: 'sv17q-system',
              path: 'forgotten-languages/military-defense/sv17q-system',
              children: [
                { type: 'file', name: 'specifications.md', path: 'forgotten-languages/military-defense/sv17q-system/specifications.md', size: '124KB', fileType: 'markdown', icon: '◦' },
                { type: 'file', name: 'defense-integration.enc', path: 'forgotten-languages/military-defense/sv17q-system/defense-integration.enc', size: '892KB', fileType: 'encrypted', icon: '◉' }
              ]
            },
            {
              type: 'folder',
              name: 'cassini-diskus',
              path: 'forgotten-languages/military-defense/cassini-diskus',
              children: [
                { type: 'file', name: 'coordinates.dat', path: 'forgotten-languages/military-defense/cassini-diskus/coordinates.dat', size: '3.2MB', fileType: 'data', icon: '◊' },
                { type: 'file', name: 'spatial-analysis.py', path: 'forgotten-languages/military-defense/cassini-diskus/spatial-analysis.py', size: '78KB', fileType: 'python', icon: '◇' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'occult-spirituality',
          path: 'forgotten-languages/occult-spirituality',
          icon: 'cube-transparent',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/occult-spirituality/overview.md', size: '78KB', fileType: 'overview', icon: '◈' },
            {
              type: 'folder',
              name: 'giselians',
              path: 'forgotten-languages/occult-spirituality/giselians',
              children: [
                { type: 'file', name: 'sufism-connections.md', path: 'forgotten-languages/occult-spirituality/giselians/sufism-connections.md', size: '178KB', fileType: 'markdown', icon: '◐' },
                { type: 'file', name: 'theosophy-analysis.pdf', path: 'forgotten-languages/occult-spirituality/giselians/theosophy-analysis.pdf', size: '923KB', fileType: 'pdf', icon: '◆' }
              ]
            },
            {
              type: 'folder',
              name: 'queltron-system',
              path: 'forgotten-languages/occult-spirituality/queltron-system',
              children: [
                { type: 'file', name: 'alchemy-symbols.svg', path: 'forgotten-languages/occult-spirituality/queltron-system/alchemy-symbols.svg', size: '67KB', fileType: 'svg', icon: '◑' },
                { type: 'file', name: 'transformation-protocols.md', path: 'forgotten-languages/occult-spirituality/queltron-system/transformation-protocols.md', size: '145KB', fileType: 'markdown', icon: '◌' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'consciousness-studies',
          path: 'forgotten-languages/consciousness-studies',
          icon: 'cube-transparent',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/consciousness-studies/overview.md', size: '92KB', fileType: 'overview', icon: '◈' },
            {
              type: 'folder',
              name: 'nodespaces',
              path: 'forgotten-languages/consciousness-studies/nodespaces',
              children: [
                { type: 'file', name: 'topology.graph', path: 'forgotten-languages/consciousness-studies/nodespaces/topology.graph', size: '567KB', fileType: 'graph', icon: '◎' },
                { type: 'file', name: 'theory.pdf', path: 'forgotten-languages/consciousness-studies/nodespaces/theory.pdf', size: '1.8MB', fileType: 'pdf', icon: '●' },
                { type: 'file', name: 'consciousness-studies.md', path: 'forgotten-languages/consciousness-studies/nodespaces/consciousness-studies.md', size: '234KB', fileType: 'markdown', icon: '◒' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'linguistic-systems',
          path: 'forgotten-languages/linguistic-systems',
          icon: 'cube-transparent',
          children: [
            { type: 'file', name: 'overview.md', path: 'forgotten-languages/linguistic-systems/overview.md', size: '76KB', fileType: 'overview', icon: '◈' },
            {
              type: 'folder',
              name: 'core-languages',
              path: 'forgotten-languages/linguistic-systems/core-languages',
              children: [
                { type: 'file', name: 'aylid.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/aylid.lexicon', size: '1.2MB', fileType: 'lexicon', icon: '◓' },
                { type: 'file', name: 'yid.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/yid.lexicon', size: '856KB', fileType: 'lexicon', icon: '◓' },
                { type: 'file', name: 'ned.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/ned.lexicon', size: '432KB', fileType: 'lexicon', icon: '◓' },
                { type: 'file', name: 'drizza.lexicon', path: 'forgotten-languages/linguistic-systems/core-languages/drizza.lexicon', size: '234KB', fileType: 'lexicon', icon: '◓' }
              ]
            },
            {
              type: 'folder',
              name: 'translations',
              path: 'forgotten-languages/linguistic-systems/translations',
              children: [
                { type: 'file', name: 'aylid-english.dict', path: 'forgotten-languages/linguistic-systems/translations/aylid-english.dict', size: '2.1MB', fileType: 'dictionary', icon: '◔' },
                { type: 'file', name: 'grammar-patterns.xml', path: 'forgotten-languages/linguistic-systems/translations/grammar-patterns.xml', size: '567KB', fileType: 'xml', icon: '◈' }
              ]
            }
          ]
        },
        {
          type: 'folder',
          name: 'research-data',
          path: 'forgotten-languages/research-data',
          icon: 'cube-transparent',
          children: [
            { type: 'file', name: 'anas-index.db', path: 'forgotten-languages/research-data/anas-index.db', size: '21.9MB', fileType: 'database', icon: '◕' },
            { type: 'file', name: 'community-findings.db', path: 'forgotten-languages/research-data/community-findings.db', size: '4.7MB', fileType: 'database', icon: '◕' },
            { type: 'file', name: 'articles.json', path: 'forgotten-languages/research-data/articles.json', size: '2.4MB', fileType: 'json', icon: '●' }
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
            <span className="expand-icon text-pink-glow flex items-center">
              {item.icon === 'cpu-chip' ? (
                <CpuChipIcon className="w-4 h-4 module-icon-glow" />
              ) : item.icon === 'cube' ? (
                <CubeIcon className="w-4 h-4 module-icon-glow" />
              ) : item.icon === 'cube-transparent' ? (
                <CubeTransparentIcon className="w-4 h-4 module-icon-glow" />
              ) : item.icon && typeof item.icon === 'string' ? (
                item.icon
              ) : (
                isExpanded ? '◢' : '◣'
              )}
            </span>
            <span className={`item-name ${
              item.icon === 'cube' ? 'font-secondary' : 
              item.icon === 'cube-transparent' ? 'font-tertiary' : 
              'font-secondary'
            }`}>{item.name}</span>
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
          <span className="file-icon text-pink-glow flex items-center">
            {item.fileType === 'overview' ? (
              <OverviewIcon className="w-4 h-4 overview-icon-glow" />
            ) : (
              item.icon
            )}
          </span>
          <span className="item-name font-tertiary">{item.name}</span>
          <span className="file-size">{item.size}</span>
        </div>
      );
    }
  };

  const isHeaderExpanded = expandedFolders['research-modules'];

  return (
    <div className="h-full flex flex-col">
      <div className="pb-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer file-explorer-item folder-item"
          onClick={() => setExpandedFolders(prev => ({ ...prev, 'research-modules': !prev['research-modules'] }))}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.4)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.2)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))'}}
          >
            <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
          </svg>
          <h2 className="text-lg font-primary font-semibold module-header-text">MODULES</h2>
          <span className="expand-arrow text-cyan">{isHeaderExpanded ? '▼' : '▶'}</span>
        </div>
      </div>
      
      {isHeaderExpanded && (
        <div className="flex-1 overflow-auto">
          <div className="file-explorer-tree">
            {fileSystem.map(item => renderFileSystemItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};
