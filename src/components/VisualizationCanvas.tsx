'use client';

import React, { useRef, useEffect, useState } from 'react';

interface VisualizationCanvasProps {
  processingChain: ProcessingNode[];
  audioData?: Float32Array;
  textInput?: string;
}

interface ProcessingNode {
  id: string;
  type: 'entropy' | 'chaos-game' | 'gematria' | 'numerology' | 'audio-analyzer';
  settings: Record<string, any>;
  enabled: boolean;
}

export function VisualizationCanvas({ processingChain, audioData, textInput }: VisualizationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Auto-start when we have processing chain or data
    if ((processingChain.length > 0 || audioData || textInput) && !isRunning) {
      setIsRunning(true);
    }
  }, [processingChain, audioData, textInput, isRunning]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Process data through the chain
      let processedData = processDataThroughChain(audioData, textInput, processingChain, time);
      
      // Render visualization
      renderVisualization(ctx, processedData, canvas, time);

      time += 0.016; // ~60fps
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [processingChain, audioData, textInput, isRunning]);

  const processDataThroughChain = (audio: Float32Array | undefined, text: string | undefined, chain: ProcessingNode[], time: number) => {
    let data: any = { audio, text, time, values: [] };

    // Process through each enabled node in the chain
    for (const node of chain) {
      if (!node.enabled) continue;

      switch (node.type) {
        case 'entropy':
          data = processEntropy(data, node.settings);
          break;
        case 'chaos-game':
          data = processChaosGame(data, node.settings);
          break;
        case 'gematria':
          data = processGematria(data, node.settings);
          break;
        case 'audio-analyzer':
          data = processAudioAnalysis(data, node.settings);
          break;
        case 'numerology':
          data = processNumerology(data, node.settings);
          break;
        default:
          break;
      }
    }

    return data;
  };

  const processEntropy = (data: any, settings: any) => {
    // Enhanced entropy calculation and amplification
    const rawEntropy = calculateEntropy(data.audio || data.text || '');
    const intensity = parseFloat(settings.intensity) || 0.3;
    const amplification = parseFloat(settings.amplification) || 0.8;
    const waveCount = parseInt(settings.waveCount) || 2;
    const processedEntropy = Math.min(rawEntropy * intensity * amplification, 5); // Cap the entropy
    
    return {
      ...data,
      entropy: processedEntropy,
      entropyWaves: generateEntropyWaves(processedEntropy, data.text, waveCount),
      values: [...data.values, { type: 'entropy', value: processedEntropy }]
    };
  };

  const processChaosGame = (data: any, settings: any) => {
    // Enhanced chaos game algorithm
    const attractors = parseInt(settings.attractors) || 3;
    const iterations = parseInt(settings.iterations) || 1000;
    const jumpRatio = parseFloat(settings.jumpRatio) || 0.5;
    const chaosPoints = generateChaosGame(data.values, attractors, iterations, jumpRatio, data.text);
    return {
      ...data,
      chaosPoints,
      values: [...data.values, { type: 'chaos', value: chaosPoints }]
    };
  };

  const processGematria = (data: any, settings: any) => {
    // Calculate gematria values
    if (data.text) {
      const gematriaValue = calculateGematria(data.text, settings.system || 'hebrew');
      return {
        ...data,
        gematria: gematriaValue,
        values: [...data.values, { type: 'gematria', value: gematriaValue }]
      };
    }
    return data;
  };

  const processAudioAnalysis = (data: any, settings: any) => {
    if (data.audio) {
      const frequencies = analyzeFrequencies(data.audio);
      return {
        ...data,
        frequencies,
        values: [...data.values, { type: 'audio', value: frequencies }]
      };
    }
    return data;
  };

  const processNumerology = (data: any, settings: any) => {
    if (data.text) {
      const numerologyValue = calculateNumerology(data.text, settings.system || 'pythagorean', settings.reduction || 'single');
      return {
        ...data,
        numerology: numerologyValue,
        values: [...data.values, { type: 'numerology', value: numerologyValue }]
      };
    }
    return data;
  };

  const generateEntropyWaves = (entropy: number, text?: string, maxWaves: number = 2) => {
    const waves = [];
    const waveCount = Math.min(maxWaves, Math.floor(entropy) + 1);
    
    for (let i = 0; i < waveCount; i++) {
      waves.push({
        frequency: 0.5 + entropy * 0.2 + i * 0.3, // Much more controlled frequency
        amplitude: Math.min(entropy * (0.3 + i * 0.1), 1.5), // Capped amplitude
        phase: text ? text.charCodeAt(i % text.length) * 0.005 : i * 0.3 // Reduced phase influence
      });
    }
    
    return waves;
  };

  const calculateNumerology = (text: string, system: string, reduction: string): number => {
    // Pythagorean numerology
    const pythagoreanValues: Record<string, number> = {
      'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
      'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
      's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
    };
    
    let sum = text.toLowerCase().split('').reduce((total, char) => {
      return total + (pythagoreanValues[char] || 0);
    }, 0);
    
    // Reduce to single digit if specified
    if (reduction === 'single') {
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((total, digit) => total + parseInt(digit), 0);
      }
    }
    
    return sum;
  };

  const calculateEntropy = (input: any): number => {
    if (typeof input === 'string') {
      // Create character-specific entropy based on unique combinations
      let totalEntropy = 0;
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const charValue = getCharacterValue(char);
        const positionWeight = (i + 1) / input.length; // Position matters
        const contextWeight = i > 0 ? getCharacterValue(input[i-1]) * 0.1 : 0; // Previous char influence
        
        totalEntropy += charValue * positionWeight + contextWeight;
      }
      
      return totalEntropy / Math.max(input.length, 1); // Normalize by length
    }
    return Math.random();
  };

  const getCharacterValue = (char: string): number => {
    // Comprehensive character value mapping for ALL typeable characters
    const charCode = char.charCodeAt(0);
    
    // ASCII printable characters (32-126) + extended
    const characterMap: Record<string, number> = {
      // Basic punctuation & symbols
      ' ': 0.1, '!': 1.1, '"': 1.2, '#': 1.3, '$': 1.4, '%': 1.5, '&': 1.6, "'": 1.7,
      '(': 1.8, ')': 1.9, '*': 2.0, '+': 2.1, ',': 2.2, '-': 2.3, '.': 2.4, '/': 2.5,
      
      // Numbers (0-9)
      '0': 3.0, '1': 3.1, '2': 3.2, '3': 3.3, '4': 3.4, '5': 3.5, '6': 3.6, '7': 3.7, '8': 3.8, '9': 3.9,
      
      // More symbols
      ':': 4.0, ';': 4.1, '<': 4.2, '=': 4.3, '>': 4.4, '?': 4.5, '@': 4.6,
      
      // Uppercase letters (A-Z)
      'A': 5.0, 'B': 5.1, 'C': 5.2, 'D': 5.3, 'E': 5.4, 'F': 5.5, 'G': 5.6, 'H': 5.7, 'I': 5.8, 'J': 5.9,
      'K': 6.0, 'L': 6.1, 'M': 6.2, 'N': 6.3, 'O': 6.4, 'P': 6.5, 'Q': 6.6, 'R': 6.7, 'S': 6.8, 'T': 6.9,
      'U': 7.0, 'V': 7.1, 'W': 7.2, 'X': 7.3, 'Y': 7.4, 'Z': 7.5,
      
      // More symbols
      '[': 7.6, '\\': 7.7, ']': 7.8, '^': 7.9, '_': 8.0, '`': 8.1,
      
      // Lowercase letters (a-z)
      'a': 8.2, 'b': 8.3, 'c': 8.4, 'd': 8.5, 'e': 8.6, 'f': 8.7, 'g': 8.8, 'h': 8.9, 'i': 9.0, 'j': 9.1,
      'k': 9.2, 'l': 9.3, 'm': 9.4, 'n': 9.5, 'o': 9.6, 'p': 9.7, 'q': 9.8, 'r': 9.9, 's': 10.0, 't': 10.1,
      'u': 10.2, 'v': 10.3, 'w': 10.4, 'x': 10.5, 'y': 10.6, 'z': 10.7,
      
      // Final symbols
      '{': 10.8, '|': 10.9, '}': 11.0, '~': 11.1,
      
      // Extended ASCII & Unicode common symbols
      '€': 12.0, '£': 12.1, '¥': 12.2, '©': 12.3, '®': 12.4, '™': 12.5, '°': 12.6, '±': 12.7,
      '×': 12.8, '÷': 12.9, 'α': 13.0, 'β': 13.1, 'γ': 13.2, 'δ': 13.3, 'π': 13.4, 'Σ': 13.5,
      '∞': 13.6, '∂': 13.7, '∆': 13.8, '∇': 13.9, '∫': 14.0, '∑': 14.1, '∏': 14.2, '√': 14.3,
      '≈': 14.4, '≠': 14.5, '≤': 14.6, '≥': 14.7, '←': 14.8, '→': 14.9, '↑': 15.0, '↓': 15.1
    };
    
    // Return mapped value or generate from char code for unmapped characters
    return characterMap[char] || (charCode / 10.0) % 20;
  };

  const generateChaosGame = (values: any[], attractors: number, iterations: number, jumpRatio: number, text?: string) => {
    const points = [];
    let x = 0.5, y = 0.5;
    
    // Use text to influence attractor positions if available
    const attractorPositions = [];
    for (let i = 0; i < attractors; i++) {
      const angle = (2 * Math.PI * i / attractors) + (text ? text.charCodeAt(i % text.length) * 0.01 : 0);
      attractorPositions.push({
        x: 0.5 + Math.cos(angle) * 0.4,
        y: 0.5 + Math.sin(angle) * 0.4
      });
    }
    
    for (let i = 0; i < iterations; i++) {
      // Use character-specific values to influence attractor selection
      let attractorIndex;
      if (text && i < text.length) {
        const charValue = getCharacterValue(text[i]);
        attractorIndex = Math.floor(charValue * attractors) % attractors;
      } else {
        attractorIndex = Math.floor(Math.random() * attractors);
      }
      
      const attractor = attractorPositions[attractorIndex];
      
      // Variable jump ratio based on character value
      let currentJumpRatio = jumpRatio;
      if (text && i < text.length) {
        const charValue = getCharacterValue(text[i]);
        currentJumpRatio = jumpRatio * (0.8 + (charValue % 1) * 0.4); // 0.8-1.2 range
      }
      
      x = x + (attractor.x - x) * currentJumpRatio;
      y = y + (attractor.y - y) * currentJumpRatio;
      
      // Skip first few points to let it settle
      if (i > 10) {
        points.push({ x, y, iteration: i, attractor: attractorIndex });
      }
    }
    
    return points;
  };

  const calculateGematria = (text: string, system: string): number => {
    // Hebrew gematria values (simplified)
    const hebrewValues: Record<string, number> = {
      'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 10,
      'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 60, 'p': 70, 'q': 80, 'r': 90, 's': 100,
      't': 200, 'u': 300, 'v': 400, 'w': 500, 'x': 600, 'y': 700, 'z': 800
    };
    
    return text.toLowerCase().split('').reduce((sum, char) => {
      return sum + (hebrewValues[char] || 0);
    }, 0);
  };

  const analyzeFrequencies = (audioData: Float32Array) => {
    // Simple frequency analysis
    return {
      bass: audioData.slice(0, 10).reduce((a, b) => a + Math.abs(b), 0) / 10,
      mid: audioData.slice(10, 50).reduce((a, b) => a + Math.abs(b), 0) / 40,
      high: audioData.slice(50, 100).reduce((a, b) => a + Math.abs(b), 0) / 50
    };
  };

  const renderVisualization = (ctx: CanvasRenderingContext2D, data: any, canvas: HTMLCanvasElement, time: number) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Set cyberpunk colors
    const colors = ['#FFD20A', '#00C3FF', '#C080FF', '#ff8c00'];
    
    // Default visualization if no processing nodes
    if (data.values.length === 0 && (data.text || data.audio)) {
      // Improved text-based visualization that fills the whole panel
      if (data.text) {
        ctx.fillStyle = colors[2];
        ctx.shadowColor = colors[2];
        ctx.shadowBlur = 8;
        ctx.font = '14px Syne Mono';
        const textLength = data.text.length;
        const charsPerRow = Math.floor(width / 20); // Adjust character spacing
        const maxChars = Math.min(textLength, Math.floor((width * height) / 400)); // Fill more space
        
        for (let i = 0; i < maxChars; i++) {
          const char = data.text[i];
          if (char === ' ') continue; // Skip spaces
          
          const col = i % charsPerRow;
          const row = Math.floor(i / charsPerRow);
          const x = col * (width / charsPerRow) + Math.sin(time + i * 0.1) * 15;
          const y = row * 25 + 50 + Math.cos(time + i * 0.1) * 10;
          
          // Skip if outside canvas
          if (y > height - 30) break;
          
          const alpha = 0.6 + Math.sin(time + i * 0.05) * 0.4;
          ctx.globalAlpha = alpha;
          ctx.fillText(char, x, y);
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      
      // Simple audio visualization
      if (data.audio) {
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < Math.min(data.audio.length, width); i++) {
          const x = (i / data.audio.length) * width;
          const y = height / 2 + data.audio[i] * height / 4 * Math.sin(time);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    
    // Render processed data
    if (data.chaosPoints) {
      ctx.fillStyle = colors[0];
      ctx.shadowColor = colors[0];
      ctx.shadowBlur = 10;
      data.chaosPoints.forEach((point: any, i: number) => {
        const x = point.x * width;
        const y = point.y * height;
        const size = 2 + Math.sin(time + i * 0.1) * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    }

    if (data.entropy || data.entropyWaves) {
      // Enhanced entropy visualization with multiple waves
      ctx.shadowBlur = 5;
      ctx.lineWidth = 1.5;
      
      if (data.entropyWaves) {
        data.entropyWaves.forEach((wave: any, index: number) => {
          ctx.strokeStyle = colors[index % colors.length];
          ctx.shadowColor = colors[index % colors.length];
          ctx.beginPath();
          
          for (let i = 0; i < width; i += 2) {
            const x = i;
            const y = height / 2 + 
              Math.sin(i * wave.frequency * 0.01 + time + wave.phase) * 
              wave.amplitude * 20 + 
              Math.cos(i * 0.005 + time * 0.5) * 10;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      } else if (data.entropy) {
        // Fallback single wave
        ctx.strokeStyle = colors[1];
        ctx.shadowColor = colors[1];
        ctx.beginPath();
        for (let i = 0; i < width; i += 3) {
          const y = height / 2 + Math.sin(i * 0.01 + time + data.entropy) * data.entropy * 40;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
      }
      
      ctx.shadowBlur = 0;
    }

    if (data.gematria) {
      // Render gematria as geometric patterns
      ctx.fillStyle = colors[2];
      ctx.shadowColor = colors[2];
      ctx.shadowBlur = 15;
      const centerX = width / 2;
      const centerY = height / 2;
      const sides = Math.max(3, data.gematria % 12);
      const radius = 50 + (data.gematria % 100) + Math.sin(time) * 20;
      
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + time * 0.5;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (data.frequencies) {
      // Render audio frequencies as animated bars
      ctx.shadowBlur = 10;
      const barWidth = width / 3;
      
      ctx.fillStyle = colors[3];
      ctx.shadowColor = colors[3];
      ctx.fillRect(0, height - data.frequencies.bass * height * (1 + Math.sin(time) * 0.2), barWidth, data.frequencies.bass * height);
      
      ctx.fillStyle = colors[1];
      ctx.shadowColor = colors[1];
      ctx.fillRect(barWidth, height - data.frequencies.mid * height * (1 + Math.sin(time + 1) * 0.2), barWidth, data.frequencies.mid * height);
      
      ctx.fillStyle = colors[0];
      ctx.shadowColor = colors[0];
      ctx.fillRect(barWidth * 2, height - data.frequencies.high * height * (1 + Math.sin(time + 2) * 0.2), barWidth, data.frequencies.high * height);
      
      ctx.shadowBlur = 0;
    }

    if (data.numerology) {
      // Render numerology as sacred geometric patterns
      ctx.fillStyle = colors[3];
      ctx.shadowColor = colors[3];
      ctx.shadowBlur = 12;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Create patterns based on numerology value
      const numValue = data.numerology;
      const baseRadius = 30 + numValue * 5;
      
      // Draw nested polygons based on the number
      for (let layer = 0; layer < Math.min(numValue, 9); layer++) {
        const radius = baseRadius + layer * 15;
        const sides = Math.max(3, numValue + layer);
        const rotation = time * (0.1 + layer * 0.05) + layer * Math.PI / 4;
        
        ctx.globalAlpha = 0.3 + (layer * 0.1);
        ctx.beginPath();
        
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2 + rotation;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.closePath();
        ctx.stroke();
      }
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  };

  const toggleVisualization = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
      {/* Canvas Controls */}
      <div className="p-3 border-b border-purple-500/30">
        <button
          onClick={toggleVisualization}
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded transition-colors"
          style={{
            fontFamily: 'Cal Sans, sans-serif',
            fontWeight: '600'
          }}
        >
          {isRunning ? 'PAUSE' : 'START'} VISUALIZATION
        </button>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(192, 128, 255, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)'
          }}
        />
        
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-purple-400/60">
              <div className="text-2xl mb-2" style={{ fontFamily: 'Cal Sans, sans-serif' }}>
                REALITY CANVAS
              </div>
              <div className="text-sm" style={{ fontFamily: 'Syne Mono, monospace' }}>
                Configure processing chain and start visualization
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
