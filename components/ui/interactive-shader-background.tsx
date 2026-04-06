"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

// ----------------------------------------------------
// WebGL Shaders
// ----------------------------------------------------

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  uniform float u_speed;
  uniform int u_colorMode;

  varying vec2 vUv;

  // Simple 2D noise generator for glass/grain effect
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Current normalized UV and screen-ratio corrected UV
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 st_aspect = st * aspect;
    vec2 mouse_aspect = u_mouse * aspect;
    
    float time = u_time * u_speed * 0.4;
    
    // Mouse Interaction: Cinematic fluid ripple
    float dist = distance(st_aspect, mouse_aspect);
    float rippleRadius = 1.6;
    float mouseEnv = smoothstep(rippleRadius, 0.0, dist); 
    // Ripple travels outward, fading nicely simulating water surface tension
    float ripple = sin(dist * 12.0 - time * 6.0) * 0.03 * mouseEnv;
    
    // Layered Depth Distortion (3 layers of smooth waves)
    vec2 uv = vUv;
    vec2 p = uv * 2.0 - 1.0;
    
    vec2 distLayer1 = vec2(
        sin(p.y * 3.0 + time) * 0.1,
        cos(p.x * 2.5 + time * 1.2) * 0.1
    );
    
    vec2 distLayer2 = vec2(
        cos(p.y * 5.0 - time * 0.8) * 0.05,
        sin(p.x * 4.0 - time * 0.6) * 0.05
    );
    
    vec2 distLayer3 = vec2(
        sin(p.y * 8.0 + time * 1.5) * 0.02,
        cos(p.x * 7.0 - time * 1.3) * 0.02
    );
    
    // Combined fluid distortion mapping
    vec2 fluidUV = vUv + (distLayer1 + distLayer2 + distLayer3) * u_intensity * 0.8 + ripple;
    
    // Initialize base colors with soft elegance
    vec3 color = vec3(0.0);
    
    // Cinematic color palettes using smooth gradient blending
    if (u_colorMode == 0) {
        // Soft Aurora / Multi-tone
        vec3 col1 = vec3(0.1, 0.05, 0.2); // deep plum background
        vec3 col2 = vec3(0.5, 0.1, 0.2);  // sunset dark pink
        vec3 col3 = vec3(0.1, 0.2, 0.4);  // ocean dark teal
        
        float mix1 = sin(fluidUV.x * 3.0 + time) * 0.5 + 0.5;
        float mix2 = cos(fluidUV.y * 2.0 - time * 0.8) * 0.5 + 0.5;
        
        color = mix(col1, mix(col2, col3, mix2), mix1);
        color *= 0.8; // dim down overall luminosity to feel premium
    } else if (u_colorMode == 1) {
        // Deep Purple Cinematic Edition (Matches ScriptCraft Dark Theme)
        vec3 basePurple = vec3(0.02, 0.0, 0.05); // almost black-purple abyss
        vec3 midPurple = vec3(0.15, 0.0, 0.2);    // royal purple crests
        vec3 lightCrimson = vec3(0.3, 0.02, 0.05); // subtle red bleed 
        
        float waveMix = smoothstep(0.0, 1.0, sin(fluidUV.x * 4.0 - fluidUV.y * 3.0 + time));
        float highlightMix = smoothstep(0.0, 1.0, cos(fluidUV.x * 2.0 + fluidUV.y * 5.0 - time * 1.2));
        
        color = mix(basePurple, midPurple, waveMix);
        color = mix(color, lightCrimson, highlightMix * 0.6);
    } else {
        // Elegant Midnight Blue
        vec3 darkBlue = vec3(0.0, 0.01, 0.04);
        vec3 midBlue = vec3(0.02, 0.08, 0.2);
        vec3 softCyan = vec3(0.05, 0.15, 0.25);
        
        float w1 = smoothstep(0.0, 1.0, sin(fluidUV.y * 5.0 + time));
        float w2 = smoothstep(0.0, 1.0, cos(fluidUV.x * 3.0 - time * 0.5));
        
        color = mix(darkBlue, midBlue, w1);
        color = mix(color, softCyan, w2 * 0.6);
    }
    
    // Soft ambient glow tracking the mouse (like light beneath frosted glass)
    float mouseGlow = exp(-dist * 2.5) * 0.2;
    color += vec3(mouseGlow);
    
    // Premium dithering & grain for realism (eliminates banding)
    float grain = (random(st + time) - 0.5) * 0.05;
    color += grain;
    
    // Gentle vignette to focus the center
    float vignette = 1.0 - smoothstep(0.3, 1.5, length(p));
    color *= mix(0.5, 1.0, vignette);

    // Final smooth step to eliminate any peaking
    color = smoothstep(0.0, 1.0, color);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ----------------------------------------------------
// React Component
// ----------------------------------------------------

export interface InteractiveShaderBackgroundProps {
  speed?: number;
  intensity?: number;
  colorMode?: "rainbow" | "purple" | "blue";
  className?: string;
}

export function InteractiveShaderBackground({
  speed = 1.0,
  intensity = 1.0,
  colorMode = "purple", // Default premium dark-theme match
}: InteractiveShaderBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep track of Three.js instances to avoid memory leaks
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafIdRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // Normalize colorMode to uniform integer
  const colorModeMap = {
    rainbow: 0,
    purple: 1,
    blue: 2
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup (Orthographic is best for fullscreen 2D shaders)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize performance
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Fullscreen Plane & Shader Material
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, // Default center
      u_intensity: { value: intensity },
      u_speed: { value: speed },
      u_colorMode: { value: colorModeMap[colorMode] ?? 1 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 5. Mouse Interaction Tracking
    let targetMouse = new THREE.Vector2(0.5, 0.5);
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse to 0.0 -> 1.0 (GLSL coordinates, y is flipped)
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 6. Resize Handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (materialRef.current) {
        materialRef.current.uniforms.u_resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    };
    window.addEventListener("resize", handleResize);

    // 7. Render Loop (requestAnimationFrame)
    clockRef.current.start();
    
    const animate = () => {
      if (!materialRef.current) return;
      
      const elapsedTime = clockRef.current.getElapsedTime();
      
      // Smoothly interpolate current mouse uniform towards actual target mouse
      const currentMouse = materialRef.current.uniforms.u_mouse.value;
      currentMouse.lerp(targetMouse, 0.05); // Lerp for softer trailing interaction
      
      materialRef.current.uniforms.u_time.value = elapsedTime;
      
      renderer.render(scene, camera);
      rafIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // 8. Cleanup WebGL Context on Unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafIdRef.current);
      
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []); // Run setup once on mount

  // Reactively respond to prop changes dynamically
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_intensity.value = intensity;
      materialRef.current.uniforms.u_speed.value = speed;
      materialRef.current.uniforms.u_colorMode.value = colorModeMap[colorMode] ?? 1;
    }
  }, [intensity, speed, colorMode]);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" 
    />
  );
}
