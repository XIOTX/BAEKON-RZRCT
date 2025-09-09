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

export function LaserRealityCanvas({ processingChain, audioData, textInput, inputAmplitude = 1.0 }: VisualizationCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  
  // Visual elements
  const textMeshesRef = useRef<THREE.Mesh[]>([]);
  const laserLinesRef = useRef<THREE.Line[]>([]);
  const staticParticlesRef = useRef<THREE.Points | null>(null);
  const shaderMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);

  // Character positioning system - random 3D space
  const getCharacterPosition = (char: string, index: number, totalChars: number): THREE.Vector3 => {
    // Use character code as seed for consistent but random positioning
    const seed = char.charCodeAt(0) + index * 1000;
    const random = (s: number) => Math.sin(s * 12.9898) * 43758.5453 % 1;
    
    // Map to 3D space with proper depth
    const x = (random(seed) - 0.5) * 60; // -30 to 30
    const y = (random(seed + 1) - 0.5) * 40; // -20 to 20  
    const z = (random(seed + 2) - 0.5) * 80; // -40 to 40 (depth)
    
    return new THREE.Vector3(x, y, z);
  };

  // Create dark static background
  const createStaticBackground = () => {
    if (!sceneRef.current) return;

    // Create static particles
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Random positions in large space
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Dark grainy colors
      const brightness = Math.random() * 0.1 + 0.05; // Very dim
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.8;
      colors[i * 3 + 2] = brightness * 1.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    const staticPoints = new THREE.Points(geometry, material);
    sceneRef.current.add(staticPoints);
    staticParticlesRef.current = staticPoints;
  };

  // Laser carving shader
  const createLaserShader = () => {
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform float time;
      uniform float intensity;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Subtle laser oscillation
        pos.x += sin(time * 2.0 + position.y * 0.1) * intensity * 0.1;
        pos.y += cos(time * 1.5 + position.x * 0.1) * intensity * 0.05;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform float time;
      uniform float intensity;
      uniform vec3 laserColor;
      
      void main() {
        // Laser glow effect
        float glow = pow(abs(sin(time * 4.0 + vPosition.x * 0.2)), 2.0);
        
        // Edge detection for carving effect
        float edge = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
        edge = pow(edge, 2.0);
        
        vec3 color = laserColor * intensity;
        color += vec3(1.0, 0.5, 0.0) * glow * 0.5; // Orange glow
        color += vec3(0.0, 1.0, 1.0) * edge * 0.3;  // Cyan edges
        
        float alpha = intensity * (0.8 + glow * 0.2 + edge * 0.5);
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.0 },
        laserColor: { value: new THREE.Color(0x00ffff) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  };

  // Raw text visualization (before plugins)
  const displayRawText = (text: string) => {
    if (!sceneRef.current) return;

    // Clear old text
    textMeshesRef.current.forEach(mesh => {
      sceneRef.current?.remove(mesh);
    });
    textMeshesRef.current = [];

    const loader = new THREE.FontLoader();
    
    // For now, create simple text planes until font loads
    text.split('').forEach((char, index) => {
      const geometry = new THREE.PlaneGeometry(2, 3);
      const material = new THREE.MeshBasicMaterial({
        color: 0x404040,
        transparent: true,
        opacity: 0.6
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      const position = getCharacterPosition(char, index, text.length);
      mesh.position.copy(position);
      
      sceneRef.current?.add(mesh);
      textMeshesRef.current.push(mesh);
    });
  };

  // Laser carving effect for each character
  const createLaserCarving = (char: string, index: number, totalChars: number, pluginType: string) => {
    if (!sceneRef.current) return;

    const position = getCharacterPosition(char, index, totalChars);
    const charCode = char.charCodeAt(0);
    
    // Character-specific laser properties
    const intensity = (inputAmplitude * 0.1) + ((charCode % 100) / 1000); // Very small per-character effect
    const hue = (charCode % 360) / 360;
    
    // Create laser-carved geometry based on plugin type
    let geometry: THREE.BufferGeometry;
    
    switch (pluginType) {
      case 'entropy':
        // Jagged entropy lines
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i / 10) * Math.PI * 2;
          const radius = 1 + Math.sin(charCode * 0.1 + i) * intensity * 2;
          points.push(new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            (Math.random() - 0.5) * intensity
          ));
        }
        points.push(points[0]); // Close the loop
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        break;
        
      case 'chaos-game':
        // Fractal triangular pattern
        const chaosPoints = [];
        let x = 0, y = 0;
        const vertices = [
          new THREE.Vector3(-1, -1, 0),
          new THREE.Vector3(1, -1, 0),
          new THREE.Vector3(0, 1, 0)
        ];
        
        for (let i = 0; i < 50; i++) {
          const target = vertices[charCode % 3];
          x = (x + target.x) / 2;
          y = (y + target.y) / 2;
          chaosPoints.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * intensity * 0.5));
        }
        geometry = new THREE.BufferGeometry().setFromPoints(chaosPoints);
        break;
        
      default:
        // Simple glowing line
        geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-1, 0, 0),
          new THREE.Vector3(1, 0, 0)
        ]);
    }

    // Create laser material
    const laserMaterial = createLaserShader();
    laserMaterial.uniforms.intensity.value = intensity;
    laserMaterial.uniforms.laserColor.value = new THREE.Color().setHSL(hue, 0.8, 0.6);

    // Create line or points based on geometry
    let laserObject;
    if (pluginType === 'chaos-game') {
      const pointsMaterial = new THREE.PointsMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      laserObject = new THREE.Points(geometry, pointsMaterial);
    } else {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color().setHSL(hue, 0.8, 0.6),
        transparent: true,
        opacity: 0.9,
        linewidth: 2
      });
      laserObject = new THREE.Line(geometry, lineMaterial);
    }

    laserObject.position.copy(position);
    sceneRef.current.add(laserObject);
    
    if (laserObject instanceof THREE.Line) {
      laserLinesRef.current.push(laserObject);
    }
    
    shaderMaterialsRef.current.push(laserMaterial);
  };

  // Process input through active plugins
  const processInput = (text: string) => {
    if (!text || !sceneRef.current) return;

    // Always show raw text first
    displayRawText(text);

    // Clear previous laser effects
    laserLinesRef.current.forEach(line => {
      sceneRef.current?.remove(line);
    });
    laserLinesRef.current = [];

    // Apply each active plugin
    processingChain.forEach(plugin => {
      if (!plugin.enabled) return;

      text.split('').forEach((char, index) => {
        createLaserCarving(char, index, text.length, plugin.type);
      });
    });
  };

  // Initialize scene
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🔥 Initializing LASER REALITY CANVAS...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008); // Very dark blue
    scene.fog = new THREE.Fog(0x000008, 30, 120);
    sceneRef.current = scene;

    // Camera setup for 3D depth
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 50);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000008, 1);
    rendererRef.current = renderer;

    // Create static background
    createStaticBackground();

    mountRef.current.appendChild(renderer.domElement);
    
    console.log('🚀 Laser canvas initialized');

    // Animation loop
    if (!isRunning) {
      setIsRunning(true);
      
      const animateLoop = () => {
        if (!renderer || !scene || !camera) return;

        const time = Date.now() * 0.001;

        // Update shader uniforms
        shaderMaterialsRef.current.forEach(material => {
          if (material.uniforms.time) {
            material.uniforms.time.value = time;
          }
        });

        // Animate static background
        if (staticParticlesRef.current) {
          staticParticlesRef.current.rotation.y += 0.0005;
          staticParticlesRef.current.rotation.x += 0.0002;
        }

        // Gentle camera drift
        camera.position.x = Math.sin(time * 0.02) * 2;
        camera.position.y = Math.cos(time * 0.015) * 1;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animateLoop);
      };
      
      animateLoop();
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

  // Process input when it changes
  useEffect(() => {
    if (textInput) {
      console.log('⚡ Processing input:', textInput, 'with amplitude:', inputAmplitude);
      processInput(textInput);
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
