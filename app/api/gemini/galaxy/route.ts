import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        const { type, color, density, style } = await req.json();

        // -------------------------------------------------------------
        // 🌌 SUPER STABLE GALAXY PROMPT
        // -------------------------------------------------------------
        const prompt = `
Generate a realistic galaxy as a SINGLE valid SVG.
The output MUST follow the requirements for the selected galaxy type.

=====================
GALAXY TYPE RULES
=====================

(1) SPIRAL or BARRED SPIRAL:
- Use width="1024" height="1024" viewBox="0 0 1024 1024"
- MUST include:
  <g id="core"> — radial gradient core
  <g id="arms"> — 3–4 logarithmic spiral arms:
      r = a * e^(bθ), θ from 0 to 6.0
  <g id="stars"> — 50–80 small <circle> stars
  <g id="nebula"> — 2–3 blurred glow paths
- Spiral arms MUST curve smoothly around the core.
- NO straight lines, NO right angles, NO abstract shapes.

(2) ELLIPTICAL:
- NO spiral arms.
- Use one large elliptical <path> or <ellipse>.
- Soft radial gradient core.
- Stars distributed smoothly.
- 2–3 soft nebula glows.
- The shape MUST look like a smooth oval galaxy (E0–E7 type).
- Absolutely NO curves, arms, or spiral structures.

(3) DWARF:
- No arms, no symmetry.
- Use a diffuse irregular cloud structure.
- 40–60 stars.
- Very soft nebula patches.

(4) IRREGULAR:
- Random non-symmetrical cloud-like structure.
- No spiral geometry.
- 40–80 stars.
- Nebula shapes should be uneven.

(5) STARBURST:
- Very bright oversized core.
- Star density 80–120.
- Short faint radial streaks (<path>) from core.
- No spiral arms.

(6) NEBULA-STYLE:
- No clear galaxy shape.
- Use 3–5 colorful blurred cloud paths.
- Very soft edges.
- 20–40 stars.

=====================
GLOBAL SVG RULES
=====================
- Only ONE <svg>…</svg>
- Keep under 150KB.
- NO markdown, NO backticks, NO comments.
- MUST be valid SVG.

Galaxy Parameters:
- Type: ${type}
- Color Theme: ${color}
- Density: ${density}
- Style: ${style}
`;

        // -------------------------------------------------------------
        // 🌌 FUNCTION — CALL GEMINI API
        // -------------------------------------------------------------
        async function callGemini() {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            maxOutputTokens: 4096,
                            temperature: 0.6,
                            topP: 0.9
                        }
                    })
                }
            );

            if (!response.ok) {
                const err = await response.text();
                console.error("Gemini API Error:", err);

                if (response.status === 429) {
                    return { retry: false, error: "RATE_LIMIT" };
                }

                throw new Error(`Gemini error ${response.status}: ${err}`);
            }

            const data = await response.json();
            let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            return { retry: false, text };
        }

        // -------------------------------------------------------------
        // 🌌 CALL GEMINI — WITH ONE RETRY IF EMPTY
        // -------------------------------------------------------------
        let { text, retry } = await callGemini();

        if ((!text || text.trim().length < 20) && !retry) {
            console.warn("⚠ Empty response — retrying once...");
            const retryResult = await callGemini();
            text = retryResult.text;
        }

        if (!text) {
            throw new Error("No content generated from Gemini.");
        }

        // -------------------------------------------------------------
        // 🌌 CLEAN + EXTRACT STRICT SVG
        // -------------------------------------------------------------
        let clean = text
            .replace(/```svg/gi, "")
            .replace(/```/g, "")
            .replace(/`/g, "")
            .trim();

        const match = clean.match(/<svg[\s\S]*?<\/svg>/);
        if (!match) {
            console.error("SVG extraction failed. Raw output:", clean.substring(0, 200));
            throw new Error("Failed to generate valid SVG structure.");
        }

        const svg = match[0];

        // -------------------------------------------------------------
        // 🌌 ENCODE SVG TO BASE64 DATA URI
        // -------------------------------------------------------------
        const base64Svg = Buffer.from(svg, "utf8").toString("base64");
        const dataUri = `data:image/svg+xml;base64,${base64Svg}`;

        return NextResponse.json({ image: dataUri });

    } catch (error: any) {
        console.error("Galaxy Generator Error:", error);
        return NextResponse.json(
            {
                error: "Generation failed. The ship's computer could not visualize the galaxy.",
                details: error.message
            },
            { status: 500 }
        );
    }
}
