"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate register
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <main className="relative w-full h-screen flex items-center justify-center overflow-hidden">

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
