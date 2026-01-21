import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'razorpay.com',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      }
    ],
  },
};

export default nextConfig;
