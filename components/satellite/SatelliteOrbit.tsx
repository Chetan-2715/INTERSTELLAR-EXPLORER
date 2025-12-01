"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Satellite } from "./types";
import { getSatellitePosition } from "./utils";

interface SatelliteOrbitProps {
    satellite: Satellite;
    isSelected: boolean;
    onSelect: (sat: Satellite) => void;
}

export function SatelliteOrbit({ satellite, isSelected, onSelect }: SatelliteOrbitProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    // Calculate initial position
    const initialPos = useMemo(() => {
        const pos = getSatellitePosition(satellite, new Date());
        // Scale down for visualization: Earth radius ~6371km -> 1 unit
        // Position is in km, so divide by 6371
        return new THREE.Vector3(pos.x / 6371, pos.z / 6371, -pos.y / 6371);
        // Note: Three.js Y is up, ECI Z is usually "up" (North), so we swap/map accordingly.
        // Standard mapping: ECI X -> Three X, ECI Z -> Three Y, ECI Y -> Three Z (with sign check)
        // Let's try: X->X, Z->Y, Y->Z
    }, [satellite]);

    useFrame(() => {
        if (meshRef.current) {
            const pos = getSatellitePosition(satellite, new Date());
            // Update position in real-time
            meshRef.current.position.set(pos.x / 6371, pos.z / 6371, -pos.y / 6371);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={initialPos}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(satellite);
            }}
        >
            <sphereGeometry args={[isSelected ? 0.03 : 0.015, 8, 8]} />
            <meshBasicMaterial color={isSelected ? "#00ffff" : "#ffffff"} />
        </mesh>
    );
}
