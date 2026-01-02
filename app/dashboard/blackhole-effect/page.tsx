"use client";

import React from "react";
import CinematicVideoPlayer from "@/components/blackhole-effect/CinematicVideoPlayer";

export default function BlackHoleEffectPage() {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black z-0" />

            <div className="relative z-10 w-full h-screen flex flex-col">
                <header className="p-8">
                    <h1 className="text-4xl font-orbitron font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        BLACK HOLE EFFECT
                    </h1>
                    <p className="text-blue-200/60 font-mono text-sm">
                        VISUALIZATION MODULE // CINEMATIC RENDER
                    </p>
                </header>

                <main className="flex-1 flex items-center justify-center">
                    <CinematicVideoPlayer />
                </main>
            </div>
        </div>
    );
}
