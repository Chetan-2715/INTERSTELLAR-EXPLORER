"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [videoFinished, setVideoFinished] = useState(false);

  return (
    <>
      {/* Intro Video Wrapper */}
      <div
        className={`fixed inset-0 z-[100] bg-black flex items-center justify-center ${videoFinished ? 'video-fade-out' : ''}`}
      >
        <video
          src="/intro.mp4"
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={() => setVideoFinished(true)}
        />
      </div>

      {/* Main Landing Page */}
      <main
        className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center text-center ${videoFinished ? 'landing-fade-in' : 'opacity-0'}`}
      >

        {/* Glass Panel Container */}
        <div className="z-10 flex flex-col items-center gap-6 p-8 md:p-12 rounded-3xl glass-panel max-w-5xl mx-4 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">

          {/* Background Glow inside panel */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 neon-text tracking-wider pb-2">
              AI INTERSTELLAR
              <br />
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">EXPLORER</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-cyan-200 font-orbitron tracking-widest uppercase drop-shadow-md"
          >
            The Cosmos Awaits Your Command
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-lg md:text-xl text-gray-300 font-inter max-w-2xl leading-relaxed z-10"
          >
            Journey through the universe with advanced AI. Analyze celestial bodies,
            predict space weather, and master the stars with your personal AI assistant.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
            className="flex flex-col md:flex-row gap-6 mt-8 w-full justify-center z-10"
          >
            <Link href="/login">
              <Button className="w-full md:w-auto text-lg px-12 py-6 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] border border-cyan-400/30">
                ENTER HYPERDRIVE
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full md:w-auto text-lg px-12 py-6 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(112,0,255,0.3)]">
                JOIN MISSION
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Floating Elements */}
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] -z-10"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] -z-10"
        />
      </main>
    </>
  );
}
