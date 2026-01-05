import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Fetch Raw Data concurrently
        const [kpRes, windRes, xRayRes] = await Promise.all([
            fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", { next: { revalidate: 300 } }),
            fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json", { next: { revalidate: 60 } }),
            fetch("https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json", { next: { revalidate: 60 } })
        ]);

        const kpJson = await kpRes.json();     // [time, kp, a_running, station_count]
        const windJson = await windRes.json(); // [time_tag, bt, bx, by, bz, phi, theta]
        const xRayJson = await xRayRes.json(); // [{ time_tag, flux, energy }, ...]

        // 2. Process History (Skip header row for Arrays)
        // KP: Get last 24 entries (approx 3 days, but usually we just want the recent set)
        const kpHistory = kpJson.slice(1).slice(-24).map((row: any[]) => ({
            time: new Date(row[0]).getTime(),
            kp: Number(row[1])
        }));

        // WIND: Get last ~100 points (approx 8 hours) to keep graph readable
        const windHistory = windJson.slice(1).slice(-100).map((row: any[]) => ({
            time: new Date(row[0]).getTime(),
            bt: Number(row[1]),
            bz: Number(row[4])
        }));

        // FLARE: JSON objects, not array of arrays. Already has keys.
        const flareHistory = xRayJson.slice(-100).map((item: any) => ({
            time: new Date(item.time_tag).getTime(),
            flux: item.flux
        }));

        // 3. Extract Latest Data
        const latestKp = kpHistory[kpHistory.length - 1] || { kp: 0 };
        const latestWind = windHistory[windHistory.length - 1] || { bt: 0, bz: 0 };
        const latestFlare = flareHistory[flareHistory.length - 1] || { flux: 0 };

        return NextResponse.json({
            current: {
                kpIndex: latestKp.kp,
                solarWind: { bt: latestWind.bt, bz: latestWind.bz },
                solarFlare: {
                    flux: latestFlare.flux,
                    class: calculateFlareClass(latestFlare.flux)
                }
            },
            history: {
                kp: kpHistory,
                wind: windHistory,
                flare: flareHistory
            }
        });

    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json({ error: "Failed to fetch space weather" }, { status: 500 });
    }
}

function calculateFlareClass(flux: number) {
    if (flux < 1e-8) return "A";
    if (flux < 1e-7) return "B";
    if (flux < 1e-6) return "C";
    if (flux < 1e-5) return "M";
    return "X";
}
