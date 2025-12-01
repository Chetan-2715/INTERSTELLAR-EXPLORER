"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Activity, Wind, Sun, Zap } from "lucide-react";
import { WeatherHelpButton } from "@/components/WeatherHelpButton";
import { WeatherHelpPanel } from "@/components/WeatherHelpPanel";
import { KpGraph } from "@/components/weather/KpGraph";
import { MagneticFieldGraph } from "@/components/weather/MagneticFieldGraph";
import { SolarFlareGraph } from "@/components/weather/SolarFlareGraph";

interface WeatherData {
    kpIndex: string;
    solarWind: {
        bt: string;
        bz: string;
    };
    solarFlare: {
        flux: number;
        class: string;
    };
}

interface GraphPoint {
    time: number;
    kp: number;
    bt: number;
    bz: number;
    flux: number;
}

export default function WeatherPage() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [kpHistory, setKpHistory] = useState<{ time: number, kp: number }[]>([]);
    const [magHistory, setMagHistory] = useState<{ time: number, bt: number, bz: number }[]>([]);
    const [flareHistory, setFlareHistory] = useState<{ time: number, flux: number }[]>([]);

    const [loading, setLoading] = useState(true);
    const [showHelp, setShowHelp] = useState(false);

    // Fetch 24h History
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const res = await fetch('/api/weather/history');
                const json = await res.json();

                if (json.kp) {
                    setKpHistory(json.kp.map((d: any) => ({
                        time: new Date(d.time).getTime(),
                        kp: d.kp
                    })));
                }
                if (json.mag) {
                    setMagHistory(json.mag.map((d: any) => ({
                        time: new Date(d.time).getTime(),
                        bt: d.bt,
                        bz: d.bz
                    })));
                }
                if (json.flare) {
                    setFlareHistory(json.flare.map((d: any) => ({
                        time: new Date(d.time).getTime(),
                        flux: d.flux
                    })));
                }
            } catch (e) {
                console.error("Failed to load history:", e);
            }
        };
        loadHistory();
    }, []);

    const fetchData = async () => {
        try {
            // Add timestamp to prevent caching
            const res = await fetch(`/api/weather?t=${Date.now()}`);
            const json = await res.json();
            if (!json.error) {
                setData(json);

                const now = Date.now();

                // Update Kp History
                setKpHistory(prev => {
                    const newPoint = { time: now, kp: Number(json.kpIndex) };
                    // Append to end, keep sorted
                    const newHist = [...prev, newPoint].sort((a, b) => a.time - b.time);
                    // Keep last 24h (approx 86400000ms)
                    return newHist.filter(p => p.time > now - 86400000);
                });

                // Update Mag History
                setMagHistory(prev => {
                    const newPoint = { time: now, bt: Number(json.solarWind.bt), bz: Number(json.solarWind.bz) };
                    const newHist = [...prev, newPoint].sort((a, b) => a.time - b.time);
                    return newHist.filter(p => p.time > now - 86400000);
                });

                // Update Flare History
                setFlareHistory(prev => {
                    const newPoint = { time: now, flux: Number(json.solarFlare.flux) };
                    const newHist = [...prev, newPoint].sort((a, b) => a.time - b.time);
                    return newHist.filter(p => p.time > now - 86400000);
                });

            } else {
                console.error("Weather data error:", json.error);
            }
        } catch (error) {
            console.error("Weather fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const getKpColor = (kp: number) => {
        if (kp < 4) return "text-green-400";
        if (kp < 6) return "text-yellow-400";
        return "text-red-500";
    };

    return (
        <div className="space-y-8 relative">
            <WeatherHelpButton onClick={() => setShowHelp(true)} />
            <WeatherHelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-orbitron font-bold text-white mb-2">SPACE WEATHER</h1>
                    <p className="text-blue-200">Monitor real-time geomagnetic storms, solar wind data, solar flares using NASA/NOAA telemetry.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-cyan-400 animate-pulse">
                    <Activity className="w-4 h-4" />
                    LIVE FEED ACTIVE
                </div>
            </header>

            {loading && !data ? (
                <div className="h-64 flex items-center justify-center">
                    <span className="font-orbitron text-xl animate-pulse">ESTABLISHING UPLINK...</span>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Real-time Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Geomagnetic Storm */}
                        <Card glow className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Zap className="w-32 h-32" />
                            </div>
                            <h3 className="text-lg font-orbitron text-blue-300 mb-2">GEOMAGNETIC STORM</h3>
                            <div className="flex items-end gap-4">
                                <span className={`text-6xl font-bold font-orbitron ${getKpColor(Number(data?.kpIndex))}`}>
                                    {data?.kpIndex}
                                </span>
                                <span className="text-xl mb-2 text-white/50">Kp Index</span>
                            </div>
                            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Number(data?.kpIndex) / 9) * 100}%` }}
                                    className={`h-full ${getKpColor(Number(data?.kpIndex)).replace('text-', 'bg-')}`}
                                />
                            </div>
                        </Card>

                        {/* Solar Wind */}
                        <Card glow className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Wind className="w-32 h-32" />
                            </div>
                            <h3 className="text-lg font-orbitron text-green-300 mb-2">SOLAR WIND MAG</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Total Field (Bt)</span>
                                    <span className="text-2xl font-orbitron">{data?.solarWind.bt} nT</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Vertical (Bz)</span>
                                    <span className="text-2xl font-orbitron">{data?.solarWind.bz} nT</span>
                                </div>
                            </div>
                        </Card>

                        {/* Solar Flare */}
                        <Card glow className="relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sun className="w-32 h-32" />
                            </div>
                            <h3 className="text-lg font-orbitron text-yellow-300 mb-2">SOLAR FLARE</h3>
                            <div className="flex items-end gap-4">
                                <span className="text-6xl font-bold font-orbitron text-yellow-500">
                                    {data?.solarFlare.class}
                                </span>
                                <span className="text-xl mb-2 text-white/50">Class</span>
                            </div>
                            <p className="mt-2 text-sm text-white/50">Flux: {data?.solarFlare.flux.toExponential(2)}</p>
                        </Card>
                    </div>

                    {/* Real-time Graphs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpGraph data={kpHistory} />
                        <MagneticFieldGraph data={magHistory} />
                        <SolarFlareGraph data={flareHistory} />
                    </div>
                </div>
            )}
        </div>
    );
}
