'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface VisualizationCanvasProps {
  processingChain: ProcessingNode[];
  audioData?: Float32Array;
  textInput?: string;
  inputAmplitude?: number;
}

interface ProcessingNode {
  id: string;
  type: 'entropy' | 'chaos-game' | 'gematria' | 'numerology' | 'audio-analyzer';
  settings: Record<string, any>;
  enabled: boolean;
}

export function SimpleWebGLCanvas({ processingChain, audioData, textInput, inputAmplitude = 1.0 }: VisualizationCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  
  // Visual objects
  const objectsRef = useRef<THREE.Object3D[]>([]);

  // Get character position in 3D space (match panel aspect ratio)
  const getCharacterPosition = (char: string, index: number): THREE.Vector3 => {
    const seed = char.charCodeAt(0) + index * 1000;
    const random = (s: number) => Math.sin(s * 12.9898) * 43758.5453 % 1;
    
    // Use wider range to fill the panel properly
    return new THREE.Vector3(
      (random(seed) - 0.5) * 80,      // x: -40 to 40 (wider for landscape panel)
      (random(seed + 1) - 0.5) * 50,  // y: -25 to 25 (taller range)
      (random(seed + 2) - 0.5) * 60   // z: -30 to 30 (good depth)
    );
  };

  // Create static background
  const createBackground = () => {
    if (!sceneRef.current) return;

    // Static particles
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x333366,
      size: 0.5,
      transparent: true,
      opacity: 0.3
    });
    
    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
  };

  // Create 3D text using canvas texture
  const createTextTexture = (char: string): THREE.Texture => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // High resolution for crisp text
    canvas.width = 128;
    canvas.height = 128;
    
    // Style like the app text
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 80px "Syne Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // OUTLINED TEXT LIKE THE LOGO
    // First draw the outline (stroke)
    ctx.strokeStyle = '#FF5983'; // Pink outline like logo
    ctx.lineWidth = 2;
    ctx.shadowColor = '#FF5983';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeText(char, canvas.width / 2, canvas.height / 2);
    
    // Then draw the fill
    ctx.fillStyle = '#C080FF'; // Purple fill
    ctx.shadowColor = '#C080FF';
    ctx.shadowBlur = 20;
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    return texture;
  };

  // Display floating 3D text
  const displayText = (text: string) => {
    if (!sceneRef.current) return;

    // Clear old objects
    objectsRef.current.forEach(obj => {
      sceneRef.current?.remove(obj);
    });
    objectsRef.current = [];

    if (!text) return;

    console.log('📝 Creating 3D text for:', text);

    // Create 3D text for each character
    text.split('').forEach((char, index) => {
      if (char === ' ') return; // Skip spaces
      
      const position = getCharacterPosition(char, index);
      
      // Create textured plane for the character
      const geometry = new THREE.PlaneGeometry(4, 4);
      const texture = createTextTexture(char);
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.1
      });
      
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.copy(position);
      
      // Make text face camera
      textMesh.lookAt(cameraRef.current?.position || new THREE.Vector3(0, 0, 40));
      
      sceneRef.current.add(textMesh);
      objectsRef.current.push(textMesh);
      
      console.log(`✅ Added character "${char}" at position:`, position);
    });
  };

  // Initialize WebGL
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🎮 Initializing Simple WebGL Canvas...');
    console.log('Mount ref dimensions:', mountRef.current.clientWidth, 'x', mountRef.current.clientHeight);

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000510);
      sceneRef.current = scene;
      console.log('✅ Scene created');

      // Camera
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 600;
      
      // Use wider field of view to see the full range
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 80); // Zoomed out to see all letters
      cameraRef.current = camera;
      console.log('✅ Camera created');

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000510, 1);
      rendererRef.current = renderer;
      console.log('✅ Renderer created');

      // No test cube - we'll show text instead
      console.log('✅ Scene ready for text');

      // Add background
      createBackground();
      console.log('✅ Background created');

      // Add to DOM
      mountRef.current.appendChild(renderer.domElement);
      console.log('✅ Canvas added to DOM');
      
      // Force initial render
      renderer.render(scene, camera);
      console.log('✅ Initial render complete');
      
    } catch (error) {
      console.error('❌ WebGL initialization failed:', error);
    }

    // Start animation loop immediately
    if (!isRunning && rendererRef.current && sceneRef.current && cameraRef.current) {
      console.log('🎬 Starting animation loop...');
      setIsRunning(true);
      
      const animate = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        const time = Date.now() * 0.001;

        // Make text always face camera
        objectsRef.current.forEach(textMesh => {
          if (textMesh.type === 'Mesh') {
            textMesh.lookAt(cameraRef.current!.position);
          }
        });

        // Gentle camera movement (wider orbit for zoomed out view)
        cameraRef.current.position.x = Math.sin(time * 0.02) * 8;
        cameraRef.current.position.y = Math.cos(time * 0.015) * 5;
        cameraRef.current.position.z = 80 + Math.sin(time * 0.01) * 10; // Gentle zoom in/out
        cameraRef.current.lookAt(0, 0, 0);

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      console.log('✅ Animation started');
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update visuals when input changes
  useEffect(() => {
    if (textInput) {
      console.log('📝 Updating visuals for:', textInput);
      displayText(textInput);
    }
  }, [textInput, processingChain, inputAmplitude]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      style={{ minHeight: '100vh' }}
    />
  );
}
