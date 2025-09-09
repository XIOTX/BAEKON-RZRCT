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

export function VisualizationCanvasWebGL({ processingChain, audioData, textInput }: VisualizationCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  
  // 3D Objects for different visualizations
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const geometryObjectsRef = useRef<THREE.Mesh[]>([]);
  const shaderMaterialsRef = useRef<THREE.ShaderMaterial[]>([]);

  // Character value system (same as before but now drives 3D!)
  const getCharacterValue = (char: string, position: number = 0, context: string = ''): number => {
    const baseValue = char.charCodeAt(0);
    let value = baseValue;
    
    // Position influence (0-1000)
    value += Math.sin(position * 0.1) * 100;
    
    // Context influence - surrounding characters affect this one
    if (context.length > 0) {
      const contextSum = context.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
      value += (contextSum % 500) - 250;
    }
    
    // Character-specific multipliers for visual variety
    const specialChars: { [key: string]: number } = {
      // Vowels get higher energy
      'a': 1.5, 'e': 1.6, 'i': 1.4, 'o': 1.7, 'u': 1.3,
      'A': 2.0, 'E': 2.1, 'I': 1.9, 'O': 2.2, 'U': 1.8,
      
      // Numbers get geometric influence
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      
      // Symbols get chaos multipliers
      '!': 3.0, '@': 2.5, '#': 2.8, '$': 2.2, '%': 2.9, '^': 3.1, '&': 2.4, '*': 3.5,
      '(': 1.2, ')': 1.2, '-': 0.8, '_': 0.9, '=': 1.0, '+': 1.8,
      '[': 1.3, ']': 1.3, '{': 1.6, '}': 1.6, '|': 2.0, '\\': 1.4,
      ';': 1.1, ':': 1.5, "'": 0.7, '"': 1.4, ',': 0.6, '.': 0.5,
      '<': 1.7, '>': 1.7, '/': 1.3, '?': 2.3, '~': 2.6, '`': 0.8
    };
    
    if (specialChars[char] !== undefined) {
      value *= specialChars[char];
    }
    
    return Math.abs(value) % 10000; // Keep in reasonable range
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🎮 Initializing WebGL scene...');

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark gray instead of black
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 10000);
    camera.position.set(0, 0, 100);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x111111, 1);
    rendererRef.current = renderer;

    // Add a test cube to verify WebGL is working
    const testGeometry = new THREE.BoxGeometry(10, 10, 10);
    const testMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      wireframe: true 
    });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    scene.add(testCube);
    
    console.log('✅ Test cube added to scene');

    mountRef.current.appendChild(renderer.domElement);
    
    console.log('🚀 WebGL initialized, canvas size:', mountRef.current.clientWidth, 'x', mountRef.current.clientHeight);

    // Start animation immediately
    if (!isRunning) {
      console.log('🎬 Starting WebGL animation loop...');
      setIsRunning(true);
      
      const animateLoop = () => {
        if (!renderer || !scene || !camera) return;

        const time = Date.now() * 0.001;

        // Rotate test cube for debugging
        const testCube = scene.children.find(child => child.type === 'Mesh');
        if (testCube) {
          testCube.rotation.x += 0.01;
          testCube.rotation.y += 0.02;
        }

        // Camera gentle orbit
        camera.position.x = Math.sin(time * 0.1) * 5;
        camera.position.y = Math.cos(time * 0.1) * 5;
        camera.lookAt(0, 0, 0);

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
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Process data through the chain (3D version)
  const processDataThroughChain = (input: string | Float32Array): any => {
    let processedData = input;
    
    for (const node of processingChain) {
      if (!node.enabled) continue;
      
      switch (node.type) {
        case 'entropy':
          processedData = processEntropy3D(processedData as string, node.settings);
          break;
        case 'chaos-game':
          processedData = processChaosGame3D(processedData as string, node.settings);
          break;
        case 'gematria':
          processedData = processGematria3D(processedData as string, node.settings);
          break;
        case 'numerology':
          processedData = processNumerology3D(processedData as string, node.settings);
          break;
        case 'audio-analyzer':
          processedData = processAudioAnalysis3D(processedData as Float32Array, node.settings);
          break;
      }
    }
    
    return processedData;
  };

  // 3D Entropy Visualization - Particle clouds with character-driven motion
  const processEntropy3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    // Clear old entropy particles
    particleSystemsRef.current.forEach(system => {
      sceneRef.current?.remove(system);
    });
    particleSystemsRef.current = [];

    const chars = text.split('');
    const particleCount = Math.min(chars.length * 50, 5000);
    
    // Create geometry for particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const charIndex = Math.floor(i / 50);
      const char = chars[charIndex] || chars[chars.length - 1];
      const charValue = getCharacterValue(char, charIndex, text.substring(Math.max(0, charIndex - 2), charIndex + 3));
      
      // Position based on character value and entropy
      const entropy = (charValue % 100) / 100;
      const radius = 20 + entropy * 30;
      const phi = (charValue % 360) * (Math.PI / 180);
      const theta = ((charValue * 1.618) % 180) * (Math.PI / 180);
      
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);
      
      // Color based on character properties
      const hue = (charValue % 360) / 360;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size based on character importance
      sizes[i] = 1 + entropy * 3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Animate particles based on time
          mvPosition.x += sin(time + position.y * 0.01) * 2.0;
          mvPosition.y += cos(time + position.x * 0.01) * 2.0;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - (distance * 2.0);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particleSystemsRef.current.push(particles);
    shaderMaterialsRef.current.push(material);

    return text;
  };

  // 3D Chaos Game - Flying geometric attractors
  const processChaosGame3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    // Clear old chaos objects
    geometryObjectsRef.current.forEach(obj => {
      sceneRef.current?.remove(obj);
    });
    geometryObjectsRef.current = [];

    const chars = text.split('');
    const attractorCount = Math.min(chars.length, 20);

    for (let i = 0; i < attractorCount; i++) {
      const char = chars[i];
      const charValue = getCharacterValue(char, i, text);
      
      // Different geometries based on character type
      let geometry;
      if (/[aeiouAEIOU]/.test(char)) {
        geometry = new THREE.SphereGeometry(2 + (charValue % 5), 16, 16);
      } else if (/[0-9]/.test(char)) {
        geometry = new THREE.BoxGeometry(3, 3, 3);
      } else if (/[!@#$%^&*]/.test(char)) {
        geometry = new THREE.OctahedronGeometry(2 + (charValue % 4));
      } else {
        geometry = new THREE.TetrahedronGeometry(2 + (charValue % 3));
      }

      // Glowing material
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL((charValue % 360) / 360, 0.8, 0.6),
        transparent: true,
        opacity: 0.7
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Position in 3D space based on character value
      const radius = 30 + (charValue % 40);
      const angle = (charValue * 2.618) % (Math.PI * 2);
      const height = ((charValue % 200) - 100) * 0.3;
      
      mesh.position.set(
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle)
      );

      // Store character value for animation
      (mesh as any).charValue = charValue;
      (mesh as any).basePosition = mesh.position.clone();

      sceneRef.current.add(mesh);
      geometryObjectsRef.current.push(mesh);
    }

    return text;
  };

  // 3D Gematria - Sacred geometry formations
  const processGematria3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    const totalValue = text.split('').reduce((sum, char, index) => {
      return sum + getCharacterValue(char, index, text);
    }, 0);

    // Create sacred geometry based on total value
    const sides = 3 + (totalValue % 8); // 3-10 sides
    const geometry = new THREE.CylinderGeometry(0, 15, 20, sides);
    
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL((totalValue % 360) / 360, 0.9, 0.5),
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    const pyramid = new THREE.Mesh(geometry, material);
    pyramid.position.set(0, 0, 0);
    
    // Store for animation
    (pyramid as any).totalValue = totalValue;
    
    sceneRef.current.add(pyramid);
    geometryObjectsRef.current.push(pyramid);

    return text;
  };

  // 3D Numerology - Platonic solids dance
  const processNumerology3D = (text: string, settings: any) => {
    if (!sceneRef.current) return;

    const numbers = text.split('').map(char => getCharacterValue(char) % 10);
    
    numbers.forEach((num, index) => {
      let geometry;
      
      // Platonic solids for each number
      switch (num) {
        case 0: geometry = new THREE.SphereGeometry(2, 16, 16); break;
        case 1: geometry = new THREE.TetrahedronGeometry(2); break;
        case 2: geometry = new THREE.BoxGeometry(2, 2, 2); break;
        case 3: geometry = new THREE.OctahedronGeometry(2); break;
        case 4: geometry = new THREE.DodecahedronGeometry(2); break;
        case 5: geometry = new THREE.IcosahedronGeometry(2); break;
        default: geometry = new THREE.ConeGeometry(2, 4, num); break;
      }

      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(num / 10, 0.8, 0.6),
        transparent: true,
        opacity: 0.5
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Arrange in a spiral
      const angle = (index / numbers.length) * Math.PI * 2;
      const radius = 20 + index * 2;
      
      mesh.position.set(
        radius * Math.cos(angle),
        (index - numbers.length / 2) * 3,
        radius * Math.sin(angle)
      );

      sceneRef.current?.add(mesh);
      geometryObjectsRef.current.push(mesh);
    });

    return text;
  };

  // 3D Audio Analysis - Reactive frequency towers
  const processAudioAnalysis3D = (audioData: Float32Array, settings: any) => {
    if (!sceneRef.current || !audioData) return;

    // Create frequency towers
    const binCount = Math.min(audioData.length / 4, 64);
    
    for (let i = 0; i < binCount; i++) {
      const amplitude = audioData[i] || 0;
      const height = Math.max(1, amplitude * 50);
      
      const geometry = new THREE.BoxGeometry(2, height, 2);
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / binCount, 0.8, 0.6),
        transparent: true,
        opacity: 0.7
      });

      const tower = new THREE.Mesh(geometry, material);
      
      // Arrange in a circle
      const angle = (i / binCount) * Math.PI * 2;
      const radius = 30;
      
      tower.position.set(
        radius * Math.cos(angle),
        height / 2,
        radius * Math.sin(angle)
      );

      sceneRef.current.add(tower);
      geometryObjectsRef.current.push(tower);
    }

    return audioData;
  };

  // Animation loop
  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const time = Date.now() * 0.001;

    // Rotate test cube for debugging
    const testCube = sceneRef.current.children.find(child => child.type === 'Mesh');
    if (testCube) {
      testCube.rotation.x += 0.01;
      testCube.rotation.y += 0.02;
    }

    // Update shader uniforms
    shaderMaterialsRef.current.forEach(material => {
      if (material.uniforms.time) {
        material.uniforms.time.value = time;
      }
    });

    // Animate geometry objects
    geometryObjectsRef.current.forEach((obj, index) => {
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.02;
      
      // Chaos game objects orbit
      if ((obj as any).charValue) {
        const charValue = (obj as any).charValue;
        const basePos = (obj as any).basePosition;
        if (basePos) {
          obj.position.x = basePos.x + Math.sin(time + charValue * 0.01) * 5;
          obj.position.z = basePos.z + Math.cos(time + charValue * 0.01) * 5;
        }
      }
    });

    // Camera gentle orbit
    cameraRef.current.position.x = Math.sin(time * 0.1) * 5;
    cameraRef.current.position.y = Math.cos(time * 0.1) * 5;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationRef.current = requestAnimationFrame(animate);
  };

  // Start animation immediately when WebGL is ready
  useEffect(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current && !isRunning) {
      console.log('🎬 Starting WebGL animation loop...');
      setIsRunning(true);
      
      const animateLoop = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        const time = Date.now() * 0.001;

        // Rotate test cube for debugging
        const testCube = sceneRef.current.children.find(child => child.type === 'Mesh');
        if (testCube) {
          testCube.rotation.x += 0.01;
          testCube.rotation.y += 0.02;
        }

        // Update shader uniforms
        shaderMaterialsRef.current.forEach(material => {
          if (material.uniforms.time) {
            material.uniforms.time.value = time;
          }
        });

        // Animate geometry objects
        geometryObjectsRef.current.forEach((obj, index) => {
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.02;
          
          // Chaos game objects orbit
          if ((obj as any).charValue) {
            const charValue = (obj as any).charValue;
            const basePos = (obj as any).basePosition;
            if (basePos) {
              obj.position.x = basePos.x + Math.sin(time + charValue * 0.01) * 5;
              obj.position.z = basePos.z + Math.cos(time + charValue * 0.01) * 5;
            }
          }
        });

        // Camera gentle orbit
        cameraRef.current.position.x = Math.sin(time * 0.1) * 5;
        cameraRef.current.position.y = Math.cos(time * 0.1) * 5;
        cameraRef.current.lookAt(0, 0, 0);

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationRef.current = requestAnimationFrame(animateLoop);
      };
      
      animateLoop();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Process input when it changes
  useEffect(() => {
    if (textInput && processingChain.length > 0) {
      processDataThroughChain(textInput);
    }
  }, [textInput, processingChain]);

  useEffect(() => {
    if (audioData && processingChain.length > 0) {
      processDataThroughChain(audioData);
    }
  }, [audioData, processingChain]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
      style={{ minHeight: '100vh' }}
    />
  );
}
