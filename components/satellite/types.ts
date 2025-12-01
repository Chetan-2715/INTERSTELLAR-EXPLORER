import * as satellite from "satellite.js";

export interface Satellite {
    id: number;
    name: string;
    line1: string;
    line2: string;
    satrec: satellite.SatRec;
    category: string;
    noradId?: number;
    intlDes?: string;
    launchDate?: string;
    site?: string;
    country?: string;
    launchYear?: string;
    objectType?: string;
}

export interface SatellitePosition {
    lat: number;
    lng: number;
    height: number;
    x: number;
    y: number;
    z: number;
    velocity: any;
}
