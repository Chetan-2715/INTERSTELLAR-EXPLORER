export const SPACE_WEATHER_CONFIG = {
    provider: "NASA DONKI (Database Of Notifications, Knowledge, Information)",
    baseUrl: "https://api.nasa.gov/DONKI",
    endpoints: {
        solarFlare: "/FLR",
        geomagneticStorm: "/GST",
        coronalMassEjection: "/CME",
    },
    params: {
        startDate: "yyyy-MM-dd",
        endDate: "yyyy-MM-dd",
    },
    updateInterval: 10000, // 10 seconds
    fieldsToExtract: [
        "flrID",
        "beginTime",
        "peakTime",
        "endTime",
        "classType",
        "sourceLocation",
    ],
};

// Usage Example:
// GET https://api.nasa.gov/DONKI/FLR?startDate=2024-01-01&endDate=2024-01-30&api_key=DEMO_KEY
