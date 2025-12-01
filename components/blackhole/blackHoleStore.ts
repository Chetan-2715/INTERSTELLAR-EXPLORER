import { create } from 'zustand';

interface BlackHoleState {
    mass: number;
    spin: number;
    accretionRate: number;
    videoUrl: string | null;

    // Telemetry
    eventHorizon: number; // km
    photonSphere: number; // km
    timeDilation: number; // factor

    setMass: (mass: number) => void;
    setSpin: (spin: number) => void;
    setAccretionRate: (rate: number) => void;
    setVideoUrl: (url: string | null) => void;
}

export const useBlackHoleStore = create<BlackHoleState>((set) => ({
    mass: 10,
    spin: 0,
    accretionRate: 0.5,
    videoUrl: null,

    eventHorizon: 29.5, // 2.95 * 10
    photonSphere: 44.25, // 1.5 * 29.5
    timeDilation: 1.056, // 1 / sqrt(1 - 1/10)

    setMass: (mass) => set((state) => {
        // Event Horizon Radius (Schwarzschild radius) = 2GM/c^2
        // For 1 Solar Mass ~ 2.95 km
        const eventHorizon = 2.95 * mass;

        // Photon Sphere Radius = 3GM/c^2 = 1.5 * Rs
        const photonSphere = 1.5 * eventHorizon;

        // Time Dilation at a fixed observer distance (e.g., 500km)
        // Formula: 1 / sqrt(1 - Rs/r)
        const r = 500;
        const safeR = Math.max(r, eventHorizon * 1.01);
        const timeDilation = 1 / Math.sqrt(1 - (eventHorizon / safeR));

        return { mass, eventHorizon, photonSphere, timeDilation };
    }),

    setSpin: (spin) => set({ spin }),

    setAccretionRate: (accretionRate) => set({ accretionRate }),

    setVideoUrl: (videoUrl) => set({ videoUrl }),
}));
