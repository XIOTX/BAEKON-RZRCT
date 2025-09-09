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
  
  // Zoom controls
  const [zoomLevel, setZoomLevel] = useState(80); // Default camera distance
  const minZoom = 20;  // Close zoom
  const maxZoom = 200; // Far zoom to catch everything

  // Get character position in 3D space (match camera frustum exactly)
  const getCharacterPosition = (char: string, index: number): THREE.Vector3 => {
    const seed = char.charCodeAt(0) + index * 1000;
    const random = (s: number) => Math.sin(s * 12.9898) * 43758.5453 % 1;
    
    if (!cameraRef.current || !mountRef.current) {
      // Fallback ranges - use conservative values
      console.warn('⚠️ Camera or mount not ready, using fallback positioning');
      return new THREE.Vector3(
        (random(seed) - 0.5) * 60,  // Smaller fallback range
        (random(seed + 1) - 0.5) * 40,
        (random(seed + 2) - 0.5) * 10
      );
    }
    
    // Calculate visible area at text depth (z=0) based on camera frustum
    const camera = cameraRef.current;
    const mount = mountRef.current;
    const textDepth = 0; // Text positioned at origin depth
    const distanceFromCamera = Math.abs(zoomLevel - textDepth); // Use current zoom level, not camera.position.z
    
    // Get actual canvas dimensions
    const canvasWidth = mount.clientWidth || 800;
    const canvasHeight = mount.clientHeight || 600;
    const actualAspect = canvasWidth / canvasHeight;
    
    // Calculate frustum dimensions at text depth
    const vFOV = camera.fov * Math.PI / 180; // Convert to radians
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distanceFromCamera;
    const visibleWidth = visibleHeight * actualAspect; // Use actual canvas aspect ratio
    
    // Use 100% of visible area - full canvas utilization
    const fullWidth = visibleWidth;
    const fullHeight = visibleHeight;
    
    console.log(`📐 Canvas: ${canvasWidth}x${canvasHeight} (${actualAspect.toFixed(2)}), Camera: ${camera.aspect.toFixed(2)}, Visible: ${visibleWidth.toFixed(1)}x${visibleHeight.toFixed(1)}, Using: FULL 100%`);
    
    const position = new THREE.Vector3(
      (random(seed) - 0.5) * fullWidth,      // Use full width
      (random(seed + 1) - 0.5) * fullHeight, // Use full height  
      (random(seed + 2) - 0.5) * 5           // Minimal depth variation for max visibility
    );
    
    console.log(`📍 Char "${char}" (${index}) at:`, position.x.toFixed(1), position.y.toFixed(1), position.z.toFixed(1));
    
    return position;
  };

  // Create 2D debug grid that matches text positioning area
  const createDebugGrid = () => {
    if (!sceneRef.current || !cameraRef.current || !mountRef.current) return;

    // Calculate the same visible area as text positioning
    const camera = cameraRef.current;
    const mount = mountRef.current;
    const textDepth = 0;
    const distanceFromCamera = Math.abs(zoomLevel - textDepth); // Use current zoom level
    
    const canvasWidth = mount.clientWidth || 800;
    const canvasHeight = mount.clientHeight || 600;
    const actualAspect = canvasWidth / canvasHeight;
    
    const vFOV = camera.fov * Math.PI / 180;
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distanceFromCamera;
    const visibleWidth = visibleHeight * actualAspect;
    
    // Use the same area as text for grid (slightly larger for reference)
    const size = Math.max(visibleWidth, visibleHeight) * 1.2;
    const divisions = 10; // Fewer lines so they don't interfere
    
    console.log(`📏 Grid sized to match text area: ${size.toFixed(1)} units (visible: ${visibleWidth.toFixed(1)}x${visibleHeight.toFixed(1)})`);
    
    const colorCenterLine = 0x444444;
    const colorGrid = 0x222222;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    const step = size / divisions;
    const halfSize = size / 2;

    // Vertical lines (parallel to Y axis)
    for (let i = 0; i <= divisions; i++) {
      const x = -halfSize + (i * step);
      positions.push(x, -halfSize, 0);  // Start point
      positions.push(x, halfSize, 0);   // End point
      
      // Color center lines differently
      const color = (i === divisions / 2) ? colorCenterLine : colorGrid;
      const r = (color >> 16) / 255;
      const g = ((color >> 8) & 0xff) / 255;
      const b = (color & 0xff) / 255;
      colors.push(r, g, b);
      colors.push(r, g, b);
    }

    // Horizontal lines (parallel to X axis)
    for (let i = 0; i <= divisions; i++) {
      const y = -halfSize + (i * step);
      positions.push(-halfSize, y, 0);  // Start point
      positions.push(halfSize, y, 0);   // End point
      
      const color = (i === divisions / 2) ? colorCenterLine : colorGrid;
      const r = (color >> 16) / 255;
      const g = ((color >> 8) & 0xff) / 255;
      const b = (color & 0xff) / 255;
      colors.push(r, g, b);
      colors.push(r, g, b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.5
    });
    
    // Add glow effect by creating a slightly thicker version
    const glowGeometry = geometry.clone();
    const glowMaterial = new THREE.LineBasicMaterial({
      color: 0x00C3FF, // Blue glow
      transparent: true,
      opacity: 0.2,
      linewidth: 2
    });
    
    const glowGrid = new THREE.LineSegments(glowGeometry, glowMaterial);
    sceneRef.current.add(glowGrid);

    const grid = new THREE.LineSegments(geometry, material);
    sceneRef.current.add(grid);
    
    console.log('✅ 2D debug grid created (XY plane)');
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

    console.log('📝 Creating 3D text for:', text, `(${text.length} chars)`);
    console.log('🎮 Scene exists:', !!sceneRef.current);
    console.log('📷 Camera exists:', !!cameraRef.current);
    console.log('🖥️ Renderer exists:', !!rendererRef.current);

    let visibleCount = 0;
    let skippedCount = 0;

    // Create 3D text for each character
    text.split('').forEach((char, index) => {
      if (char === ' ') {
        skippedCount++;
        console.log(`⏭️  Skipping space at index ${index}`);
        return; // Skip spaces
      }
      
      const position = getCharacterPosition(char, index);
      
      // Create textured plane for the character
      const geometry = new THREE.PlaneGeometry(3, 3); // Slightly smaller for better visibility
      const texture = createTextTexture(char);
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.05 // Lower threshold to show more characters
      });
      
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.copy(position);
      
      // Make text face camera
      textMesh.lookAt(cameraRef.current?.position || new THREE.Vector3(0, 0, 40));
      
      sceneRef.current.add(textMesh);
      objectsRef.current.push(textMesh);
      visibleCount++;
      
      console.log(`✅ Added character "${char}" (${index}) at position:`, position.x.toFixed(1), position.y.toFixed(1), position.z.toFixed(1));
    });

    // Check for potential occlusion patterns
    const positions = objectsRef.current.map(obj => obj.position);
    const overlaps = positions.filter((pos1, i) => 
      positions.some((pos2, j) => 
        i !== j && Math.abs(pos1.x - pos2.x) < 5 && Math.abs(pos1.y - pos2.y) < 5
      )
    );
    
    console.log(`📊 Text summary: ${visibleCount} visible, ${skippedCount} skipped, ${visibleCount + skippedCount} total`);
    console.log(`🔍 Potential overlaps: ${overlaps.length} characters within 5 units of each other`);
    
    if (overlaps.length > 0) {
      console.log('⚠️ Overlapping positions detected - characters might be occluding each other');
    }
  };

  // Initialize WebGL
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🎮 Initializing Simple WebGL Canvas...');
    console.log('Mount ref dimensions:', mountRef.current.clientWidth, 'x', mountRef.current.clientHeight);

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000); // Pure black
      sceneRef.current = scene;
      console.log('✅ Scene created');

      // Camera
      const width = mountRef.current.clientWidth || 800;
      const height = mountRef.current.clientHeight || 600;
      
      // Use wider field of view to see the full range
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, zoomLevel); // Use zoom level
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
      renderer.setClearColor(0x000000, 1); // Pure black
      rendererRef.current = renderer;
      console.log('✅ Renderer created');

      // No test cube - we'll show text instead
      console.log('✅ Scene ready for text');

      // Add debug grid (after camera is set up)
      createDebugGrid();
      console.log('✅ Debug grid created');

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

        // Update camera position with zoom level (no orbit for now to debug)
        cameraRef.current.position.set(0, 0, zoomLevel);
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

    // Zoom controls with mouse wheel (simpler approach)
    const handleWheel = (event: WheelEvent) => {
      console.log('🎡 Wheel event detected:', event.deltaY);
      
      // Always handle zoom when scrolling over canvas
      event.preventDefault();
      event.stopPropagation();
      
      const zoomSpeed = 5; // Back to faster zoom for visibility
      const deltaY = event.deltaY;
      
      console.log(`🎯 Current zoom before: ${zoomLevel}, deltaY: ${deltaY}`);
      
      const newZoom = deltaY > 0 
        ? Math.min(zoomLevel + zoomSpeed, maxZoom) // Zoom out (scroll down)
        : Math.max(zoomLevel - zoomSpeed, minZoom); // Zoom in (scroll up)
      
      console.log(`🔍 Setting zoom: ${zoomLevel} → ${newZoom} (${newZoom === minZoom ? 'MIN' : newZoom === maxZoom ? 'MAX' : 'MID'})`);
      
      // Update camera position immediately for smoother zoom
      if (cameraRef.current) {
        cameraRef.current.position.z = newZoom;
        console.log(`📷 Camera position updated to: ${newZoom}`);
      }
      
      setZoomLevel(newZoom);
    };

    window.addEventListener('resize', handleResize);
    
    // Add wheel listener to both canvas and window for testing
    if (mountRef.current) {
      console.log('🎡 Adding wheel event listener to canvas');
      mountRef.current.addEventListener('wheel', handleWheel, { passive: false });
      
      // Also add to window as backup
      window.addEventListener('wheel', (e) => {
        console.log('🌍 Window wheel event:', e.deltaY);
        if (e.target === mountRef.current || mountRef.current?.contains(e.target as Node)) {
          handleWheel(e);
        }
      }, { passive: false });
    } else {
      console.warn('⚠️ No mount ref for wheel event listener');
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      const currentMount = mountRef.current;
      if (currentMount) {
        currentMount.removeEventListener('wheel', handleWheel);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (currentMount && rendererRef.current?.domElement) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [zoomLevel]);

  // Update visuals when input OR zoom changes
  useEffect(() => {
    console.log('🔄 Text input or zoom changed:', textInput, 'zoom:', zoomLevel);
    if (textInput && textInput.trim()) {
      console.log('📝 Updating visuals for:', textInput, 'at zoom:', zoomLevel);
      displayText(textInput);
    } else {
      console.log('🧹 Clearing text (empty input)');
      displayText('');
    }
  }, [textInput, processingChain, inputAmplitude, zoomLevel]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
    />
  );
}
