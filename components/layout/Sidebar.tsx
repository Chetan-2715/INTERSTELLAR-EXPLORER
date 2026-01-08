"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, Rocket } from "lucide-react";
import { APP_ROUTES } from "@/lib/routes";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter(); // Import useRouter
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        router.push('/');
    };

    return (
        <motion.div
            className="fixed left-0 top-0 h-screen bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
            initial={{ width: "80px" }}
            animate={{ width: isHovered ? "280px" : "80px" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6 flex items-center gap-4 border-b border-white/10 h-[80px]">
                <Link href="/dashboard">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer hover:scale-105 transition-transform">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                </Link>
                <motion.span
                    className="font-orbitron font-bold text-xl text-white whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    AI EXPLORER
                </motion.span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
                {APP_ROUTES.map((route) => {
                    const isActive = pathname === route.path;
                    const Icon = route.icon;

                    return (
                        <Link key={route.path} href={route.path}>
                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all group relative ${isActive
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}>
                                <Icon className={`w-6 h-6 shrink-0 ${isActive ? "animate-pulse" : ""}`} />
                                <motion.span
                                    className="font-medium whitespace-nowrap"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isHovered ? 1 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {route.title}
                                </motion.span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-full bg-cyan-500 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 p-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-6 h-6 shrink-0" />
                    <motion.span
                        className="font-medium whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        Abort Mission
                    </motion.span>
                </button>
            </div>
        </motion.div>
    );
}
