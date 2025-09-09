'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

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

export function VisualizationCanvasAdvanced({ processingChain, audioData, textInput }: VisualizationCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  
  // Advanced rendering objects
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const shaderMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const postProcessingRef = useRef<any>(null);

  // Character-specific complexity system (NOT stacking!)
  const getCharacterComplexity = (char: string, position: number, context: string): any => {
    const baseValue = char.charCodeAt(0);
    
    // Each character gets a unique "DNA" that affects visuals differently
    const charDNA = {
      frequency: (baseValue % 100) / 100,          // 0-1 for oscillation speed
      amplitude: ((baseValue * 1.618) % 50) / 50,  // 0-1 for movement range
      hue: (baseValue % 360) / 360,                // 0-1 for color
      saturation: 0.7 + ((baseValue % 30) / 100),  // 0.7-1.0 for color intensity
      brightness: 0.4 + ((baseValue % 60) / 100),  // 0.4-1.0 for luminosity
      complexity: Math.min((baseValue % 10) + 1, 5), // 1-5 complexity levels
      morphType: baseValue % 8,                     // 0-7 different visual types
      energyLevel: (Math.sin(baseValue * 0.1) + 1) / 2, // 0-1 energy
    };

    // Position influence (subtle, not overwhelming)
    charDNA.phaseShift = position * 0.1;
    
    // Context influence (surrounding characters create harmonics)
    if (context.length > 2) {
      const contextHash = context.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
      charDNA.harmony = (contextHash % 100) / 500; // Very subtle context influence
    } else {
      charDNA.harmony = 0;
    }

    return charDNA;
  };

  // Advanced shader materials
  const createAdvancedShaders = () => {
    // Particle shader with trails and glow
    const particleVertexShader = `
      attribute float size;
      attribute float energy;
      attribute float phase;
      varying vec3 vColor;
      varying float vEnergy;
      uniform float time;
      
      void main() {
        vColor = color;
        vEnergy = energy;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Dynamic movement based on character properties
        float wave = sin(time * 2.0 + phase) * energy * 0.5;
        mvPosition.x += wave;
        mvPosition.y += cos(time * 1.5 + phase * 1.2) * energy * 0.3;
        
        gl_PointSize = size * (300.0 / -mvPosition.z) * (0.8 + energy * 0.4);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const particleFragmentShader = `
      varying vec3 vColor;
      varying float vEnergy;
      uniform float time;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float distance = length(center);
        
        if (distance > 0.5) discard;
        
        // Create glowing core with energy-based intensity
        float core = 1.0 - (distance * 2.0);
        float glow = pow(core, 2.0);
        
        // Pulsing effect based on energy
        float pulse = 0.8 + 0.2 * sin(time * 8.0 + vEnergy * 10.0);
        
        // Color mixing with energy influence
        vec3 finalColor = vColor * pulse;
        float alpha = glow * (0.6 + vEnergy * 0.4);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Fractal shader for complex geometry
    const fractalVertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float complexity;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        vec3 pos = position;
        
        // Fractal displacement
        float noise = sin(pos.x * complexity + time) * cos(pos.y * complexity + time * 0.7) * 0.1;
        pos.z += noise;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fractalFragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float time;
      uniform float complexity;
      uniform vec3 baseColor;
      
      // Mandelbrot-style fractal
      vec2 mandelbrot(vec2 c) {
        vec2 z = vec2(0.0);
        for(int i = 0; i < 20; i++) {
          z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
          if(length(z) > 2.0) break;
        }
        return z;
      }
      
      void main() {
        vec2 c = (vUv - 0.5) * complexity + vec2(sin(time * 0.1), cos(time * 0.1)) * 0.1;
        vec2 result = mandelbrot(c);
        
        float intensity = 1.0 - clamp(length(result) / 4.0, 0.0, 1.0);
        
        vec3 color = baseColor * intensity;
        color += vec3(intensity * 0.5, intensity * 0.3, intensity * 0.8);
        
        gl_FragColor = vec4(color, intensity * 0.8);
      }
    `;

    return {
      particle: new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
      }),
      fractal: new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          complexity: { value: 1.0 },
          baseColor: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: fractalVertexShader,
        fragmentShader: fractalFragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      })
    };
  };

  // Initialize advanced WebGL scene
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🎮 Initializing ADVANCED WebGL scene...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.Fog(0x000510, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 10000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Advanced renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000510, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Add point lights for atmosphere
    const light1 = new THREE.PointLight(0x00ffff, 1, 100);
    light1.position.set(50, 50, 50);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 1, 100);
    light2.position.set(-50, -50, 50);
    scene.add(light2);

    mountRef.current.appendChild(renderer.domElement);
    
    console.log('🚀 Advanced WebGL initialized, canvas size:', mountRef.current.clientWidth, 'x', mountRef.current.clientHeight);

    // Start animation immediately
    if (!isRunning) {
      console.log('🎬 Starting advanced animation loop...');
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

        // Gentle camera movement
        camera.position.x = Math.sin(time * 0.05) * 2;
        camera.position.y = Math.cos(time * 0.03) * 1;
        camera.lookAt(0, 0, 0);

        // Update lights
        light1.position.x = Math.sin(time * 0.7) * 30;
        light1.position.z = Math.cos(time * 0.7) * 30;
        light2.position.x = Math.cos(time * 0.5) * 40;
        light2.position.y = Math.sin(time * 0.5) * 20;

        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animateLoop);
      };
      
      animateLoop();
    }

    // Handle resize
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

  // Advanced entropy visualization - each character adds complexity, not size
  const processEntropy3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    // Clear old particles
    particleSystemsRef.current.forEach(system => {
      sceneRef.current?.remove(system);
    });
    particleSystemsRef.current = [];
    shaderMaterialsRef.current = [];

    const chars = text.split('');
    const shaders = createAdvancedShaders();
    
    // Each character creates its own particle cluster
    chars.forEach((char, index) => {
      const charDNA = getCharacterComplexity(char, index, text.substring(Math.max(0, index - 2), index + 3));
      
      // Particle count based on complexity (not text length!)
      const particleCount = 100 + (charDNA.complexity * 50);
      
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const energies = new Float32Array(particleCount);
      const phases = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Position particles in character-specific patterns
        const angle = (i / particleCount) * Math.PI * 2 * charDNA.complexity;
        const radius = 5 + charDNA.amplitude * 15;
        const height = (Math.sin(angle * charDNA.frequency) * charDNA.amplitude - 0.5) * 10;
        
        // Character-specific positioning (not stacked!)
        const offsetX = (index - chars.length / 2) * 8; // Spread characters horizontally
        positions[i * 3] = Math.cos(angle) * radius + offsetX;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Character-specific colors
        const color = new THREE.Color().setHSL(
          charDNA.hue + (i / particleCount) * 0.1, 
          charDNA.saturation, 
          charDNA.brightness
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = 1 + charDNA.energyLevel * 3;
        energies[i] = charDNA.energyLevel;
        phases[i] = charDNA.phaseShift + (i / particleCount) * Math.PI * 2;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('energy', new THREE.BufferAttribute(energies, 1));
      geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

      const particles = new THREE.Points(geometry, shaders.particle);
      sceneRef.current.add(particles);
      particleSystemsRef.current.push(particles);
      shaderMaterialsRef.current.push(shaders.particle);
    });

    return text;
  };

  // Advanced chaos game with fractals
  const processChaosGame3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    const chars = text.split('');
    const shaders = createAdvancedShaders();

    chars.forEach((char, index) => {
      const charDNA = getCharacterComplexity(char, index, text);
      
      // Create fractal plane for each character
      const geometry = new THREE.PlaneGeometry(8, 8, 32, 32);
      const material = shaders.fractal.clone();
      
      material.uniforms.complexity.value = charDNA.complexity;
      material.uniforms.baseColor.value = new THREE.Color().setHSL(charDNA.hue, charDNA.saturation, charDNA.brightness);
      
      const plane = new THREE.Mesh(geometry, material);
      
      // Position based on character index (not stacked!)
      const offsetX = (index - chars.length / 2) * 12;
      plane.position.set(offsetX, 0, -20);
      plane.rotation.x = -Math.PI / 4;
      
      sceneRef.current.add(plane);
      shaderMaterialsRef.current.push(material);
    });

    return text;
  };

  // Process data through chain (fixed stacking)
  const processDataThroughChain = (input: string | Float32Array) => {
    if (!input) return;

    for (const node of processingChain) {
      if (!node.enabled) continue;
      
      switch (node.type) {
        case 'entropy':
          processEntropy3D(input as string, node.settings);
          break;
        case 'chaos-game':
          processChaosGame3D(input as string, node.settings);
          break;
        // Add other processors...
      }
    }
  };

  // Process input when it changes
  useEffect(() => {
    if (textInput && processingChain.length > 0) {
      console.log('🔄 Processing input:', textInput);
      processDataThroughChain(textInput);
    }
  }, [textInput, processingChain]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      style={{ minHeight: '100vh' }}
    />
  );
}
