"use client";

import React from "react";
import SatelliteMap from "@/components/satellite/SatelliteMap";

export default function SatellitePage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">SATELLITE MAP</h1>
                <p className="text-blue-200">Live 3D tracking of orbital assets using real-time TLE telemetry.</p>
            </header>

            <SatelliteMap />
        </div>
    );
}
