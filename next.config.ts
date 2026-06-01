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
        source: '/trouver-une-experience',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/trouver-une-activite',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/evenements',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/evenements/:path*',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/activites',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/activites/:path*',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/cours',
        destination: '/restaurants',
        permanent: true,
      },
      {
        source: '/cours/:path*',
        destination: '/restaurants',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
