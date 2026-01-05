"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, Scan, Loader2, AlertCircle, ZoomIn, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DownloadButton from "@/components/ui/DownloadButton";
import VisionLoader from "@/components/ui/VisionLoader";
import AnimatedInput from "@/components/ui/AnimatedInput";

// Define the structure of our API response (matches schema but flexible)
interface AnalysisData {
    identification: string[];
    scientificDescription: string[];
    interestingFacts: string[];
}

interface ChatMessage {
    type: 'user' | 'ai';
    content: string;
}

export default function VisionPage() {
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // States for Analysis Process
    const [analyzing, setAnalyzing] = useState(false);
    const [asking, setAsking] = useState(false);

    // Data States
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Input State
    const [question, setQuestion] = useState("");

    // UI States
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat when history updates
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File is too large (Max 10MB)");
                return;
            }

            setFile(selectedFile);
            setError(null);
            setAnalysis(null);
            setChatHistory([]); // Reset chat on new file
            setQuestion("");

            const reader = new FileReader();
            reader.onload = (ev) => {
                setImage(ev.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const runAnalysis = async (customQuestion?: string) => {
        if (!file) return;

        const isInitialAnalysis = !analysis; // If no analysis yet, it's the first run

        if (isInitialAnalysis) {
            setAnalyzing(true);
        } else {
            setAsking(true);
        }

        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);
            if (customQuestion) {
                formData.append("question", customQuestion);
            }

            const res = await fetch("/api/gemini/vision", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Analysis failed");
            }

            const resultData = data.result;

            if (isInitialAnalysis) {
                // First run: Set the main analysis data
                setAnalysis({
                    identification: resultData.identification || [],
                    scientificDescription: resultData.scientificDescription || [],
                    interestingFacts: resultData.interestingFacts || []
                });
            }

            // Always check for a direct answer if we asked a question
            if (customQuestion && resultData.directAnswer) {
                setChatHistory(prev => [
                    ...prev,
                    { type: 'user', content: customQuestion },
                    { type: 'ai', content: resultData.directAnswer }
                ]);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Communication error with ship computer.");
        } finally {
            setAnalyzing(false);
            setAsking(false);
        }
    };

    const handleInitialAnalyze = () => {
        runAnalysis();
    };

    const handleSendQuestion = () => {
        if (!question.trim() || !file) return;
        const q = question.trim();
        setQuestion(""); // Clear input immediately
        runAnalysis(q);
    };

    const handleDownload = () => {
        if (!analysis) return;

        const timestamp = new Date().toLocaleString();
        let content = `VISION ANALYSIS REPORT\nGenerated: ${timestamp}\n\n`;

        content += `IDENTIFICATION:\n${analysis.identification.map(i => `- ${i}`).join('\n')}\n\n`;
        content += `SCIENTIFIC DATA:\n${analysis.scientificDescription.map(i => `- ${i}`).join('\n')}\n\n`;
        content += `INTERESTING FACTS:\n${analysis.interestingFacts.map(i => `- ${i}`).join('\n')}\n\n`;

        if (chatHistory.length > 0) {
            content += `----------------------------------------\n`;
            content += `COMMUNICATIONS LOG:\n`;
            chatHistory.forEach(msg => {
                content += `${msg.type.toUpperCase()}: ${msg.content}\n`;
            });
        }

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vision-log-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Helper to render a section
    const renderSection = (title: string, items: string[]) => (
        <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-4">
            <h3 className="text-cyan-400 font-orbitron font-bold mb-3 text-lg border-b border-cyan-500/20 pb-2 uppercase">
                {title}
            </h3>
            <ul className="space-y-2">
                {items.map((point, idx) => (
                    <li key={idx} className="text-blue-100 flex items-start gap-2 text-sm leading-relaxed">
                        <span className="text-cyan-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_5px_#00f0ff]" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <header>
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2 tracking-wider">VISION CONTROL</h1>
                <p className="text-blue-200">Analyze celestial images using AI vision models.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Input & Preview - Takes 5 columns */}
                <div className="lg:col-span-5 space-y-4 sticky top-10">
                    <Card className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-white/20 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        {image ? (
                            <div className="relative w-full h-full flex items-center justify-center p-4 group/image">
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={image}
                                    alt="Preview"
                                    className="max-h-[350px] object-contain rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.2)] border border-cyan-500/30"
                                />

                                {/* Inspect Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm z-10 pointer-events-none">
                                    <Button
                                        variant="outline"
                                        className="pointer-events-auto border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 w-12 h-12 rounded-full p-0 flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsZoomOpen(true);
                                        }}
                                    >
                                        <ZoomIn className="w-6 h-6" />
                                    </Button>
                                </div>

                                {analyzing && (
                                    <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-md z-20">
                                        <div className="scale-75">
                                            <VisionLoader />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center space-y-4 pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-cyan-500/20 transition-colors duration-300">
                                    <Upload className="w-10 h-10 text-white/50 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <p className="text-blue-200 font-orbitron">DROP IMAGE OR CLICK TO UPLOAD</p>
                            </div>
                        )}

                        {!image && (
                            <div
                                className="absolute inset-0 cursor-pointer z-0"
                                onClick={() => !analyzing && fileInputRef.current?.click()}
                            />
                        )}

                        {image && !analyzing && (
                            <div className="absolute top-2 right-2 z-20">
                                <Button
                                    variant="secondary"
                                    className="text-xs text-white/50 hover:text-white bg-transparent hover:bg-white/10"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Change Image
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Action Button - Only show Initiate if not yet analyzed */}
                    {!analysis && (
                        <Button
                            onClick={() => handleInitialAnalyze()}
                            disabled={!file || analyzing}
                            className="w-full text-lg py-6 relative overflow-hidden shrink-0"
                        >
                            {analyzing ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" /> PROCESSING
                                </span>
                            ) : (
                                "INITIATE ANALYSIS"
                            )}
                        </Button>
                    )}

                    {/* Download Button - Show if analyzed */}
                    {analysis && (
                        <div className="flex justify-center pt-2">
                            <DownloadButton onClick={handleDownload} />
                        </div>
                    )}

                </div>

                {/* Right Column: Results & Chat - Takes 7 columns */}
                <div className="lg:col-span-7 space-y-6 flex flex-col h-full min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-200"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}

                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-6"
                            >
                                {/* Static Analysis Result */}
                                <Card glow className="bg-black/40 border-cyan-500/30">
                                    <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-4">
                                        <h3 className="text-xl font-orbitron text-cyan-400 flex items-center gap-2">
                                            <Scan className="w-5 h-5" /> ANALYSIS DATA
                                        </h3>
                                    </div>

                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {renderSection("Identification", analysis.identification)}
                                        {renderSection("Scientific Data", analysis.scientificDescription)}
                                        {renderSection("Interesting Facts", analysis.interestingFacts)}
                                    </div>
                                </Card>

                                {/* Chat Interface */}
                                <Card className="bg-black/30 border-white/10 flex flex-col">
                                    <div className="flex items-center gap-2 mb-4 p-4 pb-2 border-b border-white/5">
                                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                                        <h3 className="text-lg font-orbitron text-white">QUERY SPACE</h3>
                                    </div>

                                    {/* History */}
                                    <div ref={chatContainerRef} className="flex-1 p-4 pt-0 max-h-[300px] overflow-y-auto custom-scrollbar space-y-4">
                                        {chatHistory.length === 0 ? (
                                            <div className="text-center text-white/30 italic py-8 text-sm">
                                                HAVE A DOUBT? ASK ANY QUESTION BELOW
                                            </div>
                                        ) : (
                                            chatHistory.map((msg, idx) => (
                                                <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                                    <div
                                                        className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed ${msg.type === 'user'
                                                            ? 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-50 rounded-tr-none'
                                                            : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'
                                                            }`}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[10px] text-white/30 mt-1 uppercase font-orbitron tracking-wider">
                                                        {msg.type === 'user' ? 'YOU' : 'AI COMPUTER'}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                        {asking && (
                                            <div className="flex flex-col items-start">
                                                <div className="bg-white/5 border border-white/10 text-gray-300 rounded-xl rounded-tl-none p-3 flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                                    <span className="text-xs italic text-white/50">Processing inquiry...</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 border-t border-white/10 bg-black/40">
                                        <AnimatedInput
                                            value={question}
                                            onChange={(e) => setQuestion(e.target.value)}
                                            onSend={handleSendQuestion}
                                            disabled={asking || analyzing}
                                            placeholder="Ask a specific question..."
                                        />
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Full Screen Zoom Modal */}
            <AnimatePresence>
                {isZoomOpen && image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-2 bg-black/50 rounded-full"
                            onClick={() => setIsZoomOpen(false)}
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full h-full flex items-center justify-center">
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.5}
                                maxScale={4}
                                centerOnInit
                            >
                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <img
                                        src={image}
                                        alt="Detailed View"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </TransformComponent>
                            </TransformWrapper>
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full text-white/70 text-sm font-orbitron backdrop-blur-md pointer-events-none">
                            SCROLL TO ZOOM • DRAG TO PAN
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}