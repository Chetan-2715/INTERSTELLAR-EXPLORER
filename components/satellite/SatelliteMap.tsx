"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Earth } from "./Earth";
import { SatelliteOrbit } from "./SatelliteOrbit";
import { SatelliteHelpPanel } from "./SatelliteHelpPanel";
import { fetchSatellites } from "./utils";
import { Satellite } from "./types";
import { Card } from "@/components/ui/Card";
import { Loader2, Globe, Info, Filter } from "lucide-react";

const CATEGORIES = ["STARLINK", "GPS", "ISS", "WEATHER"];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    STARLINK: "Starlink – private broadband satellite constellation orbiting Earth to provide global internet coverage.",
    GPS: "GPS – Global Positioning System satellites used for navigation and timing.",
    ISS: "ISS – International Space Station, crewed research platform in low Earth orbit.",
    WEATHER: "Weather – meteorological satellites used to monitor clouds, storms, climate, and environmental conditions."
};

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
            setError(null);
            try {
                const data = await fetchSatellites(selectedCategory);
                if (mounted) {
                    if (data.length === 0) {
                        setError("Unable to load live satellite data right now. Please try again later.");
                    } else {
                        setSatellites(data);
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError("Unable to load live satellite data right now. Please try again later.");
                    setLoading(false);
                }
            }
        };

        loadSatellites();

        return () => { mounted = false; };
    }, [selectedCategory]);

    return (
        <div className="relative w-full h-[800px] rounded-xl overflow-hidden border border-blue-500/30 bg-black/40">
            {/* 3D Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    <Suspense fallback={null}>
                        <Earth />
                        {satellites.map((sat) => (
                            <SatelliteOrbit
                                key={`${sat.name}-${sat.id}`}
                                satellite={sat}
                                isSelected={selectedSat?.name === sat.name}
                                onSelect={setSelectedSat}
                            />
                        ))}
                    </Suspense>

                    <OrbitControls
                        enablePan={false}
                        minDistance={1.5}
                        maxDistance={10}
                        autoRotate={!selectedSat}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* UI Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none p-6 flex flex-col justify-between">
                {/* Header & Filters */}
                <div className="flex flex-col gap-4 pointer-events-auto">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                                <Globe className="w-6 h-6 text-blue-400" />
                                ORBITAL TRACKER
                            </h2>
                            <div className="flex gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setSelectedSat(null);
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-orbitron transition-all ${selectedCategory === cat
                                            ? "bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                            : "bg-black/50 text-blue-200 border border-blue-500/30 hover:bg-blue-500/20"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsHelpOpen(true)}
                            className="p-2 rounded-full bg-black/50 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Category Description Bar */}
                    <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 backdrop-blur-sm max-w-xl">
                        <p className="text-blue-200 text-xs leading-relaxed">
                            <span className="text-blue-400 font-bold mr-2">INFO:</span>
                            {CATEGORY_DESCRIPTIONS[selectedCategory]}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                            <span className="font-orbitron text-blue-200 text-sm">ACQUIRING TELEMETRY...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-red-900/80 border border-red-500/50 p-4 rounded-xl backdrop-blur-md max-w-md text-center">
                            <p className="text-red-200 font-orbitron mb-2">CONNECTION ERROR</p>
                            <p className="text-white/70 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Selected Satellite Info */}
                {selectedSat && (
                    <div className="pointer-events-auto self-end">
                        <Card className="w-80 p-5 bg-black/90 backdrop-blur-xl border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-orbitron text-lg font-bold text-white truncate flex-1 mr-2">{selectedSat.name}</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">ACTIVE</span>
                            </div>

                            <div className="space-y-3 text-xs font-mono">
                                {/* Primary ID */}
                                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
                                    <div>
                                        <span className="text-blue-400 block text-[10px] mb-0.5">NORAD ID</span>
                                        <span className="text-white text-sm">{selectedSat.noradId || selectedSat.satrec.satnum}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-400 block text-[10px] mb-0.5">INT'L DES</span>
                                        <span className="text-white text-sm">{selectedSat.intlDes || "Unknown"}</span>
                                    </div>
                                </div>

                                {/* Origin & Operator */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-blue-400 block text-[10px] mb-0.5">ORIGIN</span>
                                        <span className="text-blue-100">{selectedSat.country || "Unknown"}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-400 block text-[10px] mb-0.5">TYPE</span>
                                        <span className="text-blue-100">{selectedSat.objectType || "PAYLOAD"}</span>
                                    </div>
                                </div>

                                {/* Launch Details */}
                                <div>
                                    <span className="text-blue-400 block text-[10px] mb-0.5">LAUNCH DATE</span>
                                    <span className="text-blue-100">{selectedSat.launchDate || selectedSat.launchYear || "Unknown"}</span>
                                </div>
                                <div>
                                    <span className="text-blue-400 block text-[10px] mb-0.5">LAUNCH SITE</span>
                                    <span className="text-blue-100 truncate block" title={selectedSat.site}>{selectedSat.site || "Unknown"}</span>
                                </div>

                                {/* Orbital Info */}
                                <div className="pt-2 border-t border-white/10">
                                    <div className="flex justify-between text-[10px] text-blue-300/60 mb-1">
                                        <span>PROPAGATION MODEL</span>
                                        <span>SGP4</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-blue-300/60">
                                        <span>EPOCH</span>
                                        <span>{selectedSat.satrec.epochyr}/{selectedSat.satrec.epochdays.toFixed(3)}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Help Panel */}
            <SatelliteHelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
}
