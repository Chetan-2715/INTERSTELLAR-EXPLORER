import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch data in parallel
        const [kpRes, magRes, flareRes] = await Promise.all([
            fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"),
            fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-24-hour.json"),
            fetch("https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json")
        ]);

        if (!kpRes.ok || !magRes.ok || !flareRes.ok) {
            throw new Error("Failed to fetch from NOAA");
        }

        const kpData = await kpRes.json();
        const magData = await magRes.json();
        const flareData = await flareRes.json();

        // Process Kp Data
        // NOAA Kp JSON is typically an array of arrays: [[time_tag, kp_index, ...], ...]
        // Skip header row
        const processedKp = Array.isArray(kpData) ? kpData.slice(1).map((row: any) => ({
            time: row[0],
            kp: Number(row[1])
        })).filter((d: any) => d.time && !isNaN(d.kp)) : [];

        // Process Mag Data
        // NOAA Mag JSON is typically an array of arrays: [[time_tag, bx, by, bz, lon, lat, bt], ...]
        // Skip header row, downsample to every 10th point
        const processedMag = Array.isArray(magData) ? magData.slice(1)
            .filter((_: any, i: number) => i % 10 === 0)
            .map((row: any) => ({
                time: row[0],
                bt: Number(row[6]),
                bz: Number(row[3])
            })).filter((d: any) => d.time && !isNaN(d.bt)) : [];

        // Process Flare Data
        // NOAA X-ray JSON is array of objects: [{ time_tag, flux, energy }, ...]
        // Filter for primary sensor (0.1-0.8nm)
        const processedFlare = Array.isArray(flareData) ? flareData
            .filter((d: any) => d.energy === "0.1-0.8nm")
            .filter((_: any, i: number) => i % 10 === 0)
            .map((d: any) => ({
                time: d.time_tag,
                flux: d.flux
            })).filter((d: any) => d.time && !isNaN(d.flux)) : [];

        return NextResponse.json({
            kp: processedKp,
            mag: processedMag,
            flare: processedFlare
        });

    } catch (error: any) {
        console.error("History API Error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
