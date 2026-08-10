import type { NextConfig } from "next";

const nextConfig: NextConfig = {

     allowedDevOrigins: ["10.170.39.191"],
     images: {
          remotePatterns: [
               {
                    protocol: "https",
                    hostname: "cdn.simpleicons.org",
               },
          ],
     },
};

export default nextConfig;
