import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface VaultDocument {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  lastModified: string;
  tags: string[];
  links: string[];
}

interface LexiconEntry {
  surface_form: string;
  gloss: string;
  confidence: number;
  source_id: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface KnowledgeCategory {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  children: KnowledgeItem[];
}

interface KnowledgeItem {
  id: string;
  name: string;
  type: 'document' | 'lexicon' | 'analysis' | 'theory';
  status: 'active' | 'parsing' | 'standby' | 'error';
}

const API_BASE = 'http://127.0.0.1:8787';

export const MysteryExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('audio-video');
  const [knowledgeTree, setKnowledgeTree] = useState<KnowledgeCategory[]>([
    {
      id: 'forgotten-languages',
      name: 'Forgotten Languages',
      icon: '📁',
      expanded: true,
      children: [
        { id: 'official-articles', name: 'Official Articles', type: 'document', status: 'active' },
        { id: 'translation-lexicons', name: 'Translation Lexicons', type: 'lexicon', status: 'active' },
        { id: 'community-analysis', name: 'Community Analysis', type: 'analysis', status: 'parsing' },
        { id: 'theories-speculation', name: 'Theories & Speculation', type: 'theory', status: 'standby' }
      ]
    },
    {
      id: 'related-mysteries',
      name: 'Related Mysteries',
      icon: '📁',
      expanded: false,
      children: [
        { id: 'cicada-3301', name: 'Cicada 3301', type: 'document', status: 'standby' },
        { id: 'voynich-manuscript', name: 'Voynich Manuscript', type: 'document', status: 'standby' }
      ]
    },
    {
      id: 'audio-video',
      name: 'Audio/Video Analysis',
      icon: '📁',
      expanded: true,
      children: [
        { id: 'fl-audio-samples', name: 'FL Audio Samples', type: 'analysis', status: 'active' },
        { id: 'spectral-analysis', name: 'Spectral Analysis', type: 'analysis', status: 'parsing' },
        { id: 'pattern-recognition', name: 'Pattern Recognition', type: 'analysis', status: 'active' }
      ]
    },
    {
      id: 'research-tools',
      name: 'Research Tools',
      icon: '🔧',
      expanded: false,
      children: [
        { id: 'anas-index', name: 'Ana\\'s Index', type: 'document', status: 'active' },
        { id: 'lexicon-search', name: 'Lexicon Search', type: 'lexicon', status: 'active' },
        { id: 'translation-engine', name: 'Translation Engine', type: 'analysis', status: 'active' }
      ]
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'active' | 'connecting' | 'error'>('active');

  // Real-time API integration
  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/vault/stats`);
      if (response.ok) {
        setSystemStatus('active');
      } else {
        setSystemStatus('error');
      }
    } catch (error) {
      setSystemStatus('error');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setKnowledgeTree(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, expanded: !cat.expanded }
        : cat
    ));
  };

  const selectItem = (categoryId: string, itemId: string) => {
    setSelectedCategory(itemId);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Real FL analysis using the API
      const response = await fetch(`${API_BASE}/translate/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: currentMessage, 
          model: 'claude-3-5-sonnet-20241022' 
        })
      });

      const result = await response.text();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'parsing': return 'text-yellow-400';
      case 'standby': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    const baseClasses = 'w-2 h-2 rounded-full mr-2';
    switch (status) {
      case 'active': return `${baseClasses} bg-green-400 animate-pulse`;
      case 'parsing': return `${baseClasses} bg-yellow-400 animate-pulse`;
      case 'standby': return `${baseClasses} bg-gray-400`;
      case 'error': return `${baseClasses} bg-red-400 animate-pulse`;
      default: return `${baseClasses} bg-gray-400`;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white font-mono flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-purple-400">BÆKON Mystery Explorer</h1>
          <div className="flex items-center space-x-2">
            <div className={getStatusDot(systemStatus)}></div>
            <span className="text-sm text-gray-400">
              SYSTEMS {systemStatus.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Knowledge Explorer Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-purple-300">Knowledge Explorer</h2>
          </div>
          
          <div className="p-2">
            {knowledgeTree.map(category => (
              <div key={category.id} className="mb-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left"
                >
                  {category.expanded ? (
                    <ChevronDownIcon className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4 mr-2" />
                  )}
                  <span className="mr-2">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </button>
                
                {category.expanded && (
                  <div className="ml-6 mt-1">
                    {category.children.map(item => (
                      <button
                        key={item.id}
                        onClick={() => selectItem(category.id, item.id)}
                        className={`w-full flex items-center p-2 text-sm hover:bg-gray-700 rounded text-left ${
                          selectedCategory === item.id ? 'bg-gray-700 border-l-2 border-purple-400' : ''
                        }`}
                      >
                        <div className={getStatusDot(item.status)}></div>
                        <span className={getStatusColor(item.status)}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Header */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <h2 className="text-lg font-semibold text-purple-300">FL Audio Analysis</h2>
            <p className="text-sm text-gray-400 mt-1">
              Analyzing spectral patterns and linguistic structures in FL audio samples
            </p>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Analysis Results */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-md font-semibold text-purple-300 mb-3">Current Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Spectral Density</span>
                    <span className="text-sm text-green-400">87.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Pattern Recognition</span>
                    <span className="text-sm text-yellow-400">Processing...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Linguistic Markers</span>
                    <span className="text-sm text-green-400">12 detected</span>
                  </div>
                </div>
              </div>

              {/* Related Content */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h3 className="text-md font-semibold text-purple-300 mb-3">Related Research</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-300 hover:text-purple-300 cursor-pointer">
                    → Phonetic Analysis Report #47
                  </div>
                  <div className="text-sm text-gray-300 hover:text-purple-300 cursor-pointer">
                    → Community Translation Attempts
                  </div>
                  <div className="text-sm text-gray-300 hover:text-purple-300 cursor-pointer">
                    → Similar Pattern Matches
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Research Assistant */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="mb-4">
              <h3 className="text-md font-semibold text-purple-300 mb-2">AI Research Assistant</h3>
              
              {/* Chat Messages */}
              <div className="bg-gray-900 rounded-lg p-3 h-32 overflow-y-auto mb-3">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-sm">Ask me anything about FL research...</p>
                ) : (
                  chatMessages.map(message => (
                    <div key={message.id} className={`mb-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-2 rounded text-sm max-w-xs ${
                        message.type === 'user' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-200'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="text-left">
                    <div className="inline-block p-2 rounded text-sm bg-gray-700 text-gray-200">
                      Analyzing FL patterns...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Enter FL text or research question..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {isLoading ? 'Analyzing...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
