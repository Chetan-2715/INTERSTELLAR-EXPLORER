"use client";

import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

export function Earth() {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    // Load textures (using placeholder URLs or local assets if available)
    // For now, we'll use a procedural material or standard colors if textures fail
    // In a real app, you'd download high-res earth textures to /public/textures/

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0007;
        }
    });

    return (
        <group>
            {/* Earth Sphere */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    color="#1a2b4b"
                    emissive="#000000"
                    specular="#111111"
                    shininess={10}
                    map={null} // Add texture map here
                />
            </mesh>

            {/* Atmosphere Glow */}
            <mesh scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#4b96f3"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Wireframe Grid for Sci-Fi Look */}
            <mesh scale={[1.001, 1.001, 1.001]}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial
                    color="#00ffff"
                    wireframe
                    transparent
                    opacity={0.05}
                />
            </mesh>
        </group>
    );
}
