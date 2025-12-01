import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch Kp Index (Geomagnetic Storm Level)
        const kpRes = await fetch("https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json", { cache: 'no-store' });
        const kpData = await kpRes.json();
        // kpData is array of arrays. Last one is latest. [time, kp, a_running, station_count]
        const latestKp = kpData[kpData.length - 1];

        // Fetch Solar Wind (Mag)
        // https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json
        // [time_tag, bt, bx, by, bz, phi, theta]
        const windRes = await fetch("https://services.swpc.noaa.gov/products/solar-wind/mag-5-minute.json", { cache: 'no-store' });
        const windData = await windRes.json();
        const latestWind = windData[windData.length - 1];

        // Fetch Solar Flare (using NASA DONKI if available, or mock/other source. NOAA has x-ray flux)
        // https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json
        const xRayRes = await fetch("https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json", { cache: 'no-store' });
        const xRayData = await xRayRes.json();
        const latestXRay = xRayData[xRayData.length - 1]; // { time_tag, flux, energy }

        return NextResponse.json({
            kpIndex: latestKp[1],
            solarWind: {
                bt: latestWind[1], // Total Field
                bz: latestWind[4], // North-South component (important for storms)
            },
            solarFlare: {
                flux: latestXRay.flux,
                class: calculateFlareClass(latestXRay.flux)
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
