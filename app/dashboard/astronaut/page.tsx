"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
    role: "user" | "model";
    parts: string;
}

export default function AstronautChatPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", parts: "Greetings, Commander. I am your AI Co-Pilot. How can I assist with your mission today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", parts: userMsg }]);
        setLoading(true);

        try {
            // Robust History Formatting for Gemini
            // 1. Find the first 'user' message to ensure history starts with 'user'.
            const firstUserIndex = messages.findIndex(m => m.role === 'user');

            let validHistory: Message[] = [];
            if (firstUserIndex !== -1) {
                validHistory = messages.slice(firstUserIndex);
            }

            // 2. Ensure history ends with 'model'. 
            // If the last message in history is 'user', it means the previous turn was incomplete (error or no reply).
            // We cannot send [User, User] sequence. So we remove the last 'user' message from history.
            if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
                validHistory.pop();
            }

            console.log("Chat Frontend: Sending History:", JSON.stringify(validHistory));

            const history = validHistory.map(m => ({
                role: m.role,
                parts: [{ text: m.parts }]
            }));

            const res = await fetch("/api/gemini/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, history }),
            });

            const data = await res.json();
            if (res.ok && data.reply) {
                setMessages(prev => [...prev, { role: "model", parts: data.reply }]);
            } else {
                console.error("Chat Error:", data);
                setMessages(prev => [...prev, { role: "model", parts: "⚠️ SYSTEM FAILURE: " + (data.error || "Unable to establish link.") }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "model", parts: "⚠️ CRITICAL ERROR: Connection lost." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <header className="mb-6">
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">AI ASSISTANT</h1>
                <p className="text-blue-200">Ask space-related questions, get explanations, and consult the AI astronaut assistant.</p>
            </header>

            <Card className="flex-1 flex flex-col overflow-hidden border-cyan-500/30">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-purple-600" : "bg-cyan-600"}`}>
                                {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                                ? "bg-purple-500/20 border border-purple-500/30 rounded-tr-none"
                                : "bg-cyan-500/20 border border-cyan-500/30 rounded-tl-none"
                                }`}>
                                <p className="text-blue-100 leading-relaxed whitespace-pre-wrap">{msg.parts}</p>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div className="bg-cyan-500/20 border border-cyan-500/30 p-4 rounded-2xl rounded-tl-none">
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" />
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your command..."
                            className="flex-1 bg-black/50 border border-white/20 rounded-full px-6 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                        <Button onClick={handleSend} disabled={loading || !input.trim()} className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
                            <Send className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
