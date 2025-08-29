"use client";

import { useState, useRef, useEffect } from "react";
import AnaIndex from "../ui/components/AnaIndex";
import ExternalSearch from "../ui/components/ExternalSearch";
import Interlinear from "../ui/components/Interlinear";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatExpanded, setChatExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChat = localStorage.getItem('baekon-chat-history');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setChatMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('baekon-chat-history', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

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
      // Simulate FL analysis response for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = `FL Analysis of "${userMessage.content}":

Pattern Analysis: Detected possible UIFAIN linguistic structures
Confidence: 0.73
Lexicon Matches: 2 potential hits
Sources: stones-seed@local, fl-community@web

Note: This appears to contain FL morphological patterns. Recommend cross-referencing with Ana's Index for verification.`;

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Error: Unable to process FL text. Check system status.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    localStorage.removeItem('baekon-chat-history');
  };

  const sampleTokens = [
    { surface: "aeshafaf", lemma: "aeshafaf", gloss: "do", method: "lexicon", confidence: 1.0, sources: ["stones-seed@local#1"] },
    { surface: "ararth", lemma: "ararth", gloss: "their", method: "lexicon", confidence: 1.0, sources: ["stones-seed@local#2"] },
    { surface: "nebeder", lemma: "nebeder", gloss: "weapon", method: "lexicon", confidence: 0.92, sources: ["stones-seed@local#3"] },
  ];

  // Get recent messages for compact view
  const recentMessages = chatMessages.slice(-2);

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header - Clean without tabs, time, temp */}
      <header className="cyber-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-5xl font-bold font-cal bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent tracking-wider">
              BÆKON
            </h1>
            <span className="text-xl text-zinc-400 font-display">Zero-Hallucination FL Research Console</span>
          </div>

          {/* Status Indicators - Clean */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-terminal-green animate-pulse shadow-[0_0_15px_rgba(57,255,20,0.6)]"></div>
              <span className="terminal-text text-sm font-mono">SYSTEMS ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid - Modified to add space for chat */}
      <div className="grid grid-cols-[300px_1fr_400px] gap-4 h-[calc(100vh-300px)]">
        
        {/* Left Sidebar - FL Languages */}
        <aside className="cyber-border space-y-3 p-4">
          <h2 className="text-lg font-semibold font-display text-neon-blue border-b border-cyan-400/30 pb-2">
            FL CORPUS
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { lang: "UIFAIN", status: "active", color: "text-terminal-green" },
              { lang: "FEB", status: "parsing", color: "text-yellow-400" },
              { lang: "AIFUR", status: "standby", color: "text-zinc-400" },
              { lang: "AITEJE", status: "error", color: "text-red-400" },
              { lang: "AEI", status: "active", color: "text-terminal-green" },
              { lang: "UILAIN", status: "standby", color: "text-zinc-400" },
              { lang: "UILAUD", status: "active", color: "text-terminal-green" },
              { lang: "EILAIU", status: "parsing", color: "text-yellow-400" },
              { lang: "EIEIE", status: "standby", color: "text-zinc-400" },
              { lang: "NIJON", status: "active", color: "text-terminal-green" },
              { lang: "AIESU", status: "standby", color: "text-zinc-400" },
            ].map((lang, i) => (
              <div key={i} className="flex items-center justify-between hover:bg-white/5 p-2 rounded">
                <span className={`font-mono ${lang.color}`}>{lang.lang}</span>
                <div className={`w-2 h-2 rounded-full ${
                  lang.status === 'active' ? 'bg-terminal-green animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.6)]' :
                  lang.status === 'parsing' ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(255,255,0,0.6)]' :
                  lang.status === 'error' ? 'bg-red-400 shadow-[0_0_8px_rgba(255,0,0,0.6)]' :
                  'bg-zinc-600'
                }`}></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Content */}
        <main className="space-y-4 overflow-auto">
          {/* Analysis Dashboard */}
          <div className="cyber-border p-6">
            <h2 className="text-xl font-semibold font-display text-neon-blue mb-4">Research Console</h2>
            
            {/* Analysis Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="cyber-border p-4">
                <h3 className="text-lg mb-3 font-display text-neon-blue">Ana's Index</h3>
                <AnaIndex />
              </div>
              
              <div className="cyber-border p-4">
                <h3 className="text-lg mb-3 font-display text-neon-blue">External Search</h3>
                <ExternalSearch />
              </div>
            </div>
          </div>

          {/* Translation Preview */}
          <div className="cyber-border p-6">
            <h3 className="text-lg mb-3 font-display text-neon-purple">Sample Translation</h3>
            <Interlinear tokens={sampleTokens} />
          </div>
        </main>

        {/* Right Sidebar - Provenance */}
        <aside className="cyber-border p-4">
          <h2 className="text-lg font-semibold font-display text-neon-purple border-b border-purple-500/30 pb-2 mb-4">
            PROVENANCE
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="cyber-border p-3 bg-black/20">
              <h4 className="text-purple-400 mb-2 font-display">Current Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Model:</span>
                  <span className="terminal-text">claude-3-5-sonnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Sources:</span>
                  <span className="text-blue-400">3 active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Confidence:</span>
                  <span className="text-terminal-green">94.2%</span>
                </div>
              </div>
            </div>

            <div className="cyber-border p-3 bg-black/20">
              <h4 className="text-purple-400 mb-2 font-display">Source Chain</h4>
              <div className="space-y-1 text-xs">
                <div className="text-terminal-green">✓ stones-seed@local</div>
                <div className="text-terminal-green">✓ ana-index@db</div>
                <div className="text-yellow-400">⧗ fl-community@web</div>
                <div className="text-zinc-600">○ cassini-coords@verify</div>
              </div>
            </div>

            <div className="cyber-border p-3 bg-black/20">
              <h4 className="text-purple-400 mb-2 font-display">Activity Log</h4>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-zinc-400">[11:43] Lexicon lookup</div>
                <div className="text-zinc-400">[11:43] Vector search</div>
                <div className="text-zinc-400">[11:42] Context retrieval</div>
                <div className="text-zinc-400">[11:42] Span analysis</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Chat Interface - Bottom Middle */}
      <div className="space-y-4">
        {/* Recent Chat Messages - Compact View */}
        {recentMessages.length > 0 && !chatExpanded && (
          <div className="cyber-border p-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-display text-neon-blue">Recent FL Analysis</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChatExpanded(true)}
                  className="cyber-button text-xs"
                >
                  EXPAND
                </button>
                <button 
                  onClick={clearChat}
                  className="cyber-button text-xs"
                >
                  CLEAR
                </button>
              </div>
            </div>
            <div className="space-y-3 max-h-32 overflow-hidden">
              {recentMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-cyan-500/20 border border-cyan-400/30 text-cyan-100' 
                      : 'bg-purple-500/20 border border-purple-400/30 text-purple-100'
                  }`}>
                    <div className="text-sm font-display whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expanded Chat View */}
        {chatExpanded && (
          <div className="cyber-border p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-display text-neon-blue">FL Research Chat</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChatExpanded(false)}
                  className="cyber-button text-xs"
                >
                  MINIMIZE
                </button>
                <button 
                  onClick={clearChat}
                  className="cyber-button text-xs"
                >
                  CLEAR HISTORY
                </button>
              </div>
            </div>
            <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 cyber-border bg-black/20">
              {chatMessages.length === 0 ? (
                <div className="text-center text-zinc-500 font-display">
                  Start analyzing FL text by typing below...
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-100 shadow-[0_0_10px_rgba(0,255,255,0.3)]' 
                        : 'bg-purple-500/20 border border-purple-400/50 text-purple-100 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    }`}>
                      <div className="text-sm font-display whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-zinc-400 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-purple-500/20 border border-purple-400/50 p-4 rounded-lg">
                    <div className="text-sm font-display text-purple-100">
                      Analyzing FL text...
                      <span className="animate-pulse">●●●</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Input - Always Visible */}
        <div className="cyber-border p-4 max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <input
              ref={chatInputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter FL text for analysis..."
              className="cyber-input flex-1 font-display"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !currentMessage.trim()}
              className="cyber-button px-6"
            >
              {isLoading ? 'ANALYZING...' : 'SEND'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}