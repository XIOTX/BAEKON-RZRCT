'use client';

import { useState, useRef, useEffect } from 'react';
import { FLKnowledgeNode, getAIGuidanceForPath, AI_BEHAVIOR_PATTERNS } from '@/lib/fl-knowledge';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: {
    path: string[];
    node?: FLKnowledgeNode;
    source?: string;
    confidence?: 'high' | 'medium' | 'low' | 'speculation';
  };
}

interface AIAssistantProps {
  context: any;
  currentPath: string[];
  currentContent: any;
}

export function AIAssistant({ context, currentPath, currentContent }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: AI_BEHAVIOR_PATTERNS.greeting,
      timestamp: new Date(),
      context: { path: [], source: 'system', confidence: 'high' }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update AI context when path changes
  useEffect(() => {
    if (currentPath.length > 0 && currentContent) {
      const guidance = getAIGuidanceForPath(currentPath);
      if (guidance !== "I can help you explore this area of FL research.") {
        const contextMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: `📍 **Navigated to: ${currentContent.node.title}**\n\n${guidance}`,
          timestamp: new Date(),
          context: {
            path: currentPath,
            node: currentContent.node,
            source: 'navigation',
            confidence: 'high'
          }
        };
        setMessages(prev => [...prev, contextMessage]);
      }
    }
  }, [currentPath, currentContent]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      context: { path: currentPath }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response with structured context
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = generateContextualResponse(inputValue, currentPath, currentContent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        context: aiResponse.context
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        context: { path: currentPath, source: 'error', confidence: 'low' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContextualResponse = (query: string, path: string[], content: any) => {
    const lowerQuery = query.toLowerCase();
    
    // Context-aware responses based on current location
    if (path.includes('aylid') && lowerQuery.includes('translate')) {
      return {
        content: `🔍 **Aylid Translation Request**\n\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['lexicon']} I can help with Aylid translation using our 2,447-term lexicon.\n\nFor accurate translation, I need:\n• The specific Aylid text\n• Context (if available)\n• Desired output format\n\nWould you like to search the lexicon or Ana's Index for specific terms?`,
        context: { path, source: 'lexicon', confidence: 'high' }
      };
    }
    
    if (path.includes('cassini-diskus')) {
      return {
        content: `🛰️ **Cassini Diskus Analysis**\n\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['anas-index']} This is our most documented area (50 documents).\n\nI can help you:\n• Search coordinate patterns\n• Analyze spatial relationships\n• Cross-reference with defense applications\n• Examine technical specifications\n\n${AI_BEHAVIOR_PATTERNS.navigationPrompts.drill_down}`,
        context: { path, source: 'anas-index', confidence: 'high' }
      };
    }
    
    if (lowerQuery.includes('search') || lowerQuery.includes('find')) {
      return {
        content: `🔍 **Search Assistance**\n\nBased on your current location: **${content?.node?.title || 'FL Research'}**\n\nI can search:\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['anas-index']} 21.9MB document corpus\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['lexicon']} 2,447 FL terms\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['vault']} Community research\n\nWhat specific terms or concepts should I look for?`,
        context: { path, source: 'system', confidence: 'high' }
      };
    }
    
    if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
      return {
        content: `💡 **FL Research Guidance**\n\n${AI_BEHAVIOR_PATTERNS.confidenceLevels.high} I can help you navigate FL research systematically:\n\n**Current Context:** ${content?.node?.title || 'Overview'}\n**Available Actions:**\n• Search specific terms\n• Analyze document patterns\n• Cross-reference topics\n• Explain FL concepts\n\n${AI_BEHAVIOR_PATTERNS.navigationPrompts.overview}`,
        context: { path, source: 'guidance', confidence: 'high' }
      };
    }
    
    // Default contextual response
    return {
      content: `🤔 **Analysis Request**\n\n${AI_BEHAVIOR_PATTERNS.sourceAttribution['speculation']} Based on your query about "${query}" in the context of **${content?.node?.title || 'FL Research'}**:\n\nI need more specific information to provide accurate guidance. Could you:\n• Specify what aspect interests you most\n• Indicate if you want to search documents\n• Let me know if you need concept explanations\n\n${AI_BEHAVIOR_PATTERNS.navigationPrompts.search_suggest}`,
      context: { path, source: 'analysis', confidence: 'medium' }
    };
  };

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'anas-index': return '📚';
      case 'lexicon': return '📖';
      case 'vault': return '🗄️';
      case 'external': return '🔗';
      case 'system': return '⚙️';
      case 'navigation': return '📍';
      case 'guidance': return '💡';
      case 'analysis': return '🤔';
      case 'error': return '❌';
      default: return '💭';
    }
  };

  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      case 'speculation': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-purple-500/30 p-4">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">🤖</span>
          <h2 className="text-lg font-bold text-cyan-400">FL Research Guide</h2>
        </div>
        <p className="text-xs text-gray-400">
          AI assistant with structured FL knowledge access
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-purple-600/30 text-white'
                  : 'bg-black/30 text-gray-100'
              }`}
            >
              {/* Message Header for Assistant */}
              {message.type === 'assistant' && message.context && (
                <div className="flex items-center mb-2 text-xs">
                  <span className="mr-1">{getSourceIcon(message.context.source)}</span>
                  <span className={getConfidenceColor(message.context.confidence)}>
                    {message.context.confidence?.toUpperCase() || 'INFO'}
                  </span>
                </div>
              )}
              
              {/* Message Content */}
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              
              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="flex items-center text-gray-400">
                <div className="animate-spin mr-2">⚙️</div>
                <span className="text-sm">Analyzing FL context...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-purple-500/30 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about FL research, request analysis, or search for specific terms..."
            className="flex-1 bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
