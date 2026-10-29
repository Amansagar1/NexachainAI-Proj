/** @type {import('next').NextConfig} */
const backendUrl =
  process.env.BACKEND_URL ||
  process.env.BACKEND_API_URL ||
  (process.env.NEXT_PUBLIC_API_BASE_URL && !process.env.NEXT_PUBLIC_API_BASE_URL.startsWith('/')
    ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, '')
    : 'http://localhost:5000');

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
