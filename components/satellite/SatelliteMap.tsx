"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Earth } from "./Earth";
import { fetchSatellites, getSatellitePosition } from "./utils";
import { Satellite } from "./types";
import { Card } from "@/components/ui/Card";
import { Loader2, Globe, Info, Filter, MousePointer2 } from "lucide-react";
import { SatelliteHelpPanel } from "./SatelliteHelpPanel";

const CATEGORIES = ["STARLINK", "GPS", "ISS", "WEATHER"];
const EARTH_RADIUS_KM = 6371; // Real Earth Radius

// -----------------------------------------------------------------------------
// 1. HIGH-PERFORMANCE SWARM COMPONENT
// -----------------------------------------------------------------------------
function SatelliteSwarm({
    satellites,
    onSelect
}: {
    satellites: Satellite[];
    onSelect: (sat: Satellite | null) => void
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const hoverRef = useRef<THREE.Mesh>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // Optimized memory reuse
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = useMemo(() => new THREE.Color(), []);

    useFrame(() => {
        const mesh = meshRef.current;
        if (!mesh || satellites.length === 0) return;

        const now = new Date();

        satellites.forEach((sat, i) => {
            // A. Get Physics Position (km)
            const { x, y, z } = getSatellitePosition(sat, now);

            // B. Scale down to 3D Scene (Earth Radius = 1)
            // We divide the real km coordinates by Earth's radius
            dummy.position.set(
                x / EARTH_RADIUS_KM,
                y / EARTH_RADIUS_KM,
                z / EARTH_RADIUS_KM
            );

            // C. Visuals
            dummy.scale.setScalar(0.015); // Dot size
            dummy.lookAt(0, 0, 0); // Face Earth center
            dummy.updateMatrix();

            // Apply to Instance
            mesh.setMatrixAt(i, dummy.matrix);

            // D. Color Coding
            if (i === hoveredId) color.set("#ffffff"); // Hover = White
            else if (sat.category === "STARLINK") color.set("#00ffff"); // Cyan
            else if (sat.category === "GPS") color.set("#ffcc00");      // Gold
            else if (sat.category === "ISS") color.set("#ff0055");      // Red/Pink
            else color.set("#00ff88");                                  // Green

            mesh.setColorAt(i, color);
        });

        // E. Important: Notify GPU of updates
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        // F. Update Hover Ring Position
        if (hoveredId !== null && hoverRef.current) {
            const matrix = new THREE.Matrix4();
            mesh.getMatrixAt(hoveredId, matrix);
            const pos = new THREE.Vector3().setFromMatrixPosition(matrix);
            hoverRef.current.position.copy(pos);
            hoverRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <>
            <instancedMesh
                ref={meshRef}
                args={[undefined, undefined, satellites.length]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (e.instanceId !== undefined && satellites[e.instanceId]) {
                        onSelect(satellites[e.instanceId]);
                    }
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredId(e.instanceId ?? null);
                    document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                    setHoveredId(null);
                    document.body.style.cursor = "auto";
                }}
            >
                {/* Low-poly sphere for performance */}
                <sphereGeometry args={[1, 6, 6]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>

            {/* Selection/Hover Highlight Ring */}
            {hoveredId !== null && (
                <mesh ref={hoverRef}>
                    <ringGeometry args={[0.015, 0.02, 32]} />
                    <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.8} />
                </mesh>
            )}
        </>
    );
}

// -----------------------------------------------------------------------------
// 2. MAIN MAP PAGE
// -----------------------------------------------------------------------------
export default function SatelliteMap() {
    const [satellites, setSatellites] = useState<Satellite[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("STARLINK");
    const [selectedSat, setSelectedSat] = useState<Satellite | null>(null);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const loadSatellites = async () => {
            setLoading(true);
            setSatellites([]);
            setError(null);
            try {
                const data = await fetchSatellites(selectedCategory);
                if (mounted) {
                    if (data.length === 0) setError("No signal received from ground control.");
                    else setSatellites(data);
                }
            } catch (err) {
                if (mounted) setError("Uplink Connection Failed.");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        loadSatellites();
        return () => { mounted = false; };
    }, [selectedCategory]);

    return (
        <div className="relative w-full h-[800px] rounded-xl overflow-hidden border border-cyan-500/30 bg-black/80 shadow-2xl">
            {/* 3D Viewport */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 2, 3.5], fov: 45 }} dpr={[1, 2]}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[10, 5, 5]} intensity={1.5} color="#4488ff" />
                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

                    <Earth />

                    {!loading && satellites.length > 0 && (
                        <SatelliteSwarm satellites={satellites} onSelect={setSelectedSat} />
                    )}

                    <OrbitControls
                        makeDefault
                        minDistance={1.5}
                        maxDistance={8}
                        enablePan={false}
                        autoRotate={!selectedSat}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                <div className="flex flex-col gap-4 pointer-events-auto">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                                <Globe className="w-8 h-8 text-cyan-400" />
                                ORBITAL TRACKER
                            </h2>
                            <div className="flex gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { setSelectedCategory(cat); setSelectedSat(null); }}
                                        className={`px-4 py-1.5 rounded-full text-xs font-orbitron tracking-wider transition-all border ${selectedCategory === cat
                                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                            : "bg-black/40 border-white/10 text-white/50 hover:bg-white/10"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="p-2.5 rounded-full bg-black/40 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all cursor-pointer"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                            <span className="font-orbitron text-cyan-300 tracking-widest animate-pulse">ACQUIRING SIGNAL...</span>
                        </div>
                    </div>
                )}

                {selectedSat && (
                    <div className="pointer-events-auto self-end w-full max-w-sm">
                        <Card glow className="bg-black/80 backdrop-blur-xl border-cyan-500/40">
                            <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                                <div>
                                    <h3 className="font-orbitron text-xl font-bold text-cyan-300 truncate w-60">{selectedSat.name}</h3>
                                    <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest mt-1">OBJECT ID: {selectedSat.noradId}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-green-400 font-bold">● ONLINE</span>
                                    <span className="text-[10px] text-white/40">{selectedSat.country || "UNKNOWN ORIGIN"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-mono text-blue-100/80">
                                <div>
                                    <span className="block text-cyan-500/50 mb-1">ALTITUDE</span>
                                    {/* Calculated dynamically roughly for display */}
                                    <span className="text-white text-sm">~{Math.round(getSatellitePosition(selectedSat).height || 0)} km</span>
                                </div>
                                <div>
                                    <span className="block text-cyan-500/50 mb-1">VELOCITY</span>
                                    <span className="text-white text-sm">~7.6 km/s</span>
                                </div>
                                <div>
                                    <span className="block text-cyan-500/50 mb-1">LAUNCH YEAR</span>
                                    <span className="text-white">{selectedSat.launchYear || "Unknown"}</span>
                                </div>
                                <div>
                                    <span className="block text-cyan-500/50 mb-1">TYPE</span>
                                    <span className="text-white">{selectedSat.objectType || "PAYLOAD"}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <SatelliteHelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
}