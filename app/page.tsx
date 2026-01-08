"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Hyperspeed from "@/components/Hyperspeed/Hyperspeed";

const SplineScene = dynamic(() => import('@/components/SplineScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-white/20">Loading 3D Experience...</div>
});

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
    shoulderLines: 0x00f0ff, // Cyan
    brokenLines: 0x00f0ff,   // Cyan
    leftCars: [0xff0055, 0x8000ff, 0xff0055], // Hot Pink & Purple
    rightCars: [0x00f0ff, 0x0055ff, 0xffffff], // Cyan & Blue
    sticks: 0x00f0ff
  }
};

export default function Home() {
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const router = useRouter();

  const handleLaunch = (path: string) => {
    setIsLaunching(true);
    setTimeout(() => {
      router.push(path);
    }, 1000); // 1 second of hyperspeed
  };

  return (
    <>
      <AnimatePresence>
        {isLaunching && (
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

        {/* 3D Background - Spline Scene */}
        <div className="absolute inset-0 z-0 mix-blend-screen">
          <SplineScene />
        </div>

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
            <Button
              onClick={() => handleLaunch('/login')}
              className="w-full md:w-auto text-lg px-12 py-6 shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] border border-cyan-400/30"
            >
              ENTER HYPERDRIVE 🚀
            </Button>
            <Button
              variant="outline"
              onClick={() => handleLaunch('/register')}
              className="w-full md:w-auto text-lg px-12 py-6 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(112,0,255,0.3)]"
            >
              JOIN MISSION 🚀
            </Button>
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
