import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const group = searchParams.get("group");
    const format = searchParams.get("format");

    if (!group || !format) {
        return NextResponse.json(
            { error: "Missing required query parameters: group and format" },
            { status: 400 }
        );
    }

    const url = `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=${format}`;

    try {
        // Add a timeout signal to prevent hanging headers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`CelesTrak API error: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `CelesTrak API error: ${response.statusText}` },
                { status: 502 }
            );
        }

        const text = await response.text();

        // Check if the response is "Invalid query" or similar text
        if (text.trim().startsWith("Invalid query") || text.trim().startsWith("No GP data found")) {
            console.error(`CelesTrak returned error text: ${text}`);
            return NextResponse.json(
                { error: `CelesTrak Error: ${text}` },
                { status: 400 }
            );
        }

        try {
            const data = JSON.parse(text);
            return NextResponse.json(data);
        } catch (jsonError) {
            console.error("Failed to parse CelesTrak JSON:", text.substring(0, 100));
            return NextResponse.json(
                { error: "Received invalid JSON from CelesTrak" },
                { status: 502 }
            );
        }

    } catch (error: any) {
        console.error("Failed to fetch satellite data:", error);
        return NextResponse.json(
            { error: "Failed to fetch satellite data", details: error.message },
            { status: 502 }
        );
    }
}
