import React, { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#0a0a2a"), // Deep blue/black
    uColor2: new THREE.Color("#220033"), // Dark purple
    uColor3: new THREE.Color("#001133"), // Dark cyan/blue
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Scrolling noise
      float t = uTime * 0.05;
      float n1 = snoise(vUv * 3.0 + vec2(t, t * 0.5));
      float n2 = snoise(vUv * 6.0 - vec2(t * 0.2, t));
      
      float noise = n1 * 0.5 + n2 * 0.25 + 0.5;
      
      // Color mixing
      vec3 color = mix(uColor1, uColor2, n1 * 0.5 + 0.5);
      color = mix(color, uColor3, n2 * 0.5 + 0.5);
      
      // Add some stars/sparkles via noise threshold
      float stars = step(0.98, snoise(vUv * 50.0 + t));
      color += vec3(stars) * 0.5;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ NebulaMaterial });

export function NebulaBackground() {
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* @ts-ignore */}
      <nebulaMaterial ref={materialRef} side={THREE.BackSide} />
    </mesh>
  );
}
