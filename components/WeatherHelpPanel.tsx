import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Activity, Wind, Sun, Zap } from "lucide-react";

interface WeatherHelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WeatherHelpPanel: React.FC<WeatherHelpPanelProps> = ({ isOpen, onClose }) => {
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
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/90 border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6 space-y-8">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <h2 className="text-2xl font-orbitron font-bold text-white">DATA DEFINITIONS</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Kp Index Section */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-blue-300">
                                    <Zap className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">Geomagnetic Storm (Kp)</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <p><strong className="text-cyan-400">What it represents:</strong> The Kp index quantifies disturbances in the horizontal component of Earth's magnetic field. It serves as a global geomagnetic storm index.</p>
                                    <p><strong className="text-cyan-400">Range (0-9):</strong> A scale from 0 (quiet) to 9 (extreme storm).</p>
                                    <ul className="list-disc list-inside space-y-1 ml-2 text-white/70">
                                        <li>0-2: Quiet</li>
                                        <li>3-4: Unsettled</li>
                                        <li>5+: Geomagnetic Storm (G1-G5)</li>
                                    </ul>
                                    <p><strong className="text-cyan-400">Unit:</strong> K-index (dimensionless)</p>
                                </div>
                            </section>

                            {/* Solar Wind Section */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-green-300">
                                    <Wind className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">Solar Wind Magnetic Field</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <p><strong className="text-cyan-400">Bt (Total Field):</strong> The total strength of the Interplanetary Magnetic Field (IMF) carried by the solar wind.</p>
                                    <p className="text-xs text-white/50">Unit: nanoTesla (nT)</p>

                                    <div className="mt-2 pt-2 border-t border-white/10">
                                        <p><strong className="text-cyan-400">Bz (Vertical Component):</strong> The north-south direction of the IMF.</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2 text-white/70 mt-1">
                                            <li><span className="text-green-400">Positive (+):</span> Northward (Earth's shield blocks most particles).</li>
                                            <li><span className="text-red-400">Negative (-):</span> Southward (Cancels Earth's field, allowing energy in &rarr; Auroras!).</li>
                                        </ul>
                                        <p className="text-xs text-white/50 mt-1">Unit: nanoTesla (nT)</p>
                                    </div>
                                </div>
                            </section>

                            {/* Solar Flare Section */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-3 text-yellow-300">
                                    <Sun className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">Solar Flare Class</h3>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 space-y-2 text-sm text-blue-100 leading-relaxed border border-white/5">
                                    <p><strong className="text-cyan-400">Classification:</strong> Flares are classified by their X-ray brightness.</p>
                                    <div className="grid grid-cols-5 gap-1 text-center text-xs font-bold mt-2 mb-2">
                                        <div className="bg-green-900/50 p-1 rounded">A</div>
                                        <div className="bg-green-700/50 p-1 rounded">B</div>
                                        <div className="bg-yellow-600/50 p-1 rounded">C</div>
                                        <div className="bg-orange-600/50 p-1 rounded">M</div>
                                        <div className="bg-red-600/50 p-1 rounded">X</div>
                                    </div>
                                    <p><strong className="text-cyan-400">Class M:</strong> Medium-sized flares that can cause brief radio blackouts at Earth's poles.</p>
                                    <p><strong className="text-cyan-400">Unit:</strong> Watts/m² (X-ray flux)</p>
                                    <p className="text-xs text-white/50">Example: 2.87e-6 W/m²</p>
                                </div>
                            </section>

                            {/* Dashboard Guide */}
                            <section className="pt-4 border-t border-white/10">
                                <h4 className="text-sm font-orbitron text-white/50 mb-3 uppercase tracking-widest">Dashboard Guide</h4>
                                <div className="grid gap-3 text-xs text-blue-200">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-blue-400" />
                                        <span>Monitors Earth's geomagnetic stability.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Wind className="w-4 h-4 text-green-400" />
                                        <span>Tracks magnetic field strength & direction.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Sun className="w-4 h-4 text-yellow-400" />
                                        <span>Detects current solar flare intensity.</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-cyan-400" />
                                        <span>Indicates real-time data stream status.</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
