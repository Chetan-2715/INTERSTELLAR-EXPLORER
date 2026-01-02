import { Scan, Activity, Bot, BrainCircuit, Play, Globe } from "lucide-react";

export const APP_ROUTES = [
    {
        title: "Vision Control",
        path: "/dashboard/vision",
        icon: Scan,
        description: "Analyze celestial images for constellation detection, exoplanet signatures, debris identification, and more using AI vision models."
    },
    {
        title: "Space Weather",
        path: "/dashboard/weather",
        icon: Activity,
        description: "Monitor real-time geomagnetic storms, solar wind data, solar flares using NASA/NOAA telemetry."
    },
    {
        title: "AI Assistant",
        path: "/dashboard/astronaut",
        icon: Bot,
        description: "Ask space-related questions, get explanations, and consult the AI astronaut assistant."
    },
    {
        title: "Cosmic Quiz",
        path: "/dashboard/quiz",
        icon: BrainCircuit,
        description: "Test your cosmic knowledge with dynamic AI-generated quizzes from easy level to real astronaut mode."
    },
    {
        title: "Black Hole Effect",
        path: "/dashboard/blackhole-effect",
        icon: Play,
        description: "Experience a cinematic visualization of a black hole with gravitational lensing and accretion disk effects."
    },
    {
        title: "Satellite Map",
        path: "/dashboard/satellite",
        icon: Globe,
        description: "View live orbital positions of satellites using TLE-based real-time space tracking."
    }
];
