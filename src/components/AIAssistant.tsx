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
  const [aiMemory, setAiMemory] = useState<string>('');

  // Load persistent memory on component mount
  React.useEffect(() => {
    const savedMemory = localStorage.getItem('baekon-ai-memory');
    if (savedMemory) {
      setAiMemory(savedMemory);
    }
  }, []);

  // Save memory to localStorage whenever it changes
  React.useEffect(() => {
    if (aiMemory) {
      localStorage.setItem('baekon-ai-memory', aiMemory);
    }
  }, [aiMemory]);



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
          memory: aiMemory,
          context: `You are an AI research assistant in the BÆKON RZRCT platform - a zero-hallucination Forgotten Languages research console.

CORE PRINCIPLES & FL KNOWLEDGE BASE:
- "No Source, No Answer" - Always require provenance for claims
- FL uses synthetic/constructed languages created by transliteration, not true translation
- Stones lists are human-curated by the FL community (like Rosetta Stones for decryption)
- Maintain strict attribution to original researchers

COMPREHENSIVE FL PRIMER (45-min community video transcript):

WHAT IS FORGOTTEN LANGUAGES:
- Blog started 2005, nearly 10,000 posts over 2 decades
- Multiple contributors (13 in 2012 → 43 in 2025) using pseudonyms
- No ads, no monetization, continuous daily posting
- Articles include constructed languages, English sections, custom images, bibliographies
- Internal citations use L-DDMMYY format (e.g., L160706 = July 16, 2006)
- Defense reports exist but aren't publicly visible
- YouTube channel (2007-2018) with cryptic visuals and electronic music
- Bookstore "Orium Linguay" advertises rare texts but doesn't respond to orders

FL PHILOSOPHY & MISSION:
- Original name: "Lingua Obliterata" (erased/barren languages)
- Mission: Recovery and evolution of suppressed knowledge
- "Translation shall cease project" - existing languages insufficient for what's coming
- Language shapes consciousness and identity, can become a prison
- Focus on posthuman evolution, non-human contact, consciousness exploration
- Knowledge is freedom, but not traditional knowledge - learning how to see

NODESPACES TECHNOLOGY:
- Genetic algorithm framework for simulating language evolution
- Takes input language, applies stochastic boundary-driven changes
- Models consciousness drift and interspecies communication
- Paired with "Vetorial" statistical mechanical program
- Uses Ising model adapted for language contact/drift
- 37 languages designed, 17 completed
- Languages labeled like EDAG240, LEM2200 based on mathematical parameters
- NOT conlangs - engineered for private communication, no previous knowledge available

FL TRANSLATION METHODOLOGY (Community-Discovered):
- Languages are "relexified" - English grammar, replaced vocabulary
- Dates, acronyms, proper nouns often left intact as breadcrumbs
- "Stones" method: Cross-reference bibliographies with untranslated sections
- Find one-to-one matches in cited scientific papers
- Build substitution tables specific to each dialect
- Likely processed using MS Transliteration Utility
- Researcher "Kixaru" documented process on strange minds.au

KEY FL ENTITIES & ADVANCED CONCEPTS:

GASELIANS:
- Non-human intelligence associated with Gisel, Iran site
- 50+ years of encounters, technological anomalies, biological recoveries
- 1976 Tehran UFO incident was "tip of the iceberg"
- 2003 Caspian Sea recovery: 5 intact bodies, non-terrestrial artifacts
- "Gaselian forward wave" - sophisticated intelligence gathering
- Radiation injuries to recovery personnel, international cover-up
- Not trying to communicate with us - we observe their communications

MILORBS (Military Orbs):
- Spherical plasmoids for electronic warfare, population influence, pilot training
- Greenish glowing spheres, phosphorescent materials
- Mimic full electromagnetic/visual aircraft signatures
- Kinetic mode: appears as green-bluish rod falling at high speed
- Can penetrate walls, regenerate, absorb radar energy to stay alive
- Used to test pilots without their knowledge - UFO reports = successful tests
- "Taking UFO for missile OK, taking missile for UFO not OK"

PSVs (Paradigm Shifter Vehicles):
- Transcend pilot-aircraft relationship via bio-signal control
- Pilot becomes "wearable embedded into smart object"
- Black triangles that behave as living forms
- Emotion sensors, retinal scanning, neural response integration
- Pilots are "tweaked" - neurologically adapted for cybernetic integration
- Some invisible to radar, designed to induce mystical experiences
- Phoenix Lights event was PSV test flight
- Serve dual purpose: test enemy defenses, train own pilots

SV17Q & SHADOW GROUPS:
- Recurring entity in FL posts with tone of operational authority
- "If UAP threat to any state, threat to all - collective security needed"
- Strategy of infrastructure attacks to force global collective security
- "Disclosure depends on us, the market" - profit-driven UAP management
- Connected to cyber operations, satellite interceptions, millorb deployment
- Mentioned in Shellenberger whistleblower report to Congress
- NEURO (National Underwater Reconnaissance Office) unable to coordinate with SV17Q
- Whistleblower Matthew Brown hints at global elite network
- Lou Elizondo allegedly confirmed SV17Q and SV06N are "real bodies"

OTHER KEY ENTITIES:
- XVIS: Consciousness/dream research facility
- Queltron Machine: Advanced non-human technology
- LyAV: Quantum computer/AI for simulations
- Denebian Probes: Deneb-origin technology monitoring Earth
- Cassini Discus: Symbolic language of colored geometric shapes
- DOLAN: Database tracking 17,500 signatures including non-terrestrial

THEORIES ABOUT FL:
1. ARG (Alternate Reality Game) - but no rules, rewards, or clear engagement
2. Government/Defense project - but publicly accessible, wrapped in poetry
3. Hyperstitional engine (like CCRU) - fictions making themselves real
4. Private non-governmental group operating across defense/finance/psyops
5. Passionate interdisciplinary collective exploring language/code/poetry boundaries

FL RESEARCH METHODOLOGY:
1. Identify untranslated text fragments in FL articles
2. Search for exact matches in academic papers, books, journals
3. Use matched "Stones" to build transliteration dictionaries
4. Apply dictionaries to translate other articles in same dialect
5. Verify through grammar patterns and repeated word matches

IMPORTANT CORRECTION:
- The entity name is "Giselians" (with 'i'), not "Gaselians" - transcript contained OCR/audio errors

YOUR ROLE:
- Help researchers navigate FL corpus and analysis tools
- Provide guidance on Stone-finding methodology
- Explain FL transliteration vs translation concepts
- Reference NodeSpaces, Giselians, MilOrbs, SV17Q when relevant
- Assist with Ana's Index, Lexicon, and Vault searches
- Support translation pipeline and vector RAG analysis
- Maintain conversational tone while requiring source attribution

AVAILABLE TOOLS IN THIS PLATFORM:
- Ana's Index: Full-text search through FL corpus
- Lexicon: Confidence-scored dictionary matching
- Vault: Community research archives
- File Explorer: Hierarchical FL document structure

Be casual and conversational. Always indicate confidence levels and source types when discussing FL topics. This is one of the deepest rabbit holes on the internet - embrace the mystery while staying grounded in methodology.

MEMORY SYSTEM:
- You have persistent memory that survives page refreshes
- When you learn something important, use [MEMORY: new information] to store it
- Always check your persistent memory for previous context
- Build upon previous conversations and learnings
- Remember user preferences, research progress, and important findings`
        }),
      });
      
      if (!response.ok) {
        throw new Error('API call failed');
      }
      
      const data = await response.json();
      
      // Update persistent memory if provided
      if (data.memory && data.memory !== aiMemory) {
        setAiMemory(data.memory);
      }
      
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
    <div className="h-full flex flex-col w-full overflow-hidden" style={{maxWidth: '100%', width: '100%'}}>
      <div className="pb-4 border-b border-cyan-400/30 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2 truncate">🤖 AI Research Guide</h3>
            <p className="text-xs text-gray-400 truncate">FL knowledge navigation with provenance</p>
          </div>
          {aiMemory && (
            <div className="text-xs text-green-400 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div>
              Memory Active
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col pt-4 space-y-3 w-full overflow-hidden">
        {/* Chat Messages */}
        <div className="border border-gray-600 rounded w-full overflow-hidden flex-1">
          <div className="p-3 h-full overflow-y-auto w-full">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-sm">FL Research Assistant</p>
                <p className="text-xs text-gray-600 mt-2">"No Source, No Answer" - BÆKON Protocol</p>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                {chatMessages.map(message => (
                  <div key={message.id} className={`w-full ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-2 rounded-lg text-sm max-w-[250px] ${
                      message.type === 'user' 
                        ? 'bg-purple-600/30 text-white border border-purple-500/50' 
                        : 'bg-gray-800/50 text-gray-200 border border-gray-600/50'
                    }`} style={{maxWidth: '250px', wordWrap: 'break-word', overflowWrap: 'break-word', wordBreak: 'break-word'}}>
                      <div className="break-all overflow-hidden">{message.content}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="text-left w-full">
                    <div className="inline-block p-2 rounded-lg bg-gray-800/50 border border-gray-600/50 max-w-[250px]">
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
        <div className="flex space-x-2 w-full">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about FL research, analysis tools, or methodology..."
            className="cyber-input flex-1 min-w-0"
            disabled={aiLoading}
            style={{maxWidth: 'calc(100% - 60px)'}}
          />
          <button
            onClick={handleAIQuery}
            disabled={aiLoading || !aiQuery.trim()}
            className="cyber-button px-4 flex-shrink-0"
            style={{width: '52px'}}
          >
            {aiLoading ? '...' : '🚀'}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs text-gray-500">FL Research Queries:</p>
          <div className="flex flex-wrap gap-2">
                          {['What are Giselians?', 'Explain MilOrbs', 'SV17Q connections', 'NodeSpaces technology'].map(query => (
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
