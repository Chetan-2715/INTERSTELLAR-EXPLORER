"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
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
                <h2 className="text-4xl font-orbitron font-bold text-center mb-8 text-cyan-400 neon-text">
                    IDENTIFY YOURSELF
                </h2>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <label className="text-blue-200 font-orbitron text-sm">COSMIC ID (EMAIL)</label>
                        <input
                            type="email"
                            className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
                            placeholder="pilot@cosmos.ai"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-blue-200 font-orbitron text-sm">ACCESS CODE (PASSWORD)</label>
                        <input
                            type="password"
                            className="w-full bg-black/50 border border-cyan-500/30 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={loading}>
                        {loading ? "AUTHENTICATING..." : "INITIATE LAUNCH"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-blue-300 text-sm">
                        New to the fleet?{" "}
                        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 underline">
                            Enlist Here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
