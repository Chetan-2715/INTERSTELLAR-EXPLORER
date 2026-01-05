"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Activity, Wind, Sun, Zap } from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
// RESTORED: Help Components
import { WeatherHelpButton } from "@/components/WeatherHelpButton";
import { WeatherHelpPanel } from "@/components/WeatherHelpPanel";

interface WeatherState {
    current: {
        kpIndex: number;
        solarWind: { bt: number; bz: number };
        solarFlare: { flux: number; class: string };
    };
    history: {
        kp: { time: number; kp: number }[];
        wind: { time: number; bt: number; bz: number }[];
        flare: { time: number; flux: number }[];
    };
}

export default function WeatherPage() {
    const [data, setData] = useState<WeatherState | null>(null);
    const [loading, setLoading] = useState(true);
    // RESTORED: State for help panel
    const [showHelp, setShowHelp] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/weather`, { cache: 'no-store' });
            const json = await res.json();
            if (!json.error) setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (time: number) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-cyan-500/30 p-2 rounded shadow-xl z-50">
                    <p className="text-white text-xs mb-1">{new Date(label).toLocaleString()}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} style={{ color: p.color }} className="text-sm font-bold">
                            {p.name}: {Number(p.value).toExponential(1)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="p-8 text-cyan-400 font-orbitron animate-pulse">ESTABLISHING DEEP SPACE NETWORK...</div>;
    if (!data) return <div className="p-8 text-red-400 font-orbitron">LINK FAILED</div>;

    return (
        <div className="relative min-h-screen">
            {/* RESTORED: Help UI Elements */}
            <WeatherHelpButton onClick={() => setShowHelp(true)} />
            <WeatherHelpPanel isOpen={showHelp} onClose={() => setShowHelp(false)} />

            <div className="space-y-8 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <header className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-orbitron font-bold text-white mb-2 tracking-wider">SPACE WEATHER</h1>
                        <p className="text-blue-200">Real-time telemetry from NOAA SWPC & GOES Satellites.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-sm animate-pulse">
                        <Activity className="w-4 h-4" />
                        LIVE FEED ACTIVE
                    </div>
                </header>

                {/* 1. KEY METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* KP INDEX */}
                    <Card glow className="relative overflow-hidden bg-black/40 border-cyan-500/20">
                        <div className="absolute -right-4 -top-4 opacity-10"><Zap size={100} /></div>
                        <h3 className="text-blue-300 font-orbitron mb-1">GEOMAGNETIC STORM</h3>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-5xl font-bold font-orbitron ${data.current.kpIndex >= 5 ? 'text-red-500' : 'text-green-400'}`}>
                                Kp {data.current.kpIndex}
                            </span>
                            <span className="text-white/50 text-sm">/ 9</span>
                        </div>
                        <p className="text-sm text-blue-200 mt-2">
                            {data.current.kpIndex < 4 ? "Magnetosphere Stable" : "Storm Conditions Detected"}
                        </p>
                    </Card>

                    {/* SOLAR WIND */}
                    <Card glow className="relative overflow-hidden bg-black/40 border-cyan-500/20">
                        <div className="absolute -right-4 -top-4 opacity-10"><Wind size={100} /></div>
                        <h3 className="text-blue-300 font-orbitron mb-1">INTERPLANETARY FIELD</h3>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between">
                                <span className="text-white/70">Total (Bt):</span>
                                <span className="font-orbitron text-cyan-400">{data.current.solarWind.bt} nT</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/70">Vertical (Bz):</span>
                                <span className={`font-orbitron ${data.current.solarWind.bz < -5 ? 'text-red-500' : 'text-green-400'}`}>
                                    {data.current.solarWind.bz} nT
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* SOLAR FLARE */}
                    <Card glow className="relative overflow-hidden bg-black/40 border-cyan-500/20">
                        <div className="absolute -right-4 -top-4 opacity-10"><Sun size={100} /></div>
                        <h3 className="text-blue-300 font-orbitron mb-1">SOLAR X-RAY FLUX</h3>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-5xl font-bold font-orbitron ${['X', 'M'].includes(data.current.solarFlare.class) ? 'text-red-500' : 'text-yellow-400'}`}>
                                {data.current.solarFlare.class}
                            </span>
                            <span className="text-white/50 text-sm">Class Flare</span>
                        </div>
                        <p className="text-sm text-blue-200 mt-2">
                            {data.current.solarFlare.flux.toExponential(1)} W/m²
                        </p>
                    </Card>
                </div>

                {/* 2. GRAPHS ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* KP BAR CHART */}
                    <Card className="p-6 bg-black/40 border-white/5">
                        <h3 className="text-lg font-orbitron text-cyan-400 mb-6">PLANETARY K-INDEX (Past 24h)</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.history.kp}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="time" tickFormatter={formatTime} stroke="#4b5563" />
                                    <YAxis domain={[0, 9]} stroke="#4b5563" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="kp" radius={[4, 4, 0, 0]}>
                                        {data.history.kp.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.kp >= 5 ? '#ef4444' : entry.kp >= 4 ? '#eab308' : '#22c55e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* FLARE AREA CHART */}
                    <Card className="p-6 bg-black/40 border-white/5">
                        <h3 className="text-lg font-orbitron text-yellow-400 mb-6">X-RAY FLUX MONITOR (6-Hour)</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.history.flare}>
                                    <defs>
                                        <linearGradient id="colorFlux" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="time" tickFormatter={formatTime} stroke="#4b5563" />
                                    <YAxis scale="log" domain={['auto', 'auto']} stroke="#4b5563" tickFormatter={(val) => Number(val).toExponential(0)} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="flux" stroke="#f59e0b" fillOpacity={1} fill="url(#colorFlux)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* 3. MAGNETOMETER GRAPH */}
                <Card className="p-6 bg-black/40 border-white/5">
                    <h3 className="text-lg font-orbitron text-purple-400 mb-6">REAL-TIME MAGNETOMETER (Bt / Bz)</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.history.wind}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="time" tickFormatter={formatTime} stroke="#4b5563" />
                                <YAxis stroke="#4b5563" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="bt" stroke="#a855f7" strokeWidth={2} dot={false} name="Total Field" />
                                <Line type="monotone" dataKey="bz" stroke="#22d3ee" strokeWidth={2} dot={false} name="Bz (North-South)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
