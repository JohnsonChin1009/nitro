import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "fsmwldyfybsryktkoyzt.supabase.co",
        port: "",
      }
    ]
  }
}
export default nextConfig;
