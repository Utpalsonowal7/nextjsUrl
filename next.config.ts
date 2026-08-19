import type { NextConfig } from "next";

const nextConfig: NextConfig = {
     images: {
          remotePatterns: [
               {
                    protocol: "https",
                    hostname: "reactqrcode.com",
               },
          ],
     },
};

export default nextConfig;
