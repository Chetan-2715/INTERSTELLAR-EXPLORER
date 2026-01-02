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
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`CelesTrak API error: ${response.status} ${response.statusText}`);
            return NextResponse.json(
                { error: `CelesTrak API error: ${response.statusText}` },
                { status: 502 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch satellite data:", error);
        return NextResponse.json(
            { error: "Failed to fetch satellite data" },
            { status: 502 }
        );
    }
}
