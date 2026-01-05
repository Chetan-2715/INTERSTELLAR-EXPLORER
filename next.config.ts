import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false, // This hides the static/dynamic "N" indicator
    buildActivity: false, // This hides the spinning compilation icon
  } as any,
};

export default nextConfig;
