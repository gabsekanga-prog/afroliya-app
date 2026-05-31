import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/trouver-une-activite',
        destination: '/trouver-une-experience',
        permanent: true,
      },
      {
        source: '/cours',
        destination: '/activites',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
