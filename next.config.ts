import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     /* config options here */

     allowedDevOrigins: ["10.230.129.191"],
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
