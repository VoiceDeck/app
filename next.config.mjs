/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");
		return config;
	},
	images: {
		domains: ["directus.vd-dev.org"],
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
