/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback.fs = false;
		}

		return config;
	},
	images: {
		domains: ['thrangra.sirv.com', 'cdn.akamai.steamstatic.com'],
	},
};

module.exports = nextConfig;
