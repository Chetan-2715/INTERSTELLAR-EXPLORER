import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { cleanText } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Quiz API: GEMINI_API_KEY is missing.");
      return NextResponse.json({ error: "Configuration Error: API Key missing" }, { status: 500 });
    }

    const { difficulty } = await req.json();

    console.log(`Quiz API: Generating quiz for difficulty: ${difficulty}`);

    // Use gemini-2.0-flash with safety settings
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });

    const prompt = `Generate a space-themed quiz with 5 questions. Difficulty level: ${difficulty}.
    Format the output strictly as a JSON array of objects.
    Each object must have:
    - question (string)
    - options (array of 4 strings)
    - answer (string, must match one of the options exactly)
    
    Example:
    [
      {
        "question": "What is the closest star to Earth?",
        "options": ["Proxima Centauri", "Sirius", "The Sun", "Betelgeuse"],
        "answer": "The Sun"
      }
    ]
    Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = "";
    try {
      text = response.text();
    } catch (e) {
      console.error("Quiz API: Error getting text from response.");
    }

    if (!text) {
      return NextResponse.json({ error: "No quiz generated. Safety block likely." }, { status: 500 });
    }

    console.log("Quiz API: Raw response received. Length:", text.length);

    // Cleanup if markdown is present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const quizData = JSON.parse(text);

      // Clean Markdown from all quiz fields
      if (Array.isArray(quizData)) {
        quizData.forEach((q: any) => {
          q.question = cleanText(q.question);
          q.answer = cleanText(q.answer);
          if (Array.isArray(q.options)) {
            q.options = q.options.map((opt: string) => cleanText(opt));
          }
        });
      }

      console.log("Quiz API: Successfully parsed JSON.");
      return NextResponse.json({ quiz: quizData });
    } catch (parseError) {
      console.error("Quiz API: JSON Parse Error:", parseError);
      console.error("Quiz API: Offending text:", text);
      return NextResponse.json({ error: "Failed to parse quiz data" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({
      error: "Failed to generate quiz",
      details: error.message
    }, { status: 500 });
  }
}
