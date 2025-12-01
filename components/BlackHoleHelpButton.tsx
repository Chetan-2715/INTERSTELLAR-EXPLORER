import React from "react";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface BlackHoleHelpButtonProps {
    onClick: () => void;
}

export const BlackHoleHelpButton: React.FC<BlackHoleHelpButtonProps> = ({ onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#22e7ff]/10 border border-[#22e7ff] text-[#22e7ff] shadow-[0_0_15px_rgba(34,231,255,0.3)] hover:bg-[#22e7ff]/20 hover:shadow-[0_0_25px_rgba(34,231,255,0.5)] transition-all backdrop-blur-sm cursor-pointer"
            aria-label="Black Hole Simulator Help"
        >
            <Info className="w-5 h-5" />
        </motion.button>
    );
};
