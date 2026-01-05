"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Send, Bot, User, Sparkles } from "lucide-react";
import AstronautInput from "@/components/ui/AstronautInput";
import { motion } from "framer-motion";

interface Message {
    role: "user" | "model";
    parts: string;
}

// Quick questions for the user to click
const SUGGESTED_QUERIES = [
    "Explain Black Holes",
    "Current status of Mars?",
    "What is the James Webb Telescope viewing?",
    "Calculate distance to Alpha Centauri"
];

export default function AstronautChatPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", parts: "System Online. Commander, I am Astra. Ready for your inquiries regarding the cosmos." }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        setInput("");
        setMessages(prev => [...prev, { role: "user", parts: textToSend }]);
        setLoading(true);

        try {
            const firstUserIndex = messages.findIndex(m => m.role === 'user');
            let validHistory = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : [];
            if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
                validHistory.pop();
            }

            const history = validHistory.map(m => ({
                role: m.role,
                parts: [{ text: m.parts }]
            }));

            const res = await fetch("/api/gemini/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: textToSend, history }),
            });

            const data = await res.json();
            if (res.ok && data.reply) {
                setMessages(prev => [...prev, { role: "model", parts: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "model", parts: "⚠️ UPLINK FAILED: " + (data.error || "Signal lost.") }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "model", parts: "⚠️ CRITICAL ERROR: Network Unreachable." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Full screen container with relative positioning
        <div className="flex flex-col h-[calc(100vh-5rem)] w-full relative overflow-hidden">

            {/* Header (Fixed Top Layer with Blur) */}
            <header className="absolute top-0 left-0 w-full z-20 pointer-events-none">
                <div className="w-full h-32 bg-gradient-to-b from-black via-black/80 to-transparent p-6">
                    <h1 className="text-4xl font-orbitron font-bold text-white mb-2 drop-shadow-lg">AI COMMANDER</h1>
                    <p className="text-blue-200 drop-shadow-md">Interactive ship intelligence system.</p>
                </div>
            </header>

            {/* Main Chat Area - Scrollable Layer */}
            <div className="absolute inset-0 z-0">
                {/* Messages Container */}
                <div
                    ref={scrollRef}
                    className="h-full w-full overflow-y-auto px-6 pt-36 pb-48 space-y-6 custom-scrollbar"
                >
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex gap-4 max-w-5xl mx-auto w-full ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)] ${msg.role === "user" ? "bg-purple-600/80" : "bg-cyan-600/80"}`}>
                                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            <div className={`max-w-[70%] p-5 rounded-2xl shadow-xl backdrop-blur-md ${msg.role === "user"
                                ? "bg-purple-500/10 border border-purple-500/30 rounded-tr-none text-purple-50"
                                : "bg-cyan-950/40 border border-cyan-500/30 rounded-tl-none text-cyan-50"
                                }`}>
                                <div className="leading-relaxed whitespace-pre-wrap font-orbitron text-sm md:text-base tracking-wide">
                                    {msg.parts.split('**').map((part, i) =>
                                        i % 2 === 1 ? <strong key={i} className="text-cyan-400 font-bold drop-shadow-sm">{part}</strong> : part
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="flex gap-4 max-w-5xl mx-auto w-full">
                            <div className="w-10 h-10 rounded-full bg-cyan-600/80 flex items-center justify-center shrink-0 animate-pulse">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 backdrop-blur-md">
                                <span className="text-xs font-orbitron text-cyan-400">PROCESSING</span>
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Input Section at Bottom */}
            <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-2 pointer-events-none">

                {/* Suggestions */}
                <div className="flex gap-3 overflow-x-auto max-w-3xl w-full px-4 items-center justify-center py-2 pointer-events-auto" style={{ scrollbarWidth: 'none' }}>
                    {SUGGESTED_QUERIES.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(q)}
                            disabled={loading}
                            className="whitespace-nowrap px-5 py-2 rounded-full bg-black/60 border border-white/10 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs text-cyan-100 transition-all flex items-center gap-2 hover:scale-105 backdrop-blur-md shadow-lg"
                        >
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            {q}
                        </button>
                    ))}
                </div>

                {/* Glass Input Container */}
                <div className="w-full max-w-2xl px-4 pointer-events-auto">
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-4 pr-2 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center gap-4">
                        <div className="flex-1">
                            <AstronautInput
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onSend={handleSend}
                                disabled={loading}
                                placeholder="Execute command..."
                            />
                        </div>
                        <Button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                            className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-500/20 transition-all hover:scale-110 shrink-0"
                        >
                            <Send className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}