import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { cleanText } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Chat API: GEMINI_API_KEY is missing.");
            return NextResponse.json({
                error: "Configuration Error",
                details: "API Key is missing on server."
            }, { status: 500 });
        }

        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        console.log("Chat API: Received message:", message);
        console.log("Chat API: History length:", history?.length || 0);
        if (history?.length > 0) {
            console.log("Chat API: First history item:", JSON.stringify(history[0]));
            console.log("Chat API: Last history item:", JSON.stringify(history[history.length - 1]));
        }

        // Use gemini-2.0-flash as a stable alternative
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;

        let text = "";
        try {
            text = response.text();
        } catch (e) {
            console.error("Chat API: Error getting text from response. Candidate might be blocked.");
        }

        if (!text) {
            console.error("Chat API: Empty response generated.");
            return NextResponse.json({
                error: "No response generated.",
                details: "The model returned an empty response. It might have been blocked by safety filters."
            }, { status: 500 });
        }

        // Clean Markdown formatting
        text = cleanText(text);

        console.log("Chat API: Response generated. Length:", text.length);

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        // Ensure error object is serializable
        const errorMessage = error.message || "Unknown error";
        return NextResponse.json({
            error: "Communication breakdown.",
            details: errorMessage
        }, { status: 500 });
    }
}
