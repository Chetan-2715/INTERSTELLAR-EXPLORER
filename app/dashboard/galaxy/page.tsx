"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Loader2, Download, RefreshCw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const GALAXY_TYPES = ["Spiral", "Barred Spiral", "Elliptical", "Irregular", "Dwarf", "Starburst", "Nebula-style"];
const COLORS = ["Blue", "Red", "Purple", "Multicolor", "Cosmic Dust", "Dark Matter Glow"];
const DENSITIES = ["Low", "Medium", "High"];
const STYLES = ["Realistic", "Artistic", "Hubble-style", "Sci-fi"];

export default function GalaxyGeneratorPage() {
    const [params, setParams] = useState({
        type: "Spiral",
        color: "Blue",
        density: "Medium",
        style: "Realistic"
    });
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setImage(null);

        try {
            const res = await fetch("/api/gemini/galaxy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            });

            const data = await res.json();

            if (res.ok && data.image) {
                setImage(data.image);
            } else {
                setError(data.error || "Failed to generate galaxy.");
            }
        } catch (err) {
            setError("Communication error with the core.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!image) return;
        const link = document.createElement("a");
        link.href = image;
        link.download = `galaxy-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">GALAXY GENERATOR</h1>
                <p className="text-blue-200">Generate procedural galaxies and nebulae using AI-driven spatial noise models and space aesthetics.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <Card className="p-6 space-y-6 border-blue-500/30 h-fit">
                    <div className="flex items-center gap-2 text-blue-400 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <h2 className="font-orbitron text-lg">PARAMETERS</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-blue-200 font-orbitron">GALAXY TYPE</label>
                            <div className="grid grid-cols-2 gap-2">
                                {GALAXY_TYPES.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setParams({ ...params, type })}
                                        className={`p-2 text-xs rounded-lg border transition-all text-left ${params.type === type
                                                ? "bg-blue-500/20 border-blue-400 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                : "bg-black/20 border-white/10 text-white/60 hover:bg-white/5"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-blue-200 font-orbitron">COLOR MOOD</label>
                            <select
                                value={params.color}
                                onChange={(e) => setParams({ ...params, color: e.target.value })}
                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                            >
                                {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-blue-200 font-orbitron">DENSITY</label>
                            <div className="flex gap-2">
                                {DENSITIES.map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setParams({ ...params, density: d })}
                                        className={`flex-1 p-2 text-xs rounded-lg border transition-all ${params.density === d
                                                ? "bg-blue-500/20 border-blue-400 text-white"
                                                : "bg-black/20 border-white/10 text-white/60"
                                            }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-blue-200 font-orbitron">STYLE</label>
                            <select
                                value={params.style}
                                onChange={(e) => setParams({ ...params, style: e.target.value })}
                                className="w-full bg-black/40 border border-white/20 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                            >
                                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-4 text-lg font-orbitron bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> GENERATING...
                            </span>
                        ) : (
                            "GENERATE GALAXY"
                        )}
                    </Button>
                </Card>

                {/* Output Display */}
                <div className="lg:col-span-2">
                    <Card className="h-full min-h-[500px] flex flex-col items-center justify-center p-4 border-blue-500/30 relative overflow-hidden bg-black/40">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                                <div className="relative w-24 h-24 mb-4">
                                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" />
                                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                                <span className="font-orbitron text-blue-400 animate-pulse">SIMULATING COSMIC STRUCTURES...</span>
                            </div>
                        )}

                        {image ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-full h-full flex flex-col items-center"
                            >
                                <img
                                    src={image}
                                    alt="Generated Galaxy"
                                    className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                                />
                                <div className="flex gap-4 mt-6">
                                    <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2 border-blue-500/50 hover:bg-blue-500/20">
                                        <Download className="w-4 h-4" /> DOWNLOAD
                                    </Button>
                                    <Button onClick={handleGenerate} variant="outline" className="flex items-center gap-2 border-purple-500/50 hover:bg-purple-500/20">
                                        <RefreshCw className="w-4 h-4" /> REGENERATE
                                    </Button>
                                </div>
                            </motion.div>
                        ) : error ? (
                            <div className="text-center space-y-4 max-w-md">
                                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
                                <h3 className="text-xl font-orbitron text-red-400">GENERATION FAILED</h3>
                                <p className="text-white/60">{error}</p>
                                <Button onClick={handleGenerate} variant="outline" className="mt-4">
                                    TRY AGAIN
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 opacity-50">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mx-auto flex items-center justify-center blur-xl animate-pulse-glow" />
                                <p className="font-orbitron text-blue-200">CONFIGURE PARAMETERS AND INITIATE GENERATION</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
