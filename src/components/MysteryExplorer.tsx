'use client';

import React, { useState, useEffect } from 'react';

interface FileSystemItem {
  type: 'folder' | 'file';
  name: string;
  path: string;
  size?: string;
  fileType?: string;
  icon?: string;
  children?: FileSystemItem[];
}

export const MysteryExplorer: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'forgotten-languages': true,
    'forgotten-languages/military-defense': false,
    'forgotten-languages/occult-spirituality': false,
    'forgotten-languages/consciousness-studies': false,
    'forgotten-languages/linguistic-systems': false,
    'forgotten-languages/research-data': false
  });
  
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [sectionTitle, setSectionTitle] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('explorer');

  // Search states
  const [anasQuery, setAnasQuery] = useState('');
  const [anasResults, setAnasResults] = useState<any[]>([]);
  const [anasLoading, setAnasLoading] = useState(false);
  const [anasError, setAnasError] = useState<string | null>(null);

  const [lexiconQuery, setLexiconQuery] = useState('');
  const [lexiconResults, setLexiconResults] = useState<any[]>([]);
  const [lexiconLoading, setLexiconLoading] = useState(false);
  const [lexiconError, setLexiconError] = useState<string | null>(null);

  const [vaultQuery, setVaultQuery] = useState('');
  const [vaultResults, setVaultResults] = useState<any[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

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
    setCurrentSection(filePath);
    setSectionTitle(fileName);
    setFileType(fileType);
  };

  const navigateToPath = (pathArray: string[]) => {
    setCurrentPath(pathArray);
  };

  // Search functions
  const searchAnasIndex = async () => {
    if (!anasQuery.trim()) return;
    
    setAnasLoading(true);
    setAnasError(null);
    try {
      const response = await fetch(`/api/anas-index/search?q=${encodeURIComponent(anasQuery)}`);
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

  const generateAIResponse = (query: string) => {
    const responses = {
      'overview': `Based on the FL knowledge hierarchy, I can provide structured guidance on Forgotten Languages research domains:

🛡️ **Military & Defense Applications** (High Confidence - FL Direct)
- SV17Q System: Advanced strategic positioning
- Cassini Diskus: Global spatial navigation (50,000+ coordinates)
- Defense Integration: Classified operational protocols

🔮 **Occult & Spirituality Studies** (Medium Confidence - Interpretive)
- Giselians: Mystical traditions with Sufism connections
- Queltron System: Alchemical transformation protocols
- Esoteric frameworks requiring careful analysis

🧠 **Consciousness Studies** (Medium Confidence - Theoretical)
- NodeSpaces: Information processing architecture
- Consciousness mapping and cognitive modeling
- Advanced awareness state research

🗣️ **Linguistic Systems** (High Confidence - FL Direct)
- Core languages: Aylid, Yid, Ned, Drizza
- 2,447 lexicon entries with confidence scores
- Translation frameworks and pattern recognition

📊 **Research Data** (Variable Confidence - Source Dependent)
- Ana's Index: 21.9MB primary FL corpus
- Community Vault: Collaborative research findings
- Analytical tools and cross-referencing systems

**Navigation Strategy**: Start with domain overviews → drill down to specific systems → access implementation details → cross-reference related topics.

What specific area would you like to explore further?`,
      
      'default': `I'm your FL Research Guide. I can help you navigate the Forgotten Languages knowledge hierarchy with precision and provenance.

**Available Research Domains:**
- Military & Defense Applications
- Occult & Spirituality Studies  
- Consciousness & Cognitive Studies
- Linguistic Systems & Translation
- Research Data & Analysis

**Search Tools Available:**
- Ana's Index (21.9MB FL corpus)
- Lexicon Search (2,447 terms)
- Community Vault (research findings)

**My Principles:**
- No Source, No Answer (always provide provenance)
- Structured Navigation (guide through FL hierarchy)
- Confidence Indicators (mark source reliability)
- Progressive Disclosure (start broad, drill down)

What would you like to explore? I can provide overviews, detailed analysis, or help you navigate specific research pathways.`
    };

    return responses[query.toLowerCase().includes('overview') ? 'overview' : 'default'];
  };

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setAiLoading(true);
    try {
      // Generate contextual response based on current state
      const response = generateAIResponse(aiQuery);
      setAiResponse(response);
    } catch (err) {
      setAiResponse('Error generating response. Please try again.');
    } finally {
      setAiLoading(false);
    }
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
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
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
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-display flex flex-col">
      {/* Header */}
      <div className="cyber-border m-4 mb-0 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-cyan">🗂️ BÆKON Mystery Explorer</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
            <span className="text-sm text-green">SYSTEMS ACTIVE</span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="flex flex-1 m-4 mt-2 space-x-4 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div className="w-80 cyber-border p-0 flex flex-col">
          <div className="p-4 border-b border-cyan/30">
            <h2 className="text-lg font-semibold text-cyan mb-2">🗂️ FL Research Explorer</h2>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
              <span className="text-green">Connected</span>
            </div>
          </div>

          {/* Breadcrumb */}
          {currentPath.length > 0 && (
            <div className="px-4 py-2 bg-gray-900/50 border-b border-cyan/20">
              <div className="flex items-center space-x-1 text-sm text-gray-300">
                <span className="cursor-pointer hover:text-cyan" onClick={() => navigateToPath([])}>🏠</span>
                {currentPath.map((folder, index) => (
                  <React.Fragment key={index}>
                    <span>/</span>
                    <span className="cursor-pointer hover:text-cyan" onClick={() => navigateToPath(currentPath.slice(0, index + 1))}>
                      {folder}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          
          {/* File Tree */}
          <div className="flex-1 overflow-auto">
            <div className="file-explorer-tree">
              {fileSystem.map(item => renderFileSystemItem(item))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 cyber-border p-6 overflow-auto">
          {currentSection ? (
            <div>
              <h2 className="text-2xl font-bold text-purple mb-4">{sectionTitle}</h2>
              <div className="space-y-6">
                <div className="cyber-border p-4">
                  <h3 className="text-lg font-semibold text-cyan mb-2">📄 File Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-400">Path:</span> <span className="text-white">{currentSection}</span></div>
                    <div><span className="text-gray-400">Type:</span> <span className="text-white">{fileType}</span></div>
                  </div>
                </div>
                
                <div className="cyber-border p-4">
                  <h3 className="text-lg font-semibold text-green mb-2">🔍 Content Preview</h3>
                  <p className="text-gray-300">
                    {fileType === 'overview' && 'Comprehensive overview document with strategic navigation and domain analysis.'}
                    {fileType === 'markdown' && 'Detailed documentation with structured content and analysis.'}
                    {fileType === 'database' && 'Structured data repository with searchable content and metadata.'}
                    {fileType === 'lexicon' && 'Linguistic database with term definitions and confidence scores.'}
                    {fileType === 'data' && 'Raw data files with coordinate information and spatial analysis.'}
                    {fileType === 'encrypted' && '🔒 Encrypted content requiring security clearance.'}
                    {!fileType && 'Select a file to view detailed content information.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-purple mb-4">🗂️ FL Research Explorer</h2>
              <p className="text-gray-300 mb-6">Welcome to the Forgotten Languages Research Environment</p>
              <p className="text-gray-400">Select a file from the explorer to begin your research journey.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Tools */}
        <div className="w-96 cyber-border p-0 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-cyan/30">
            {[
              { id: 'explorer', label: '🔍 Search', icon: '🔍' },
              { id: 'ai', label: '🤖 AI Guide', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-cyan/20 text-cyan border-b-2 border-cyan' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === 'explorer' && (
              <div className="p-4 space-y-6">
                {/* Ana's Index Search */}
                <div>
                  <h3 className="text-lg font-semibold text-purple mb-3">📚 Ana's Index</h3>
                  <div className="space-y-3">
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
                      <div className="space-y-2 max-h-40 overflow-auto">
                        <p className="text-cyan text-sm">Found {anasResults.length} results:</p>
                        {anasResults.map((result, i) => (
                          <div key={i} className="cyber-border p-3">
                            {result.url ? (
                              <a 
                                href={result.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ana-link inline-flex items-center gap-2 transition-colors underline"
                              >
                                <h4 className="font-semibold text-sm mb-1">
                                  {result.title}
                                </h4>
                                <span className="text-xs text-cyan">↗</span>
                              </a>
                            ) : (
                              <h4 className="text-purple font-semibold text-sm mb-1">{result.title}</h4>
                            )}
                            <p className="text-gray-400 text-xs">{result.author} • {result.date_posted}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lexicon Search */}
                <div>
                  <h3 className="text-lg font-semibold text-purple mb-3">📜 Lexicon</h3>
                  <div className="space-y-3">
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
                      <div className="space-y-2 max-h-40 overflow-auto">
                        <p className="text-cyan text-sm">Found {lexiconResults.length} entries:</p>
                        {lexiconResults.map((result, i) => (
                          <div key={i} className="cyber-border p-3">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-purple font-semibold text-sm">{result.surface || result.normalized}</h4>
                              <span className="text-green text-xs">
                                {Math.round((result.confidence || 0) * 100)}%
                              </span>
                            </div>
                            {result.gloss && (
                              <p className="text-gray-300 text-xs">"{result.gloss}"</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vault Search */}
                <div>
                  <h3 className="text-lg font-semibold text-purple mb-3">🗄️ Vault</h3>
                  <div className="space-y-3">
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
                      <div className="space-y-2 max-h-40 overflow-auto">
                        <p className="text-cyan text-sm">Found {vaultResults.length} results:</p>
                        {vaultResults.map((result, i) => (
                          <div key={i} className="cyber-border p-3">
                            <h4 className="text-cyan font-semibold text-sm">{result.title || 'Community Finding'}</h4>
                            <p className="text-gray-300 text-xs">{result.content || result.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-purple mb-3">🤖 AI Research Guide</h3>
                
                {/* AI Response */}
                <div className="cyber-border p-4 min-h-[200px] max-h-[300px] overflow-auto">
                  {aiResponse ? (
                    <div className="text-sm text-gray-300 whitespace-pre-wrap">{aiResponse}</div>
                  ) : (
                    <p className="text-gray-500 text-sm">Ask me anything about FL research...</p>
                  )}
                  {aiLoading && (
                    <div className="text-cyan text-sm">Analyzing FL patterns...</div>
                  )}
                </div>

                {/* AI Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                    placeholder="Ask about FL research..."
                    className="cyber-input flex-1"
                    disabled={aiLoading}
                  />
                  <button
                    onClick={handleAIQuery}
                    disabled={aiLoading || !aiQuery.trim()}
                    className="cyber-button px-4"
                  >
                    {aiLoading ? '...' : '🚀'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};