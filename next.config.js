/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep existing static files accessible
  async rewrites() {
    return [
      {
        source: '/founders-beta/participate.html',
        destination: '/participate.html',
      },
    ]
  },
}

module.exports = nextConfig
