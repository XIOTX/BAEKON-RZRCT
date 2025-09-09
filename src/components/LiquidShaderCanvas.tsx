'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LiquidShaderCanvasProps {
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

export function LiquidShaderCanvas({ processingChain, audioData, textInput, inputAmplitude = 1.0 }: LiquidShaderCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const materialRef = useRef<THREE.ShaderMaterial>();
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);

  // Liquid shader uniforms
  const uniforms = useRef({
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_textLength: { value: 0.0 },
    u_entropy: { value: 0.0 },
    u_amplitude: { value: 1.0 }
  });

  // Vertex shader - simple fullscreen quad
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Fragment shader - animated liquid static effect
  const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_textLength;
    uniform float u_entropy;
    uniform float u_amplitude;
    varying vec2 vUv;

    // High-quality noise function
    float hash(vec2 p) {
      p = fract(p * vec2(443.8975, 397.2973));
      p += dot(p.xy, p.yx + 19.19);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i + vec2(0.0, 0.0));
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Multi-octave noise
    float fbm(vec2 p, float time) {
      float value = 0.0;
      float amplitude = 0.5;
      
      // Add time-based flow
      p += vec2(sin(time * 0.1), cos(time * 0.07)) * 0.3;
      
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p = p * 2.0 + vec2(sin(time * 0.01 * float(i)), cos(time * 0.013 * float(i)));
        amplitude *= 0.5;
      }
      return value;
    }

    // Turbulence function for more chaotic movement
    float turbulence(vec2 p, float time) {
      float t = 0.0;
      float f = 1.0;
      for (int i = 0; i < 4; i++) {
        t += abs(noise(p * f + time * 0.1)) / f;
        f *= 2.0;
      }
      return t;
    }

    void main() {
      vec2 uv = vUv;
      
      // Much faster time for visible animation
      float time = u_time * 5.0;
      
      // Large-scale flowing distortion
      vec2 flow = vec2(
        sin(time * 0.3 + uv.y * 8.0) * 0.3,
        cos(time * 0.4 + uv.x * 6.0) * 0.3
      );
      
      vec2 p = (uv + flow) * 6.0;
      
      // Multiple animated noise layers
      float n1 = fbm(p * 0.8, time * 0.8);
      float n2 = fbm(p * 1.5 + vec2(100.0), time * 1.2);
      float n3 = fbm(p * 2.5 + vec2(200.0), time * 0.6);
      float turb = turbulence(p * 0.5, time * 1.5);
      
      // Combine with strong animation
      float pattern = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;
      pattern += turb * 0.5;
      
      // Add dramatic wave motion
      float waves = sin(uv.x * 10.0 + time * 2.0) * cos(uv.y * 8.0 + time * 1.5) * 0.3;
      pattern += waves;
      
      // Create flowing liquid texture with animation
      float liquid = smoothstep(0.1, 0.9, pattern + sin(time) * 0.2);
      
      // Animated flowing veins
      float veins = smoothstep(0.7, 0.75, pattern + cos(time * 1.3) * 0.1) * 
                    smoothstep(0.85, 0.8, pattern + sin(time * 0.7) * 0.1);
      
      // High-frequency animated static
      float staticNoise = hash(uv * 800.0 + time * 20.0) * 0.2;
      staticNoise += hash(uv * 1500.0 + time * 30.0) * 0.1;
      
      // Dynamic color palette
      vec3 baseColor = vec3(0.02, 0.02, 0.05);
      vec3 liquidColor = vec3(0.1, 0.15, 0.3) * (1.0 + sin(time * 0.5) * 0.3);
      vec3 veinColor = vec3(0.3, 0.5, 0.8) * (1.0 + cos(time * 0.7) * 0.4);
      vec3 brightColor = vec3(0.7, 0.9, 1.0) * (1.0 + sin(time * 1.2) * 0.5);
      
      // Mix colors with animation
      vec3 color = mix(baseColor, liquidColor, liquid);
      color = mix(color, veinColor, veins);
      color += brightColor * veins * (0.5 + sin(time * 2.0) * 0.3);
      
      // Animated static overlay
      color += staticNoise * vec3(0.4, 0.5, 0.7) * (1.0 + cos(time * 3.0) * 0.5);
      
      // Text input effects with animation
      float textInfluence = clamp(u_textLength * 0.03, 0.0, 3.0);
      color *= (0.7 + textInfluence * 0.6);
      
      // Entropy adds animated chaos
      float entropyInfluence = clamp(u_entropy * 0.4, 0.0, 1.5);
      color += entropyInfluence * vec3(0.2, 0.4, 0.3) * sin(time * 2.0 + uv.x * 15.0);
      
      // Amplitude affects intensity with pulsing
      color *= (0.4 + u_amplitude * 1.0) * (0.8 + 0.2 * sin(time * 4.0));
      
      // Strong pulsing effect
      color *= (0.8 + 0.4 * sin(time * 6.0));
      
      // Enhanced contrast
      color = pow(color, vec3(0.7));
      color = clamp(color, 0.0, 1.0);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Calculate text metrics
  const calculateTextMetrics = (text: string) => {
    if (!text) return { length: 0, entropy: 0 };
    
    // Simple entropy calculation
    const chars = text.split('');
    const freq: { [key: string]: number } = {};
    chars.forEach(char => freq[char] = (freq[char] || 0) + 1);
    
    const entropy = Object.values(freq).reduce((sum, count) => {
      const p = count / chars.length;
      return sum - p * Math.log2(p);
    }, 0);
    
    return { length: text.length, entropy };
  };

  // Initialize WebGL
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🌊 Initializing Liquid Shader Canvas...');

    try {
      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Orthographic camera for fullscreen quad
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 600;
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Update resolution uniform
      uniforms.current.u_resolution.value.set(width, height);

      // Create shader material
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms.current,
        vertexShader,
        fragmentShader
      });
      materialRef.current = material;

      // Create fullscreen quad
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add to DOM
      mountRef.current.appendChild(renderer.domElement);
      
      console.log('✅ Liquid shader initialized');

    } catch (error) {
      console.error('❌ Liquid shader initialization failed:', error);
    }

    // Start animation loop
    if (!isRunning && rendererRef.current && sceneRef.current && cameraRef.current) {
      console.log('🌊 Starting liquid animation...');
      setIsRunning(true);
      
      const animate = () => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

        // Update time uniform
        uniforms.current.u_time.value = Date.now() * 0.001;
        
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
      console.log('✅ Liquid animation started');
    }

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      uniforms.current.u_resolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // Update shader uniforms when text changes
  useEffect(() => {
    if (!textInput) return;
    
    const metrics = calculateTextMetrics(textInput);
    
    uniforms.current.u_textLength.value = metrics.length;
    uniforms.current.u_entropy.value = metrics.entropy;
    uniforms.current.u_amplitude.value = inputAmplitude;
    
    console.log('🌊 Updated liquid uniforms:', metrics);
  }, [textInput, inputAmplitude]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
    />
  );
}

