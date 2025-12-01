import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { cleanText } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Vision API: GEMINI_API_KEY is missing.");
            return NextResponse.json({ error: "Configuration Error: API Key missing" }, { status: 500 });
        }

        if (!file) {
            console.error("Vision API: No image file provided in request.");
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        console.log(`Vision API: Processing file - Name: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");

        // Use gemini-2.0-flash for vision tasks
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Analyze the image and return the output STRICTLY in the following format:

Identification:
- (point)
- (point)

Scientific Description:
- (point)
- (point)

Interesting Facts:
- (point)
- (point)
- (point)

No paragraphs. No introduction. No markdown formatting. No **bold**. Only plain text bullet points.`;

        console.log("Vision API: Sending request to Gemini...");
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type,
                },
            },
        ]);

        const response = await result.response;
        let text = response.text();

        // Clean Markdown formatting
        text = cleanText(text);

        console.log("Vision API: Success. Response length:", text.length);

        return NextResponse.json({ result: text });
    } catch (error: any) {
        console.error("Vision API Error:", error);
        return NextResponse.json({
            error: "Failed to analyze image",
            details: error.message
        }, { status: 500 });
    }
}
