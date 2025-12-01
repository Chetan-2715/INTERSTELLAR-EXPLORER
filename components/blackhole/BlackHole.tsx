import React, { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// --- ACCRETION DISK SHADER ---
const AccretionDiskMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorInner: new THREE.Color("#ffcc00"),
        uColorOuter: new THREE.Color("#ff0000"),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vViewPosition;
    
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      vViewPosition = cameraPosition;
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColorInner;
    uniform vec3 uColorOuter;
    
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vViewPosition;

    // Simplex noise function (simplified)
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
      // Polar coordinates
      vec2 centered = vUv * 2.0 - 1.0;
      float r = length(centered);
      float theta = atan(centered.y, centered.x);

      // Discard center and outer edges
      if (r < 0.3 || r > 1.0) discard;

      // Differential rotation
      float speed = 2.0 / (r * r); // Faster near center
      float angle = theta + uTime * speed;

      // Noise for gas structure
      float noiseVal = snoise(vec2(r * 10.0, angle * 3.0));
      float noiseVal2 = snoise(vec2(r * 20.0 - uTime, angle * 6.0));
      
      float intensity = 0.5 + 0.5 * noiseVal;
      intensity += 0.25 * noiseVal2;

      // Soft edges
      float alpha = smoothstep(0.3, 0.4, r) * (1.0 - smoothstep(0.9, 1.0, r));

      // Doppler Shift Approximation
      vec3 viewDir = normalize(vViewPosition - vWorldPos);
      
      // Tangent vector of rotation
      vec3 centerDir = normalize(vWorldPos);
      vec3 up = vec3(0.0, 1.0, 0.0);
      vec3 tangent = cross(up, centerDir); // Direction of rotation
      
      float doppler = dot(viewDir, tangent);
      
      // Color mixing based on Doppler
      vec3 baseColor = mix(uColorOuter, uColorInner, (1.0 - r) * 1.5);
      
      // Doppler shift effect
      float shift = doppler * 0.5; // Strength
      vec3 dopplerColor = baseColor * (1.0 + shift);
      
      // Blue shift for approaching
      if (shift > 0.0) {
        dopplerColor += vec3(0.0, 0.2, 0.5) * shift;
      } else {
        dopplerColor *= (1.0 + shift * 0.5); // Dimmer
        dopplerColor += vec3(0.2, 0.0, 0.0) * shift; // Redder
      }

      gl_FragColor = vec4(dopplerColor * intensity * 2.0, alpha * 0.8);
    }
  `
);

extend({ AccretionDiskMaterial });

// --- GLOW SHADER (Photon Sphere) ---
const GlowMaterial = shaderMaterial(
    {
        uColor: new THREE.Color("#22e7ff"),
        uViewVector: new THREE.Vector3(0, 0, 0),
        c: 1.0,
        p: 1.0,
    },
    // Vertex
    `
    varying float intensity;
    uniform vec3 uViewVector;
    uniform float c;
    uniform float p;
    void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * uViewVector);
        intensity = pow(c - dot(vNormal, vNormel), p);
        gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
    }
    `,
    // Fragment
    `
    uniform vec3 uColor;
    varying float intensity;
    void main() {
        vec3 glow = uColor * intensity;
        gl_FragColor = vec4(glow, 1.0);
    }
    `
);
extend({ GlowMaterial });


export const BlackHole = () => {
    const diskRef = useRef<any>(null);
    const glowRef = useRef<any>(null);

    useFrame((state) => {
        if (diskRef.current) {
            diskRef.current.uTime = state.clock.getElapsedTime();
        }
        if (glowRef.current) {
            glowRef.current.uViewVector = state.camera.position;
        }
    });

    return (
        <group>
            {/* Event Horizon (Black Sphere) */}
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Photon Sphere Glow */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[1, 64, 64]} />
                {/* @ts-ignore */}
                <glowMaterial
                    ref={glowRef}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    c={0.4}
                    p={5.0}
                    uColor={new THREE.Color("#22e7ff")}
                />
            </mesh>

            {/* Accretion Disk */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 4.5, 128]} />
                {/* @ts-ignore */}
                <accretionDiskMaterial
                    ref={diskRef}
                    transparent
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};
