"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { BlackHoleHelpPanel } from "@/components/BlackHoleHelpPanel";
import { BlackHoleHelpButton } from "@/components/BlackHoleHelpButton";
import BlackHoleScene from "@/components/blackhole/BlackHoleScene";
import { Sliders, RotateCw, Maximize, Activity } from "lucide-react";
import { useBlackHoleStore } from "@/components/blackhole/blackHoleStore";

export default function BlackHolePage() {
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    // Connect to store
    const {
        mass, spin, accretionRate,
        eventHorizon, photonSphere, timeDilation,
        setMass, setSpin, setAccretionRate
    } = useBlackHoleStore();

    return (
        <div className="space-y-6 relative min-h-screen pb-10">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">BLACK HOLE SIMULATOR</h1>
                <p className="text-blue-200">Explore gravitational lensing, accretion discs, and time dilation effects with an interactive black hole simulation.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[80vh]">
                {/* Left Panel: Controls & Info */}
                <Card className="lg:col-span-1 border-purple-500/30 flex flex-col gap-6 p-6 overflow-y-auto">
                    <div>
                        <h2 className="text-xl font-orbitron text-white mb-4 flex items-center gap-2">
                            <Sliders className="w-5 h-5 text-[#22e7ff]" />
                            PARAMETERS
                        </h2>
                        <div className="space-y-6">
                            {/* Mass Slider */}
                            <div className="space-y-2">
                                <label className="text-xs text-blue-300 uppercase tracking-wider flex justify-between">
                                    <span>Mass (Solar Masses)</span>
                                    <span className="text-white">{mass.toFixed(1)} M☉</span>
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="0.5"
                                    value={mass}
                                    onChange={(e) => setMass(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22e7ff]"
                                />
                                <div className="flex justify-between text-xs text-white/50">
                                    <span>5 M☉</span>
                                    <span>50 M☉</span>
                                </div>
                            </div>

                            {/* Spin Slider */}
                            <div className="space-y-2">
                                <label className="text-xs text-blue-300 uppercase tracking-wider flex justify-between">
                                    <span>Spin (Kerr Parameter)</span>
                                    <span className="text-white">{spin.toFixed(2)}c</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={spin}
                                    onChange={(e) => setSpin(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#bc6bff]"
                                />
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <div className="text-xs text-white/50 mb-1">Photon Sphere</div>
                                <div className="text-lg font-mono text-[#bc6bff]">{photonSphere.toFixed(2)} km</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5 col-span-2">
                                <div className="text-xs text-white/50 mb-1">Time Dilation (at 500km)</div>
                                <div className="text-lg font-mono text-white">{timeDilation.toFixed(3)}x Slower</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/10 text-xs text-white/40">
                        <p className="mb-2 flex items-center gap-2">
                            <RotateCw className="w-3 h-3" />
                            Left Click + Drag to Orbit
                        </p>
                        <p className="mb-2 flex items-center gap-2">
                            <Maximize className="w-3 h-3" />
                            Scroll to Zoom
                        </p>
                    </div>
                </Card>

                {/* Right Panel: Simulator */}
                <div className="lg:col-span-3 h-full">
                    <BlackHoleScene />
                </div>
            </div>

            {/* Help System */}
            <BlackHoleHelpButton onClick={() => setIsHelpOpen(true)} />
            <BlackHoleHelpPanel isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </div>
    );
}
