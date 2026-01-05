"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Earth() {
    const earthRef = useRef<THREE.Mesh>(null);
    const atmosRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) {
            earthRef.current.rotation.y = t * 0.05;
        }
        if (atmosRef.current) {
            atmosRef.current.rotation.y = t * 0.07;
        }
    });

    return (
        <group>
            {/* Base Core (Dark Ocean) */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    color="#001133"
                    emissive="#000000"
                    specular="#0044ff"
                    shininess={40}
                />
            </mesh>

            {/* Sci-Fi Grid Overlay */}
            <mesh scale={[1.005, 1.005, 1.005]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#0088ff"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Atmosphere Glow */}
            <mesh ref={atmosRef} scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#00aaff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Equator Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.005, 16, 100]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
            </mesh>
        </group>
    );
}