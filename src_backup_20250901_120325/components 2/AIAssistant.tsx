'use client';

import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const [aiQuery, setAiQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);



  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: aiQuery,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    const currentQuery = aiQuery;
    setAiQuery(''); // Clear input immediately
    setAiLoading(true);
    
    try {
      // Call actual Claude API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentQuery,
          context: 'You are an AI assistant in a Forgotten Languages research environment. Be conversational and helpful.'
        }),
      });
      
      if (!response.ok) {
        throw new Error('API call failed');
      }
      
      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, having trouble connecting right now. Try again?',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAIQuery();
    }
  };

  return (
    <div className="cyber-border h-full flex flex-col">
      <div className="p-4 border-b border-cyan-400/30">
        <h3 className="text-lg font-semibold text-purple-400 mb-2">🤖 AI Research Guide</h3>
        <p className="text-xs text-gray-400">FL knowledge navigation with provenance</p>
      </div>
      
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {/* Chat Messages */}
        <div className="cyber-border overflow-hidden" style={{height: '300px', minHeight: '300px', maxHeight: '300px'}}>
          <div className="p-4 h-full overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-sm">Ask me anything about FL research...</p>
                <p className="text-xs text-gray-600 mt-2">Just chat normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {chatMessages.map(message => (
                  <div key={message.id} className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg max-w-[85%] text-sm ${
                      message.type === 'user' 
                        ? 'bg-purple-600/30 text-white border border-purple-500/50' 
                        : 'bg-gray-800/50 text-gray-200 border border-gray-600/50'
                    }`}>
                      <div className="break-words">{message.content}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="text-left">
                    <div className="inline-block p-2 rounded-lg bg-gray-800/50 border border-gray-600/50">
                      <div className="text-cyan-400 text-sm animate-pulse">
                        🔍 Thinking...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={handleKeyPress}
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

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Quick queries:</p>
          <div className="flex flex-wrap gap-2">
            {['yo', 'military systems', 'lexicon help', 'overview'].map(query => (
              <button
                key={query}
                onClick={() => setAiQuery(query)}
                className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
