"use client";

import { useState } from "react";
import AnaIndex from "../ui/components/AnaIndex";
import ExternalSearch from "../ui/components/ExternalSearch";
import Interlinear from "../ui/components/Interlinear";

export default function Home() {
  const [activeTab, setActiveTab] = useState("SCHED");
  const [currentTime] = useState(new Date());

  const tabs = [
    { id: "SCHED", label: "SCHED", color: "text-neon-blue" },
    { id: "WORK", label: "WORK", color: "text-neon-blue" },
    { id: "LIFE", label: "LIFE", color: "text-neon-blue" },
  ];

  const sampleTokens = [
    { surface: "aeshafaf", lemma: "aeshafaf", gloss: "do", method: "lexicon", confidence: 1.0, sources: ["stones-seed@local#1"] },
    { surface: "ararth", lemma: "ararth", gloss: "their", method: "lexicon", confidence: 1.0, sources: ["stones-seed@local#2"] },
    { surface: "nebeder", lemma: "nebeder", gloss: "weapon", method: "lexicon", confidence: 0.92, sources: ["stones-seed@local#3"] },
  ];

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <header className="cyber-panel">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold neon-text tracking-wider">BÆKON</h1>
            <span className="text-sm text-zinc-400">2025</span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cyber-tab ${activeTab === tab.id ? 'active' : ''} ${tab.color}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-terminal-green animate-pulse"></div>
              <span className="terminal-text text-sm">76°</span>
            </div>
            <div className="text-sm text-zinc-400">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-[300px_1fr_400px] gap-4 h-[calc(100vh-120px)]">
        
        {/* Left Sidebar - FL Languages */}
        <aside className="cyber-panel space-y-3">
          <h2 className="text-lg font-semibold neon-text border-b border-purple-500/30 pb-2">
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
                  lang.status === 'active' ? 'bg-terminal-green animate-pulse' :
                  lang.status === 'parsing' ? 'bg-yellow-400 animate-pulse' :
                  lang.status === 'error' ? 'bg-red-400' :
                  'bg-zinc-600'
                }`}></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Content */}
        <main className="space-y-4 overflow-auto">
          {/* Analysis Dashboard */}
          <div className="cyber-panel">
            <h2 className="text-xl font-semibold neon-text mb-4">Research Console</h2>
            
            {/* Analysis Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="cyber-panel">
                <h3 className="text-lg mb-3 text-neon-blue">Ana's Index</h3>
                <AnaIndex />
              </div>
              
              <div className="cyber-panel">
                <h3 className="text-lg mb-3 text-neon-blue">External Search</h3>
                <ExternalSearch />
              </div>
            </div>
          </div>

          {/* Translation Preview */}
          <div className="cyber-panel">
            <h3 className="text-lg mb-3 text-neon-purple">Sample Translation</h3>
            <Interlinear tokens={sampleTokens} />
          </div>
        </main>

        {/* Right Sidebar - Provenance */}
        <aside className="cyber-panel">
          <h2 className="text-lg font-semibold neon-text border-b border-purple-500/30 pb-2 mb-4">
            PROVENANCE
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="cyber-panel bg-black/20">
              <h4 className="text-purple-400 mb-2">Current Analysis</h4>
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

            <div className="cyber-panel bg-black/20">
              <h4 className="text-purple-400 mb-2">Source Chain</h4>
              <div className="space-y-1 text-xs">
                <div className="text-terminal-green">✓ stones-seed@local</div>
                <div className="text-terminal-green">✓ ana-index@db</div>
                <div className="text-yellow-400">⧗ fl-community@web</div>
                <div className="text-zinc-600">○ cassini-coords@verify</div>
              </div>
            </div>

            <div className="cyber-panel bg-black/20">
              <h4 className="text-purple-400 mb-2">Activity Log</h4>
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

      {/* Bottom Status Bar */}
      <footer className="cyber-panel">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">[chat-log]</span>
            <button className="cyber-button text-xs">PROFILE</button>
            <button className="cyber-button text-xs">HISTORY</button>
            <button className="cyber-button text-xs">SETTINGS</button>
            <button className="cyber-button text-xs">THEME</button>
            <button className="cyber-button text-xs">MODE</button>
            <button className="cyber-button text-xs">FILES</button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-24 h-1 bg-black/50 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-terminal-green to-neon-blue rounded-full"></div>
            </div>
            <input 
              type="text" 
              placeholder="Type command here..."
              className="cyber-input text-xs w-64"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
