/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
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
