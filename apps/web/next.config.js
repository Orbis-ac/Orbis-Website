/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.orbis.place',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
