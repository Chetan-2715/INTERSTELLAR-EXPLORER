"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">MISSION CONTROL</h1>
                <p className="text-blue-200">Select a module to begin your exploration.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {APP_ROUTES.map((route) => {
                    const Icon = route.icon;
                    return (
                        <Link key={route.path} href={route.path}>
                            <Card glow className="h-full group relative overflow-hidden hover:bg-white/5 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Icon className="w-24 h-24" />
                                </div>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-orbitron text-white group-hover:text-cyan-400 transition-colors">
                                            {route.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-blue-200/70 text-sm leading-relaxed">
                                    {route.description}
                                </p>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
