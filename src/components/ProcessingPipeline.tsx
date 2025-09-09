'use client';

import React, { useState } from 'react';

interface ProcessingNode {
  id: string;
  type: 'entropy' | 'chaos-game' | 'gematria' | 'numerology' | 'audio-analyzer';
  settings: Record<string, any>;
  enabled: boolean;
}

interface ProcessingPipelineProps {
  processingChain: ProcessingNode[];
  setProcessingChain: (chain: ProcessingNode[]) => void;
  audioData?: Float32Array;
  setAudioData: (data: Float32Array) => void;
  textInput: string;
  setTextInput: (text: string) => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({
  processingChain,
  setProcessingChain,
  audioData,
  setAudioData,
  textInput,
  setTextInput
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const addProcessingNode = (type: ProcessingNode['type']) => {
    const newNode: ProcessingNode = {
      id: `${type}-${Date.now()}`,
      type,
      settings: getDefaultSettings(type),
      enabled: true
    };
    setProcessingChain([...processingChain, newNode]);
  };

  const removeProcessingNode = (id: string) => {
    setProcessingChain(processingChain.filter(node => node.id !== id));
  };

  const toggleProcessingNode = (id: string) => {
    setProcessingChain(processingChain.map(node => 
      node.id === id ? { ...node, enabled: !node.enabled } : node
    ));
  };

  const updateProcessingNodeSettings = (id: string, settings: Record<string, any>) => {
    setProcessingChain(processingChain.map(node => 
      node.id === id ? { ...node, settings: { ...node.settings, ...settings } } : node
    ));
  };

  const getDefaultSettings = (type: ProcessingNode['type']) => {
    switch (type) {
      case 'entropy': return { intensity: 0.3, amplification: 0.8, waveCount: 2 };
      case 'chaos-game': return { attractors: 4, iterations: 500, jumpRatio: 0.6 };
      case 'gematria': return { system: 'hebrew', multiplier: 1.0 };
      case 'numerology': return { system: 'pythagorean', reduction: 'single' };
      case 'audio-analyzer': return { fftSize: 512, smoothing: 0.8 };
      default: return {};
    }
  };

  const startAudioInput = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      source.connect(analyser);
      setIsAudioActive(true);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioData = () => {
        if (!isAudioActive) return;
        
        analyser.getByteFrequencyData(dataArray);
        const floatArray = new Float32Array(dataArray.length);
        for (let i = 0; i < dataArray.length; i++) {
          floatArray[i] = dataArray[i] / 255.0;
        }
        setAudioData(floatArray);
        requestAnimationFrame(updateAudioData);
      };
      updateAudioData();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopAudioInput = () => {
    setIsAudioActive(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 pt-3 pb-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer file-explorer-item folder-item mb-4"
          style={{ marginTop: '12px' }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="#ff69b4"
            style={{width: '24px', height: '24px', minWidth: '24px', minHeight: '24px', filter: 'drop-shadow(0 0 12px rgba(255, 105, 180, 0.4)) drop-shadow(0 0 20px rgba(255, 105, 180, 0.2)) drop-shadow(0 0 8px rgba(255, 105, 180, 0.6))'}}
          >
            <path d="M8.5 2C6.567 2 5 3.567 5 5.5C5 5.68016 5.01364 5.85714 5.03993 6.02997C3.32436 6.25523 2 7.72295 2 9.5C2 10.4793 2.40223 11.3647 3.05051 12C2.40223 12.6353 2 13.5207 2 14.5C2 15.9018 2.82359 17.1104 4.01353 17.6693C4.00457 17.7785 4 17.8888 4 18C4 20.2091 5.79086 22 8 22C9.19469 22 10.2671 21.4762 11 20.6458V3.05051C10.3647 2.40223 9.47934 2 8.5 2ZM13 3.05051V20.6458C13.7329 21.4762 14.8053 22 16 22C18.2091 22 20 20.2091 20 18C20 17.8888 19.9954 17.7785 19.9865 17.6693C21.1764 17.1104 22 15.9018 22 14.5C22 13.5207 21.5978 12.6353 20.9495 12C21.5978 11.3647 22 10.4793 22 9.5C22 7.72295 20.6756 6.25523 18.9601 6.02997C18.9864 5.85714 19 5.68016 19 5.5C19 3.567 17.433 2 15.5 2C14.5207 2 13.6353 2.40223 13 3.05051Z" />
          </svg>
          <h2 className="text-lg font-primary font-semibold module-header-text">REALITY INTERFACE</h2>
        </div>

        {/* Text Input */}
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              // Trigger processing by updating text input
              setTextInput(textInput);
            }
          }}
          placeholder="Enter text to analyze... (Enter to process)"
          className="w-full text-sm focus:outline-none backdrop-blur-sm font-mono purple-placeholder mb-3"
          rows={3}
          style={{
            fontFamily: 'Syne Mono, JetBrains Mono, monospace',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '0.1px solid rgba(192, 128, 255, 0.7)',
            borderRadius: '8px',
            color: '#C080FF',
            boxShadow: '0 0 10px rgba(192, 128, 255, 0.3)',
            textShadow: '0 0 8px rgba(192, 128, 255, 0.4)',
            padding: '12px',
            resize: 'vertical'
          }}
        />

        {/* Audio Input */}
        <button
          onClick={isAudioActive ? stopAudioInput : startAudioInput}
          className="w-full px-4 py-2 mb-4 text-sm transition-colors backdrop-blur-sm"
          style={{
            fontFamily: 'Cal Sans, sans-serif',
            fontWeight: '600',
            backgroundColor: isAudioActive ? 'rgba(255, 100, 100, 0.2)' : 'rgba(255, 210, 10, 0.2)',
            border: `1px solid ${isAudioActive ? '#ff6464' : '#FFD20A'}`,
            borderRadius: '8px',
            color: isAudioActive ? '#ff6464' : '#FFD20A',
            textShadow: isAudioActive ? '0 0 8px rgba(255, 100, 100, 0.7)' : '0 0 8px rgba(255, 210, 10, 0.7)',
            boxShadow: isAudioActive ? '0 0 10px rgba(255, 100, 100, 0.4)' : '0 0 10px rgba(255, 210, 10, 0.4)'
          }}
        >
          {isAudioActive ? '🔴 STOP AUDIO' : '🎤 START AUDIO INPUT'}
        </button>
      </div>

      {/* Processing Chain */}
      <div className="px-3 pb-4 flex-1">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2" style={{ fontFamily: 'Cal Sans, sans-serif' }}>
            PROCESSING CHAIN
          </h3>
          
          {/* Add Node Buttons */}
          <div className="flex flex-wrap gap-1 mb-3">
            {['entropy', 'chaos-game', 'gematria', 'numerology', 'audio-analyzer'].map(type => (
              <button
                key={type}
                onClick={() => addProcessingNode(type as ProcessingNode['type'])}
                className="px-2 py-1 text-xs transition-colors backdrop-blur-sm"
                style={{
                  fontFamily: 'Syne Mono, monospace',
                  backgroundColor: 'rgba(0, 195, 255, 0.2)',
                  border: '1px solid rgba(0, 195, 255, 0.5)',
                  borderRadius: '4px',
                  color: '#00C3FF',
                  textShadow: '0 0 5px rgba(0, 195, 255, 0.7)'
                }}
              >
                +{type}
              </button>
            ))}
          </div>
        </div>

        {/* Processing Nodes */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          {processingChain.map((node, index) => (
            <div
              key={node.id}
              className="p-3 backdrop-blur-sm border rounded transition-all duration-200"
              style={{
                backgroundColor: node.enabled ? 'rgba(192, 128, 255, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                borderColor: node.enabled ? 'rgba(192, 128, 255, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                boxShadow: node.enabled ? '0 0 8px rgba(192, 128, 255, 0.2)' : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-semibold"
                  style={{ 
                    fontFamily: 'Cal Sans, sans-serif',
                    color: node.enabled ? '#C080FF' : '#888',
                    textShadow: node.enabled ? '0 0 5px rgba(192, 128, 255, 0.7)' : 'none'
                  }}
                >
                  {node.type.toUpperCase()}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleProcessingNode(node.id)}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: node.enabled ? 'rgba(255, 210, 10, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                      color: node.enabled ? '#FFD20A' : '#888'
                    }}
                  >
                    {node.enabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    onClick={() => removeProcessingNode(node.id)}
                    className="text-xs px-2 py-1 rounded bg-red-500/30 text-red-400"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Node Settings */}
              <div className="text-xs space-y-1">
                {Object.entries(node.settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span style={{ color: '#888', fontFamily: 'Syne Mono, monospace' }}>
                      {key}:
                    </span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateProcessingNodeSettings(node.id, { [key]: e.target.value })}
                      className="w-16 px-1 text-xs bg-black/50 border border-purple-500/30 rounded"
                      style={{ color: '#C080FF', fontFamily: 'Syne Mono, monospace' }}
                    />
                  </div>
                ))}
              </div>

              {/* Pipeline Flow Indicator */}
              {index < processingChain.length - 1 && (
                <div className="flex justify-center mt-2">
                  <div 
                    className="text-cyan-400 text-xs"
                    style={{ textShadow: '0 0 5px rgba(0, 195, 255, 0.7)' }}
                  >
                    ↓
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {processingChain.length === 0 && (
            <div className="text-center text-purple-400/60 py-8">
              <div style={{ fontFamily: 'Cal Sans, sans-serif' }}>
                Add processing nodes above
              </div>
              <div className="text-xs mt-1" style={{ fontFamily: 'Syne Mono, monospace' }}>
                to build your reality analysis chain
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
