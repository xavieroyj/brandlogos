/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-34cdca4199aa477aa9c2bf19f5a12a22.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;