"use client";

import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, Scan, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VisionPage() {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/gemini/vision", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok && data.result) {
                setResult(data.result);
            } else {
                console.error("Vision Error:", data);
                setResult(data.error || "Analysis failed. Try again.");
            }
        } catch (error) {
            console.error(error);
            setResult("Communication error with ship computer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">VISION CONTROL</h1>
                <p className="text-blue-200">Analyze celestial images for constellation detection, exoplanet signatures, debris identification, and more using AI vision models.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/20 relative overflow-hidden group">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {image ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={image}
                                alt="Preview"
                                className="max-h-[350px] rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] border border-cyan-500/50"
                            />
                            {loading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex flex-col items-center gap-4">
                                        <Scan className="w-16 h-16 text-cyan-400 animate-pulse" />
                                        <span className="font-orbitron text-cyan-400 animate-pulse">SCANNING...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-cyan-500/20 transition-colors">
                                <Upload className="w-10 h-10 text-white/50 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <p className="text-blue-200 font-orbitron">DROP IMAGE OR CLICK TO UPLOAD</p>
                        </div>
                    )}

                    <div className="absolute inset-0 cursor-pointer" onClick={() => !loading && fileInputRef.current?.click()} />
                </Card>

                <div className="space-y-6">
                    <Button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className="w-full text-lg py-6"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> PROCESSING
                            </span>
                        ) : (
                            "INITIATE ANALYSIS"
                        )}
                    </Button>

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <Card glow className="bg-black/40 border-cyan-500/30">
                                <h3 className="text-xl font-orbitron text-cyan-400 mb-4 flex items-center gap-2">
                                    <Scan className="w-5 h-5" /> ANALYSIS RESULT
                                </h3>

                                {result.includes(':') ? (
                                    <div className="space-y-6 text-left">
                                        {result.split('\n\n').map((section, idx) => {
                                            const [title, ...points] = section.split('\n');
                                            if (!title) return null;

                                            return (
                                                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <h3 className="text-cyan-400 font-orbitron font-bold mb-3 text-lg border-b border-cyan-500/20 pb-2">
                                                        {title.replace(':', '')}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {points.map((point, pIdx) => (
                                                            <li key={pIdx} className="text-blue-100 flex items-start gap-2 text-sm leading-relaxed">
                                                                <span className="text-cyan-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                                                <span>{point.replace(/^- /, '')}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-blue-100 leading-relaxed whitespace-pre-wrap">{result}</p>
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
