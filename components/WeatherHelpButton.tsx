import React from "react";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherHelpButtonProps {
    onClick: () => void;
}

export const WeatherHelpButton: React.FC<WeatherHelpButtonProps> = ({ onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all backdrop-blur-sm cursor-pointer"
            aria-label="Space Weather Help"
        >
            <HelpCircle className="w-5 h-5" />
        </motion.button>
    );
};
