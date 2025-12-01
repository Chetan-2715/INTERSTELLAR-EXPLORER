import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Database, Activity, MousePointer, Info } from "lucide-react";

interface SatelliteHelpPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SatelliteHelpPanel: React.FC<SatelliteHelpPanelProps> = ({ isOpen, onClose }) => {
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
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/90 border-l border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)] z-50 overflow-y-auto"
                    >
                        <div className="p-6 space-y-8">
                            <div className="flex justify-between items-center border-b border-blue-500/30 pb-4">
                                <h2 className="text-2xl font-orbitron font-bold text-white flex items-center gap-2">
                                    <Info className="w-6 h-6 text-blue-400" />
                                    SYSTEM HELP
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-blue-500/20 text-blue-400/70 hover:text-blue-400 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* SECTION 1 – SYSTEM OVERVIEW */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-blue-300">
                                    <Globe className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">System Overview</h3>
                                </div>
                                <div className="bg-blue-900/10 rounded-lg p-5 space-y-4 text-sm text-blue-100 leading-relaxed border border-blue-500/20">
                                    <div>
                                        <strong className="text-blue-400 block mb-1">FUNCTIONALITY</strong>
                                        <p className="text-blue-200/80">Real-time 3D visualization of orbital mechanics using live TLE (Two-Line Element) data and SGP4 propagation models.</p>
                                    </div>

                                    <div>
                                        <strong className="text-blue-400 block mb-1">FEATURES</strong>
                                        <ul className="list-disc list-inside space-y-1 text-blue-200/80 ml-1">
                                            <li>Live satellite tracking and orbit prediction</li>
                                            <li>Interactive Earth with rotation and zoom</li>
                                            <li>Multi-constellation support (Starlink, GPS, ISS, Weather, etc.)</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <strong className="text-blue-400 block mb-1">CONTROLS</strong>
                                        <ul className="list-disc list-inside space-y-1 text-blue-200/80 ml-1">
                                            <li><span className="text-white">Left Click:</span> Select satellite</li>
                                            <li><span className="text-white">Right Click / Drag:</span> Rotate view</li>
                                            <li><span className="text-white">Scroll:</span> Zoom in/out</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2 – FIELD REFERENCE */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-3 text-blue-300">
                                    <Database className="w-6 h-6" />
                                    <h3 className="text-lg font-orbitron font-bold">Satellite Data Guide</h3>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-orbitron text-blue-400/70 uppercase tracking-widest border-b border-blue-500/20 pb-2">Card Fields</h4>

                                    <div className="bg-blue-900/10 rounded-lg p-5 space-y-4 text-sm text-blue-100 leading-relaxed border border-blue-500/20">
                                        <div className="space-y-1">
                                            <strong className="text-blue-400">NORAD ID</strong>
                                            <p className="text-blue-200/80">Unique catalogue number assigned to the space object by U.S. Space Command. Used globally to track this specific satellite.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">INT’L DES (International Designator / COSPAR ID)</strong>
                                            <p className="text-blue-200/80">Encodes launch year and launch number (e.g., 2004-045A). Identifies which launch and which piece from that launch this object is.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">ORIGIN</strong>
                                            <p className="text-blue-200/80">Country or organization of registry or control (e.g., US, RU, CN, IN). Indicates which nation is responsible for the satellite.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">TYPE</strong>
                                            <p className="text-blue-200/80">Object or mission type:</p>
                                            <ul className="list-disc list-inside ml-2 text-blue-200/60 mt-1">
                                                <li><span className="text-white/80">PAY</span> = Payload (main satellite)</li>
                                                <li><span className="text-white/80">R/B</span> = Rocket Body</li>
                                                <li><span className="text-white/80">DEB</span> = Debris</li>
                                            </ul>
                                            <p className="text-blue-200/80 mt-1">Plus mission-specific codes (COMM, NAV, WEA, etc.).</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">LAUNCH DATE</strong>
                                            <p className="text-blue-200/80">Date the satellite was placed into orbit (UTC). Helps you see how old the satellite is.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">LAUNCH SITE</strong>
                                            <p className="text-blue-200/80">Abbreviated code for the launch range or spaceport (e.g., AFETR for Cape Canaveral Eastern Test Range). This can be expanded to the full site name in the UI tooltip if available.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">PROPAGATION MODEL</strong>
                                            <p className="text-blue-200/80">The orbit model used to compute positions from TLE data. SGP4 is the standard model used by tracking networks to predict current satellite position.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">EPOCH</strong>
                                            <p className="text-blue-200/80">The timestamp for which the TLE data is valid, often in year/day-of-year format (e.g., 25/332.408 ≈ 2025, day 332). Newer epochs mean fresher orbital data.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <strong className="text-blue-400">STATUS</strong>
                                            <p className="text-blue-200/80">Operational state of the satellite (e.g., ACTIVE, INACTIVE, DECAYED, RE-ENTRY).</p>
                                        </div>
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
