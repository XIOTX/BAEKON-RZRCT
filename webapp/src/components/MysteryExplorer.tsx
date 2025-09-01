import React, { useState } from 'react';

interface FileSystemItem {
  name: string;
  type: 'folder' | 'file';
  icon: string;
  size?: string;
  children?: FileSystemItem[];
  expanded?: boolean;
}

const MysteryExplorer: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('anas-index');
  const [sectionTitle, setSectionTitle] = useState('Ana\'s Index');
  const [fileType, setFileType] = useState('database');
  const [selectedFile, setSelectedFile] = useState<string>('forgotten-languages/anas-index.db');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Welcome to the BÆKON Research Suite. I\'m your FL Research Guide. How can I assist you today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  const fileSystem: FileSystemItem[] = [
    {
      name: 'forgotten-languages',
      type: 'folder',
      icon: '📁',
      expanded: true,
      children: [
        { name: 'overview.md', type: 'file', icon: '📄', size: '3.2kb' },
        { name: 'anas-index.db', type: 'file', icon: '🗃️', size: '24.7MB' },
        {
          name: 'lexicon',
          type: 'folder',
          icon: '📁',
          expanded: true,
          children: [
            { name: 'aylid.lexicon', type: 'file', icon: '📖', size: '15.3MB' },
            { name: 'yid.lexicon', type: 'file', icon: '📖', size: '8.7MB' },
            { name: 'ned.lexicon', type: 'file', icon: '📖', size: '12.1MB' },
            { name: 'drizza.lexicon', type: 'file', icon: '📖', size: '6.4MB' }
          ]
        },
        {
          name: 'military-defense',
          type: 'folder',
          icon: '📁',
          expanded: true,
          children: [
            { name: 'overview.md', type: 'file', icon: '📄', size: '2.8kb' },
            {
              name: 'sv17q-system',
              type: 'folder',
              icon: '📁',
              expanded: false,
              children: [
                { name: 'specifications.md', type: 'file', icon: '📄', size: '45.2kb' },
                { name: 'deployment-map.graph', type: 'file', icon: '📊', size: '1.8MB' },
                { name: 'threat-analysis.data', type: 'file', icon: '📈', size: '892kb' }
              ]
            }
          ]
        },
        {
          name: 'research',
          type: 'folder',
          icon: '📁',
          expanded: false,
          children: [
            { name: 'consciousness-studies.md', type: 'file', icon: '📄', size: '67.3kb' },
            { name: 'sufism-connections.md', type: 'file', icon: '📄', size: '23.1kb' },
            { name: 'community-findings.db', type: 'file', icon: '🗃️', size: '156MB' },
            { name: 'coordinates.dat', type: 'file', icon: '🗂️', size: '44.7kb' }
          ]
        }
      ]
    }
  ];

  const handleFileSelect = (filePath: string, fileName: string, fileType: string) => {
    setSelectedFile(filePath);
    setSectionTitle(fileName);
    setFileType(fileType);
    setCurrentSection(filePath.replace(/\//g, '-'));
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');

    // Generate AI response
    const aiResponse = generateAIResponse(userInput);
    setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  const generateAIResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('anas index') || lowercaseQuery.includes('ana index')) {
        return "Ana's Index is our primary FL indexing tool [[memory:7577742]]. It performs Forgotten Languages indexing operations and contains cross-referenced entries for FL documentation. The database currently holds 24.7MB of indexed content. Would you like me to search for specific entries?";
    }
    
    if (lowercaseQuery.includes('sv17q') || lowercaseQuery.includes('defense')) {
        return "The SV17Q system appears to be a military defense framework mentioned in FL documents. The specifications indicate advanced defensive capabilities with deployment maps showing strategic positioning. **Source: FL Documentation (Direct)** 🟢";
    }
    
    if (lowercaseQuery.includes('consciousness') || lowercaseQuery.includes('sufism')) {
        return "FL research reveals connections between consciousness studies and Sufi mystical traditions. The documentation suggests interdimensional awareness protocols. **Source: FL Research Files (Direct)** 🟢 This requires careful analysis - would you like me to elaborate on specific aspects?";
    }
    
    if (lowercaseQuery.includes('lexicon') || lowercaseQuery.includes('language')) {
        return "The FL lexicon contains four primary language variants: Aylid (15.3MB), Yid (8.7MB), Ned (12.1MB), and Drizza (6.4MB). Each represents distinct linguistic structures. **Source: Lexicon Database (Direct)** 🟢 Which language would you like to explore?";
    }
    
    return `I can help you navigate the FL research environment. **No Source, No Answer** is my policy [[memory:7577733]], so I'll only provide information I can verify from our databases. What specific aspect of the Forgotten Languages research would you like to explore?`;
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-200">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="cyber-border m-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BÆKON Research Suite</h1>
                <p className="text-sm text-zinc-400">Forgotten Languages Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="cyber-input flex items-center gap-2 px-3 py-2">
                <input
                  type="text"
                  placeholder="Global search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white text-sm flex-1"
                />
                <span className="text-purple-400">⌘K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 px-4 pb-4">
          {/* File Explorer */}
          <div className="w-80 cyber-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">Explorer</h2>
              <button className="text-zinc-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-1">
              <FileExplorerTree 
                items={fileSystem} 
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 cyber-border p-6">
            <MainContentArea 
              currentSection={currentSection}
              sectionTitle={sectionTitle}
              fileType={fileType}
            />
          </div>

          {/* AI Chat */}
          <div className="w-80 cyber-border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-white">FL Research Guide</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-zinc-400">Online</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-64">
              {chatMessages.map((message, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-purple-500/20 ml-4' 
                    : 'bg-zinc-800/50 mr-4'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about FL research..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 cyber-input text-sm"
              />
              <button 
                onClick={handleSendMessage}
                className="cyber-button px-3 py-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// File Explorer Tree Component
interface FileExplorerTreeProps {
  items: FileSystemItem[];
  onFileSelect: (filePath: string, fileName: string, fileType: string) => void;
  selectedFile: string;
  level?: number;
}

const FileExplorerTree: React.FC<FileExplorerTreeProps> = ({ 
  items, 
  onFileSelect, 
  selectedFile, 
  level = 0 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['forgotten-languages', 'lexicon', 'military-defense']));

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const getFileType = (fileName: string): string => {
    if (fileName.includes('.db')) return 'database';
    if (fileName.includes('.lexicon')) return 'lexicon';
    if (fileName.includes('.md')) return 'document';
    if (fileName.includes('.graph')) return 'graph';
    if (fileName.includes('.data')) return 'data';
    if (fileName.includes('.dat')) return 'data';
    return 'file';
  };

  return (
    <>
      {items.map((item, index) => {
        const itemPath = level === 0 ? item.name : `${item.name}`;
        const isExpanded = expandedFolders.has(item.name);
        const isSelected = selectedFile.includes(item.name);

        return (
          <div key={index}>
            <div
              className={`file-explorer-item ${isSelected ? 'selected' : ''}`}
              style={{ paddingLeft: `${level * 16 + 8}px` }}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(item.name);
                } else {
                  onFileSelect(itemPath, item.name, getFileType(item.name));
                }
              }}
            >
              {item.type === 'folder' && (
                <span className={`expand-arrow ${isExpanded ? 'expanded' : ''}`}>
                  ▶
                </span>
              )}
              <span className="file-icon">{item.icon}</span>
              <span className="item-name">{item.name}</span>
              {item.size && <span className="file-size">{item.size}</span>}
            </div>
            
            {item.type === 'folder' && isExpanded && item.children && (
              <FileExplorerTree
                items={item.children}
                onFileSelect={onFileSelect}
                selectedFile={selectedFile}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

// Main Content Area Component
interface MainContentAreaProps {
  currentSection: string;
  sectionTitle: string;
  fileType: string;
}

const MainContentArea: React.FC<MainContentAreaProps> = ({ 
  currentSection, 
  sectionTitle, 
  fileType 
}) => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
          <span>forgotten-languages</span>
          <span>/</span>
          <span className="text-cyan-400">{sectionTitle}</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">{sectionTitle}</h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>Type: {fileType}</span>
          <span>•</span>
          <span>Modified: 2 hours ago</span>
          <span>•</span>
          <span>Status: Active</span>
        </div>
      </div>

      <div className="cyber-border p-6 h-96 overflow-y-auto">
        {fileType === 'database' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Database Overview</h3>
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="text-cyan-400 font-medium mb-2">Recent Entries</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>SV17Q_DEFENSE_PROTOCOL</span>
                    <span className="text-zinc-400">Entry #4521</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CONSCIOUSNESS_MAPPING</span>
                    <span className="text-zinc-400">Entry #4520</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIMENSIONAL_COORDINATES</span>
                    <span className="text-zinc-400">Entry #4519</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {fileType === 'document' && (
          <div className="prose prose-invert max-w-none">
            <h3 className="text-lg font-semibold text-white mb-4">Document Content</h3>
            <div className="space-y-4 text-sm">
              <p>This document contains analysis and findings related to Forgotten Languages research.</p>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="text-purple-400 font-medium mb-2">Key Points</h4>
                <ul className="space-y-1 text-zinc-300">
                  <li>• Cross-dimensional communication protocols</li>
                  <li>• Linguistic pattern analysis</li>
                  <li>• Consciousness interface mapping</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {fileType === 'lexicon' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Lexicon Database</h3>
            <div className="space-y-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="text-green-400 font-medium mb-2">Language Entries</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Root Terms:</span> 2,847
                  </div>
                  <div>
                    <span className="text-zinc-400">Compounds:</span> 8,231
                  </div>
                  <div>
                    <span className="text-zinc-400">Verified:</span> 75%
                  </div>
                  <div>
                    <span className="text-zinc-400">Unknown:</span> 25%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(fileType === 'graph' || fileType === 'data') && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Data Visualization</h3>
            <div className="bg-zinc-900/50 p-4 rounded-lg font-mono text-xs">
              <pre className="text-green-400">{`
    Network Analysis: SV17Q Defense Grid
    ════════════════════════════════════════
    
    Node Status:
    ◉ Alpha-7    [ACTIVE]   Signal: 98.2%
    ◉ Beta-3     [ACTIVE]   Signal: 94.7%
    ◉ Gamma-12   [STANDBY]  Signal: 87.3%
    ○ Delta-9    [OFFLINE]  Signal: 0.0%
    
    Threat Analysis:
    ▲ HIGH: Dimensional breach detected (Sector 7)
    ▲ MED:  Comm interference (Grid B-3)
    ▼ LOW:  Standard patrol routes
              `}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MysteryExplorer;

