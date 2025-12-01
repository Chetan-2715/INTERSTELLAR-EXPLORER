import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#00f0ff",
                secondary: "#7000ff",
                accent: "#ff0055",
                dark: "#030014",
            },
            fontFamily: {
                orbitron: ["var(--font-orbitron)", "sans-serif"],
                inter: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "conic-gradient":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
                "pulse-glow": "pulse-glow 3s infinite",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": {
                        boxShadow: "0 0 5px #00f0ff, 0 0 10px #00f0ff",
                    },
                    "50%": {
                        boxShadow: "0 0 20px #00f0ff, 0 0 30px #00f0ff",
                    },
                },
            },
        },
    },
    plugins: [],
};
export default config;
