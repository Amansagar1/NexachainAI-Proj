/** @type {import('next').NextConfig} */
const getBackendUrl = () => {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/api\/?$/, '');
  if (process.env.BACKEND_API_URL) return process.env.BACKEND_API_URL.replace(/\/api\/?$/, '');
  if (
    process.env.NEXT_PUBLIC_API_BASE_URL &&
    !process.env.NEXT_PUBLIC_API_BASE_URL.startsWith('/')
  ) {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PUBLIC_API_BASE_URL.includes('localhost')
    ) {
      return '';
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/?$/, '');
  }
  return 'http://localhost:5000';
};

const backendUrl = getBackendUrl();

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!backendUrl) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
