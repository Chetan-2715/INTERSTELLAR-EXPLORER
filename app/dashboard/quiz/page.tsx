"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { BrainCircuit, Trophy, Star, RefreshCw } from "lucide-react";

const difficulties = ["Easy", "Medium", "Hard", "Professor", "Real Astronaut"];

interface Question {
    question: string;
    options: string[];
    answer: string;
}

export default function QuizPage() {
    const [gameState, setGameState] = useState<"menu" | "loading" | "playing" | "gameover">("menu");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedDiff, setSelectedDiff] = useState("");
    const [userAnswers, setUserAnswers] = useState<string[]>([]);

    const startQuiz = async (diff: string) => {
        setSelectedDiff(diff);
        setGameState("loading");
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const res = await fetch("/api/gemini/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ difficulty: diff }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await res.json();
            if (res.ok && data.quiz) {
                setQuestions(data.quiz);
                setGameState("playing");
                setCurrentQ(0);
                setScore(0);
                setUserAnswers([]);
            } else {
                console.error("Quiz Error:", data);
                alert("Failed to generate mission: " + (data.error || "Unknown error"));
                setGameState("menu");
            }
        } catch (error: any) {
            console.error(error);
            if (error.name === 'AbortError') {
                alert("Mission generation timed out. The uplink is weak.");
            } else {
                alert("Communication error. Please try again.");
            }
            setGameState("menu");
        }
    };

    const handleAnswer = (option: string) => {
        const newAnswers = [...userAnswers, option];
        setUserAnswers(newAnswers);

        if (option === questions[currentQ].answer) {
            setScore(s => s + 1);
        }

        if (currentQ + 1 < questions.length) {
            setCurrentQ(q => q + 1);
        } else {
            setGameState("gameover");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-orbitron font-bold text-white mb-2">COSMIC QUIZ</h1>
                <p className="text-blue-200">Test your cosmic knowledge with dynamic AI-generated quizzes from easy level to real astronaut mode.</p>
            </header>

            <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {gameState === "menu" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full space-y-6"
                    >
                        <h2 className="text-2xl font-orbitron text-center text-cyan-400">SELECT DIFFICULTY</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {difficulties.map((diff) => (
                                <Button
                                    key={diff}
                                    onClick={() => startQuiz(diff)}
                                    variant="outline"
                                    className="w-full py-6 text-lg hover:bg-cyan-500/20"
                                >
                                    {diff.toUpperCase()}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {gameState === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <BrainCircuit className="w-16 h-16 text-cyan-400 animate-pulse" />
                        <span className="font-orbitron text-xl animate-pulse">GENERATING QUESTIONS...</span>
                    </div>
                )}

                {gameState === "playing" && questions.length > 0 && (
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full space-y-8"
                    >
                        <div className="flex justify-between items-center text-sm text-blue-300 font-orbitron">
                            <span>QUESTION {currentQ + 1} / {questions.length}</span>
                            <span>DIFFICULTY: {selectedDiff.toUpperCase()}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white leading-relaxed">
                            {questions[currentQ].question}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {questions[currentQ].options.map((opt, idx) => (
                                <Button
                                    key={idx}
                                    onClick={() => handleAnswer(opt)}
                                    variant="outline"
                                    className="py-6 text-left justify-start px-6 hover:bg-purple-500/20 hover:border-purple-500"
                                >
                                    {opt}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {gameState === "gameover" && (
                    <div className="text-center space-y-8 w-full">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-white/10 backdrop-blur-xl w-full"
                        >
                            <h2 className="text-3xl font-orbitron font-bold text-white mb-4">MISSION COMPLETE</h2>
                            <div className="text-6xl font-bold text-cyan-400 mb-4">{score} / {questions.length}</div>
                            <p className="text-blue-200 mb-8">
                                {score === questions.length ? "Perfect Score! You are ready for deep space." : "Good effort, cadet. Review your mission data below."}
                            </p>

                            <div className="space-y-4 mb-8 text-left max-h-[400px] overflow-y-auto pr-2">
                                <h3 className="text-xl font-orbitron text-white border-b border-white/10 pb-2">Mission Review</h3>
                                {questions.map((q, idx) => {
                                    const userAnswer = userAnswers[idx];
                                    const isCorrect = userAnswer === q.answer;
                                    return (
                                        <div key={idx} className="p-4 rounded-lg bg-black/20 border border-white/5">
                                            <p className="text-white font-medium mb-2">{idx + 1}. {q.question}</p>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className={`flex items-center gap-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                                    <span className="opacity-70">Your Answer:</span>
                                                    <span>{userAnswer || "Skipped"}</span>
                                                    {isCorrect && <span>✓</span>}
                                                </div>
                                                {!isCorrect && (
                                                    <div className="flex items-center gap-2 text-green-400">
                                                        <span className="opacity-70">Correct Answer:</span>
                                                        <span>{q.answer}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Button onClick={() => setGameState("menu")} className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-full text-lg font-orbitron tracking-wider">
                                NEW MISSION
                            </Button>
                        </motion.div>
                    </div>
                )}
            </Card>
        </div>
    );
}
