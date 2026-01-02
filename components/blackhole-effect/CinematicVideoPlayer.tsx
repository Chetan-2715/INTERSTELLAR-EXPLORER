"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, X, Maximize, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicVideoPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePlay = () => {
        setError(null);
        if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        }
        setIsPlaying(true);
    };

    const handleClose = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        setIsPlaying(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsPlaying(false);
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">

            {/* Main Placeholder UI */}
            <div className="text-center space-y-8 p-8 max-w-2xl bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="space-y-4">
                    <h2 className="text-3xl font-orbitron font-bold text-white">
                        CINEMATIC BLACK HOLE
                    </h2>
                    <p className="text-blue-200 text-lg">
                        🚀 Video is still being generated…<br />
                        Once the cinematic black hole effect is ready, it will appear here.
                    </p>
                </div>

                <button
                    onClick={handlePlay}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-orbitron font-bold text-white text-lg shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 hover:shadow-[0_0_50px_rgba(124,58,237,0.8)] transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                    <Play className="w-6 h-6 fill-white" />
                    PLAY CINEMATIC VIDEO (Fullscreen)
                </button>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg text-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </div>

            {/* Fullscreen Video Container */}
            <div
                ref={containerRef}
                className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${isPlaying ? 'visible' : 'invisible pointer-events-none'}`}
            >
                <AnimatePresence>
                    {isPlaying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                        >
                            <video
                                ref={videoRef}
                                src="/videos/blackhole.mp4"
                                className="w-full h-full object-cover"
                                autoPlay
                                muted={false}
                                controls
                                onError={() => {
                                    setError("Video is not available yet.");
                                    handleClose();
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>

                            <button
                                onClick={handleClose}
                                className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-50 group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
