import { NextRequest, NextResponse } from "next/server";
import { genAI } from "@/lib/gemini";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { cleanText } from "@/lib/utils";

// 1. Define Sub-topics to ensure variety
const QUIZ_TOPICS = [
  "Solar System Planets", "Black Holes & Neutron Stars", "Space Exploration History",
  "Rocket Science & Propulsion", "Exoplanets", "The Sun & Solar Weather",
  "Galaxies & Cosmology", "Astronaut Life & Training", "Space Telescopes",
  "The Moon (Luna)", "Mars Missions", "International Space Station"
];

// 2. Define strict difficulty guides
const DIFFICULTY_GUIDE: Record<string, string> = {
  "Easy": "Target audience: Kids/Beginners. Focus on: General common knowledge (e.g., names of planets, famous astronauts).",
  "Medium": "Target audience: High School students. Focus on: Specific facts, moons, basic distances, and well-known missions.",
  "Hard": "Target audience: Space Enthusiasts. Focus on: Specific dates, chemical compositions, star types, and lesser-known missions.",
  "Professor": "Target audience: Astrophysics students. Focus on: Stellar evolution, cosmology theories, redshift, and quantum mechanics concepts.",
  "Real Astronaut": "Target audience: Mission Specialists. Focus on: Orbital mechanics, specific impulse, launch vehicle specs, emergency procedures, and technical acronyms."
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Configuration Error" }, { status: 500 });

    const { difficulty } = await req.json();

    // 3. Pick a RANDOM topic to force a unique quiz every time
    const randomTopic = QUIZ_TOPICS[Math.floor(Math.random() * QUIZ_TOPICS.length)];
    const difficultyInstruction = DIFFICULTY_GUIDE[difficulty] || DIFFICULTY_GUIDE["Medium"];

    console.log(`Quiz API: Generating '${difficulty}' quiz focused on '${randomTopic}'`);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
      // 4. Increase creativity to avoid repetition
      generationConfig: {
        temperature: 0.9,
      }
    });

    const prompt = `
    Generate a unique space-themed quiz with 5 questions.
    
    CONTEXT:
    - Difficulty Level: ${difficulty}
    - Specific Focus: ${randomTopic} (Ensure at least 3 questions relate to this, others can be general)
    - Instruction: ${difficultyInstruction}
    
    OUTPUT FORMAT:
    Format strictly as a JSON array of objects. No markdown.
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option A"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    if (!text) throw new Error("No response generated.");

    // Cleanup formatting
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const quizData = JSON.parse(text);

    // Clean text just in case
    if (Array.isArray(quizData)) {
      quizData.forEach((q: any) => {
        q.question = cleanText(q.question);
        q.answer = cleanText(q.answer);
        if (Array.isArray(q.options)) {
          q.options = q.options.map((opt: string) => cleanText(opt));
        }
      });
    }

    return NextResponse.json({ quiz: quizData });

  } catch (error: any) {
    console.error("Quiz API Error:", error);
    return NextResponse.json({ error: "Failed to generate quiz", details: error.message }, { status: 500 });
  }
}