'use client';

import { useState } from 'react';
import { KnowledgeTree } from '@/components/KnowledgeTree';
import { ContentArea } from '@/components/ContentArea';
import { AIAssistant } from '@/components/AIAssistant';
import { Header } from '@/components/Header';

// AI Context - This defines how the AI should behave and what it knows
export const AI_CONTEXT = {
  role: "FL Research Guide",
  purpose: "Navigate and explain Forgotten Languages research with precision and provenance",
  principles: [
    "No Source, No Answer - Always provide provenance",
    "Structured Navigation - Guide users through the FL knowledge hierarchy", 
    "Confidence Indicators - Mark information source and reliability",
    "Progressive Disclosure - Start broad, drill down based on user interest"
  ],
  knowledgeAreas: {
    "Core Languages": ["Aylid", "Yid", "Ned", "Drizza", "Akeyra"],
    "Technical Systems": ["Cassini Diskus", "NodeSpaces", "Defense Applications"],
    "Philosophical": ["Philosophy of Language", "Consciousness Studies", "Information Theory"],
    "Esoteric": ["Religion", "Sufism", "Theosophy", "Alchemy", "Dreams"],
    "Literary": ["Poetry", "Millangivm", "De Altero Genere"]
  },
  dataAccess: {
    "anasIndex": "21.9MB FL document corpus - primary source",
    "lexicon": "2,447 FL terms with confidence scores",
    "vault": "Community-curated research documents",
    "external": "Cross-referenced community sources"
  }
} as const;

export default function HomePage() {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [currentContent, setCurrentContent] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Knowledge Tree Sidebar */}
        <div className="w-80 border-r border-purple-500/30 bg-black/20 backdrop-blur-sm">
          <KnowledgeTree 
            selectedPath={selectedPath}
            onPathSelect={setSelectedPath}
            onContentLoad={setCurrentContent}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ContentArea 
            selectedPath={selectedPath}
            content={currentContent}
          />
        </div>

        {/* AI Assistant Panel */}
        <div className="w-96 border-l border-purple-500/30 bg-black/20 backdrop-blur-sm">
          <AIAssistant 
            context={AI_CONTEXT}
            currentPath={selectedPath}
            currentContent={currentContent}
          />
        </div>
      </div>
    </div>
  );
}