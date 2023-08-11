/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/login/callback',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig