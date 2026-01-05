import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the schema for the model to follow strictly
const schema = {
    description: "Space image analysis",
    type: "object",
    properties: {
        identification: {
            type: "array",
            items: { type: "string" },
            description: "List of identified objects or celestial bodies"
        },
        scientificDescription: {
            type: "array",
            items: { type: "string" },
            description: "Concise, key scientific facts (max 5-7 words per point). No long sentences."
        },
        interestingFacts: {
            type: "array",
            items: { type: "string" },
            description: "Fun or intriguing facts about the image subject"
        },
        directAnswer: {
            type: "string",
            description: "A direct, conversational answer to the user's specific question, if one was asked. Otherwise, leave empty."
        }
    },
    required: ["identification", "scientificDescription", "interestingFacts"]
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;
        const userQuestion = formData.get("question") as string;

        // 1. Strict Validation
        if (!file) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Reject non-images
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Invalid file type. Only images allowed." }, { status: 400 });
        }

        // Reject files larger than 10MB to save server memory
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Image too large. Max size is 10MB." }, { status: 400 });
        }

        // 2. Prepare Data
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        // 3. Configure Model with JSON Schema
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", // Updated to latest exp as requested or available
            generationConfig: {
                responseMimeType: "application/json",
                // @ts-ignore - responseSchema is supported in newer SDK versions but types might lag
                responseSchema: schema
            }
        });

        let prompt = "Analyze this celestial image. Provide identification, scientific description, and interesting facts. For scientific description, use ONLY short, punchy bullet points (3-6 words). Avoid full sentences or essay-like explanations.";

        if (userQuestion) {
            prompt += `\n\nIMPORTANT: The user has asked a specific question: "${userQuestion}". Answer this question directly and concisely in the "directAnswer" field.`;
        }

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        // 4. Parse and Return JSON
        const responseText = result.response.text();
        const jsonResponse = JSON.parse(responseText);

        return NextResponse.json({ result: jsonResponse });

    } catch (error: any) {
        console.error("Vision API Error:", error);
        return NextResponse.json({
            error: "Analysis failed",
            details: error.message
        }, { status: 500 });
    }
}