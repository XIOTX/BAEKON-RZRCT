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
            <div className="h-screen w-screen text-white font-tertiary text-glow flex flex-col overflow-hidden" style={{
      backgroundImage: 'url(/xiotx._deep_scape_dark_with_scattered_sparse_stars_monotone_74acf7ef-44c6-4cb4-a314-4aec225ad360.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundColor: '#0a0a0f'
    }}>
      {/* Header */}
      <div className="cyber-border flex justify-between items-center shrink-0" style={{
        margin: '24px 24px 0 24px',
        height: '60px'
      }}>
        <h1 className="cyber-logo">BÆKON</h1>
        <div className="settings-icon">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 relative" style={{padding: '0 24px 24px 24px'}}>
        {/* Left Sidebar - File Explorer */}
        <div className="cyber-border overflow-hidden" style={{
          position: 'absolute',
          left: '24px',
          top: '12px', 
          bottom: '24px',
          width: '300px'
        }}>
          <FileExplorer onFileSelect={handleFileSelect} />
        </div>

        {/* Main Content Area */}
        <div className="cyber-border overflow-hidden" style={{
          position: 'absolute',
          left: '348px',
          top: '12px',
          bottom: '24px', 
          right: '348px'
        }}>
          <ContentDisplay selectedFile={selectedFile} />
        </div>

        {/* Search Tools */}
        <div className="cyber-border overflow-hidden" style={{
          position: 'absolute',
          right: '24px',
          top: '12px',
          width: '300px',
          height: '300px'
        }}>
          <SearchTools />
        </div>

        {/* AI Assistant */}
        <div className="cyber-border overflow-hidden" style={{
          position: 'absolute',
          right: '24px',
          top: '336px',
          bottom: '24px',
          width: '300px'
        }}>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}