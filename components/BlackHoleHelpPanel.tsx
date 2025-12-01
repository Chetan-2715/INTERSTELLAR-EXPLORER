import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Eye, MousePointer, HelpCircle, Disc, Activity, Clock } from "lucide-react";

interface BlackHoleHelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BlackHoleHelpPanel: React.FC<BlackHoleHelpPanelProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/90 border-l border-purple-500/30 shadow-[0_0_50px_rgba(188,107,255,0.1)] z-50 overflow-y-auto"
                    >
                        <div className="p-6 space-y-8">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h2 className="text-2xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#22e7ff] to-[#bc6bff]">
                                    SYSTEM OVERVIEW
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-blue-100 leading-relaxed text-sm">
                                The Black Hole Simulator visualizes how extreme gravity distorts light, shapes spacetime, and bends the appearance of surrounding objects. It is based on real astrophysical phenomena predicted by General Relativity.
                            </p>

                            {/* Key Phenomena */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-[#bc6bff]">
                                    <Activity className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">KEY PHENOMENA</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-4 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <div>
                                        <strong className="text-[#22e7ff] block mb-1">Gravitational Lensing</strong>
                                        <p className="text-white/70">Light passing near the black hole bends, causing warped stars, stretched arcs, and the formation of the Einstein Ring.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[#22e7ff] block mb-1">Event Horizon</strong>
                                        <p className="text-white/70">The boundary of no return. Any matter or light crossing this boundary is permanently trapped.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[#22e7ff] block mb-1">Accretion Disk</strong>
                                        <p className="text-white/70">A glowing disk of superheated gas orbiting the black hole. The disk appears brighter on one side due to relativistic Doppler beaming.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[#22e7ff] block mb-1">Photon Sphere</strong>
                                        <p className="text-white/70">The region where light orbits the black hole in unstable circular paths, creating layered rings of distortion.</p>
                                    </div>
                                    <div>
                                        <strong className="text-[#22e7ff] block mb-1">Relativistic Time Dilation</strong>
                                        <p className="text-white/70">Time passes slower near the black hole. Motion may appear to freeze as an object approaches the horizon.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Visual Elements */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-[#22e7ff]">
                                    <Eye className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">VISUAL ELEMENTS</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-4 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <ul className="space-y-3">
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#bc6bff] mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block">Central Black Region</strong>
                                                <span className="text-white/60">Represents the event horizon (light cannot escape).</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#bc6bff] mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block">Glowing Accretion Disk</strong>
                                                <span className="text-white/60">Hot plasma orbiting the black hole; shows Doppler-shift brightness.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#bc6bff] mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block">Warped Background Stars</strong>
                                                <span className="text-white/60">Demonstrates gravitational lensing via curved and smeared starfields.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#bc6bff] mt-2 shrink-0" />
                                            <div>
                                                <strong className="text-white block">Distortion Layers</strong>
                                                <span className="text-white/60">Additional lensing rings near the photon sphere.</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* User Controls */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-[#bc6bff]">
                                    <MousePointer className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">USER CONTROLS</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-3 text-sm border border-white/5">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/80">Left Click + Drag</span>
                                        <span className="text-[#22e7ff]">Rotate Camera</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/80">Right Click + Drag</span>
                                        <span className="text-[#22e7ff]">Pan Viewpoint</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/80">Scroll</span>
                                        <span className="text-[#22e7ff]">Zoom In/Out</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/80">Double Click</span>
                                        <span className="text-[#22e7ff]">Reset Camera</span>
                                    </div>
                                </div>
                            </section>

                            {/* Purpose */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-[#22e7ff]">
                                    <HelpCircle className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">PURPOSE</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <p className="mb-2">This module allows users to observe:</p>
                                    <ul className="list-disc list-inside space-y-1 text-white/70">
                                        <li>How gravity bends light</li>
                                        <li>Why black holes produce donut-like glowing structures</li>
                                        <li>Why accretion disks appear above and below the hole at the same time</li>
                                        <li>How relativistic motion affects brightness</li>
                                        <li>How time dilation near extreme gravity affects visual perception</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Notes */}
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-white/40 italic text-center">
                                    The sidebar closes when clicking outside or pressing the "X" icon.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
