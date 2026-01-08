"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { APP_ROUTES } from "@/lib/routes";
import ElectricBorder from "@/components/ui/ElectricBorder";
import { LucideIcon } from "lucide-react";

interface Route {
    path: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

const DashboardCard = ({ route }: { route: Route }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = route.icon;

    return (
        <Link
            href={route.path}
            className="group h-full block relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <ElectricBorder
                color={isHovered ? "#ff0055" : "#00f0ff"}
                speed={isHovered ? 2 : 0.5}
                chaos={isHovered ? 0.3 : 0.1}
                className="h-full"
            >
                <Card glow className="h-full relative overflow-hidden bg-black/40 hover:bg-white/5 transition-colors border-none p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon className="w-20 h-20" />
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2.5 rounded-lg transition-colors ${isHovered ? 'bg-pink-500/10 text-pink-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-orbitron transition-colors ${isHovered ? 'text-pink-400' : 'text-white'}`}>
                                {route.title}
                            </h3>
                        </div>
                    </div>
                    <p className="text-blue-200/70 text-xs leading-relaxed">
                        {route.description}
                    </p>
                </Card>
            </ElectricBorder>
        </Link>
    );
};

export default function DashboardPage() {
    return (
        <div className="w-full p-8 md:p-12">
            <header className="mb-8">
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">MISSION CONTROL</h1>
                <p className="text-blue-200">Select a module to begin your exploration.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {APP_ROUTES.map((route) => (
                    <DashboardCard key={route.path} route={route} />
                ))}
            </div>
        </div>
    );
};
