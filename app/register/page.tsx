"use client";

import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Hyperspeed from "@/components/Hyperspeed/Hyperspeed";

const hyperspeedOptions = {
    onSpeedUp: () => { },
    onSlowDown: () => { },
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0x00f0ff,
        brokenLines: 0x00f0ff,
        leftCars: [0xff0055, 0x8000ff, 0xff0055],
        rightCars: [0x00f0ff, 0x0055ff, 0xffffff],
        sticks: 0x00f0ff
    }
};

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate register
        setTimeout(() => {
            router.push("/dashboard");
        }, 2500);
    };

    return (
        <main className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black"
                    >
                        {/* @ts-ignore */}
                        <Hyperspeed effectOptions={hyperspeedOptions} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md p-8 glass-panel rounded-2xl"
            >
                <h2 className="text-4xl font-orbitron font-bold text-center mb-8 text-purple-400 neon-text">
                    JOIN THE FLEET
                </h2>

                <form onSubmit={handleRegister} className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-blue-200 font-orbitron text-sm">PILOT NAME</label>
                        <input
                            type="text"
                            className="w-full bg-black/50 border border-purple-500/30 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all"
                            placeholder="Commander Shepard"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-blue-200 font-orbitron text-sm">COSMIC ID (EMAIL)</label>
                        <input
                            type="email"
                            className="w-full bg-black/50 border border-purple-500/30 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all"
                            placeholder="pilot@cosmos.ai"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-blue-200 font-orbitron text-sm">ACCESS CODE (PASSWORD)</label>
                        <input
                            type="password"
                            className="w-full bg-black/50 border border-purple-500/30 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none focus:shadow-[0_0_10px_rgba(112,0,255,0.3)] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" variant="secondary" className="w-full mt-4" disabled={loading}>
                        {loading ? "REGISTERING..." : "CONFIRM ENLISTMENT"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-blue-300 text-sm">
                        Already enlisted?{" "}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 underline">
                            Identify Yourself
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
