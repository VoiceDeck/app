/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },

  staticPageGenerationTimeout: 300,

  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "directus.voicedeck.org",
        protocol: "https",
      },
    ],
  },
  headers() {
    return [
      {
        source: "/api/wallet-generate",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/reports",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/reports",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
