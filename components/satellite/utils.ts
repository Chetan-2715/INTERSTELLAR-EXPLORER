import { Satellite } from "@/components/satellite/types";
import * as satellite from "satellite.js";

// TLE Data Sources (Celestrak)
const TLE_SOURCES = {
    STARLINK: "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
    GPS: "https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle",
    ISS: "https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=tle",
    WEATHER: "https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle",
    ALL: "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle", // Note: This is large
};

export async function fetchSatellites(category: string = "STARLINK"): Promise<Satellite[]> {
    try {
        let tleUrl = TLE_SOURCES.STARLINK;
        let satCatUrl = "https://celestrak.org/satcat/records.php?GROUP=starlink&FORMAT=json";

        if (category === "GPS") {
            tleUrl = TLE_SOURCES.GPS;
            satCatUrl = "https://celestrak.org/satcat/records.php?GROUP=gps-ops&FORMAT=json";
        }
        if (category === "ISS") {
            tleUrl = TLE_SOURCES.ISS;
            satCatUrl = "https://celestrak.org/satcat/records.php?CATNR=25544&FORMAT=json";
        }
        if (category === "WEATHER") {
            tleUrl = TLE_SOURCES.WEATHER;
            satCatUrl = "https://celestrak.org/satcat/records.php?GROUP=weather&FORMAT=json";
        }

        const [tleResponse, satCatResponse] = await Promise.all([
            fetch(tleUrl),
            fetch(satCatUrl)
        ]);

        if (!tleResponse.ok) throw new Error("Failed to fetch TLE data");
        const tleText = await tleResponse.text();

        let satCatData: any[] = [];
        if (satCatResponse.ok) {
            try {
                satCatData = await satCatResponse.json();
            } catch (e) {
                console.warn("Failed to parse SatCat JSON", e);
            }
        }

        return parseTLE(tleText, category, satCatData);
    } catch (error) {
        console.error("Error fetching satellite data:", error);
        return [];
    }
}

function parseTLE(tleData: string, category: string, satCatData: any[]): Satellite[] {
    const lines = tleData.split('\n');
    const satellites: Satellite[] = [];

    // Create a map for fast lookup of SatCat data by NORAD ID
    const satCatMap = new Map<number, any>();
    satCatData.forEach(item => {
        if (item.NORAD_CAT_ID) {
            satCatMap.set(item.NORAD_CAT_ID, item);
        }
    });

    for (let i = 0; i < lines.length; i += 3) {
        const nameLine = lines[i]?.trim();
        const line1 = lines[i + 1]?.trim();
        const line2 = lines[i + 2]?.trim();

        if (nameLine && line1 && line2) {
            try {
                const satrec = satellite.twoline2satrec(line1, line2);

                // Extract NORAD ID from Line 1 (cols 3-7, 0-indexed: 2-7)
                // Actually standard TLE format:
                // Line 1, Col 3-7 is Satellite Number
                const noradIdStr = line1.substring(2, 7).trim();
                const noradId = parseInt(noradIdStr, 10);

                // Extract Int'l Designator from Line 1 (cols 10-17)
                const intlDes = line1.substring(9, 17).trim();

                // Lookup metadata
                const metadata = satCatMap.get(noradId);

                satellites.push({
                    id: i,
                    name: nameLine,
                    line1: line1,
                    line2: line2,
                    satrec: satrec,
                    category: category,
                    noradId: noradId,
                    intlDes: intlDes,
                    launchDate: metadata?.LAUNCH_DATE || "Unknown",
                    site: metadata?.LAUNCH_SITE || "Unknown",
                    country: metadata?.OWNER || "Unknown",
                    launchYear: metadata?.LAUNCH_DATE ? metadata.LAUNCH_DATE.substring(0, 4) : (intlDes ? "20" + intlDes.substring(0, 2) : "Unknown"), // Fallback to Int'l Des year
                    objectType: metadata?.OBJECT_TYPE || "Unknown"
                });
            } catch (e) {
                // Skip invalid TLEs
            }
        }
    }
    return satellites;
}

export function getSatellitePosition(sat: Satellite, date: Date = new Date()) {
    const positionAndVelocity = satellite.propagate(sat.satrec, date);
    if (!positionAndVelocity || !positionAndVelocity.position || !positionAndVelocity.velocity) {
        return {
            lat: 0, lng: 0, height: 0,
            x: 0, y: 0, z: 0,
            velocity: { x: 0, y: 0, z: 0 }
        };
    }
    const positionGd = satellite.eciToGeodetic(positionAndVelocity.position as satellite.EciVec3<number>, satellite.gstime(date));

    // Convert to km
    const longitude = satellite.degreesLong(positionGd.longitude);
    const latitude = satellite.degreesLat(positionGd.latitude);
    const height = positionGd.height;

    // Get ECI coordinates for 3D visualization (in km)
    const positionEci = positionAndVelocity.position as { x: number, y: number, z: number };

    return {
        lat: latitude,
        lng: longitude,
        height: height,
        x: positionEci.x,
        y: positionEci.y,
        z: positionEci.z,
        velocity: positionAndVelocity.velocity
    };
}
