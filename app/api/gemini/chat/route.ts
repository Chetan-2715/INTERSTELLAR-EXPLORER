import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { cleanText } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "Configuration Error" }, { status: 500 });

        const { message, history } = await req.json();

        // 1. DEFINE THE PERSONA
        // This tells the AI exactly how to behave.
        const systemInstruction = `
            You are "Astra", the onboard AI Computer for the Interstellar Explorer vessel.
            Your mission is to assist the Commander (the user) with space knowledge, mission planning, and scientific analysis.
            
            Tone: Professional, calm, slightly robotic but helpful (like HAL 9000 but friendly, or JARVIS).
            - Use scientific terms but explain them simply if asked.
            - If the user is confused, offer analogies.
            - Keep answers concise unless asked for a detailed report.
            - Use formatting (bullet points, bold text) to make data scannable.
            
            Never mention you are an AI model by Google. You are a ship system.
        `;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            // Inject the persona here
            systemInstruction: systemInstruction,
        });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 1500, // INCREASED from 500
                temperature: 0.7,      // Slight creativity
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        let text = response.text();
        if (!text) throw new Error("Empty response");

        // Optional: We don't strictly need cleanText if we want Markdown, 
        // but keeping it simple for now.
        // text = cleanText(text); 

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "System Malfunction", details: error.message }, { status: 500 });
    }
}