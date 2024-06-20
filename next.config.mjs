/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname:
          process.env.NEXT_PUBLIC_DEPLOY_ENV === "production"
            ? "directus.voicedeck.org"
            : "directus.vd-dev.org",
        protocol: "https",
      },
      {
        hostname: "directus.voicedeck.org",
        protocol: "https",
      },
      {
        hostname: "clipground.com",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;
