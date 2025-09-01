'use client';

import React, { useState } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { SearchTools } from '@/components/SearchTools';
import { AIAssistant } from '@/components/AIAssistant';
import { ContentDisplay } from '@/components/ContentDisplay';
import { Clock } from '@/components/Clock';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<{path: string, name: string, type: string} | null>(null);

  const handleFileSelect = (path: string, name: string, type: string) => {
    setSelectedFile({ path, name, type });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-display flex flex-col">
      {/* Header */}
      <div className="cyber-border m-4 mb-0 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-cyan-400">🗂️ BÆKON Mystery Explorer</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-green-400">SYSTEMS ACTIVE</span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <Clock />
        </div>
      </div>

      <div className="flex flex-1 m-4 mt-2 space-x-4 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div className="w-80">
          <FileExplorer onFileSelect={handleFileSelect} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <ContentDisplay selectedFile={selectedFile} />
        </div>

        {/* Right Sidebar - Tools */}
        <div className="w-96 flex flex-col space-y-4">
          <div className="flex-1">
            <SearchTools />
          </div>
          <div className="flex-1">
            <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}