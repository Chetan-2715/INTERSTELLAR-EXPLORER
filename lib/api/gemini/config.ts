export const GEMINI_CONFIG = {
    provider: "Google Gemini AI",
    models: {
        vision: "gemini-1.5-flash", // Best for image classification
        chat: "gemini-pro", // Best for assistant
        quiz: "gemini-pro", // Best for text generation
    },
    endpoints: {
        generateContent: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    },
    prompts: {
        vision: "Analyze this space image and identify celestial objects, nebulae, or galaxies.",
        assistant: "You are an AI Astronaut Assistant. Answer questions about space, physics, and astronomy.",
        quiz: "Generate a 5-question multiple-choice quiz about space exploration with answers.",
    },
};
