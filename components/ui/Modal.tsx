"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101]"
                    >
                        <div className="glass-panel border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-orbitron text-cyan-400 neon-text">{title}</h3>
                                <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="text-blue-100 font-inter">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
