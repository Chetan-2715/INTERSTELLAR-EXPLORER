import { Satellite } from "@/components/satellite/types";
import * as satellite from "satellite.js";

const GP_URL_BASE = "/api/satellites";

const CATEGORY_GROUPS: Record<string, string> = {
    STARLINK: "starlink",
    GPS: "gps",
    ISS: "stations",
    WEATHER: "weather"
};

// Retry configuration
const MAX_RETRIES = 3;
const TIMEOUT_MS = 6000;

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            const delay = Math.pow(2, MAX_RETRIES - retries) * 1000; // Exponential backoff
            console.warn(`Fetch failed, retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
}

export async function fetchSatellites(category: string = "STARLINK"): Promise<Satellite[]> {
    const group = CATEGORY_GROUPS[category] || "starlink";
    const url = `${GP_URL_BASE}?group=${group}&format=json`;

    try {
        const data = await fetchWithRetry(url);
        return parseGPData(data, category);
    } catch (error) {
        console.error("Error fetching satellite data:", error);
        return [];
    }
}

function parseGPData(data: any[], category: string): Satellite[] {
    if (!Array.isArray(data)) return [];

    const satellites: Satellite[] = [];

    data.forEach((item, index) => {
        try {
            const line1 = item.TLE_LINE1;
            const line2 = item.TLE_LINE2;
            const name = item.OBJECT_NAME;

            if (line1 && line2 && name) {
                const satrec = satellite.twoline2satrec(line1, line2);

                // Extract metadata from GP JSON or fallback to TLE parsing
                const noradId = item.NORAD_CAT_ID || parseInt(line1.substring(2, 7).trim(), 10);
                const intlDes = item.OBJECT_ID || line1.substring(9, 17).trim();

                // Infer some metadata if not present (GP data is limited in metadata compared to SatCat)
                // We can map known constellations to countries/operators
                let country = "Unknown";
                let operator = "Unknown";
                let site = "Unknown";

                if (category === "STARLINK") {
                    country = "USA";
                    operator = "SpaceX";
                    site = "CCAFS"; // Common for Starlink
                } else if (category === "GPS") {
                    country = "USA";
                    operator = "US Space Force";
                } else if (category === "ISS") {
                    country = "Multinational";
                    operator = "NASA/ESA/Roscosmos/JAXA/CSA";
                } else if (category === "WEATHER") {
                    // Heuristic based on name
                    if (name.includes("NOAA") || name.includes("GOES")) {
                        country = "USA";
                        operator = "NOAA";
                    } else if (name.includes("METEOR")) {
                        country = "Russia";
                    } else if (name.includes("METEOSAT")) {
                        country = "Europe";
                        operator = "EUMETSAT";
                    }
                }

                satellites.push({
                    id: index,
                    name: name,
                    line1: line1,
                    line2: line2,
                    satrec: satrec,
                    category: category,
                    noradId: noradId,
                    intlDes: intlDes,
                    launchDate: item.EPOCH ? item.EPOCH.substring(0, 10) : "Unknown", // Using Epoch as proxy if Launch Date unavailable
                    site: site,
                    country: country,
                    launchYear: intlDes.startsWith("19") || intlDes.startsWith("20") ? intlDes.substring(0, 4) : "Unknown",
                    objectType: item.OBJECT_TYPE || "PAYLOAD"
                });
            }
        } catch (e) {
            // Skip invalid items
        }
    });

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
