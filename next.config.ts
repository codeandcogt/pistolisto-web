/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pistolisto-statics-web.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;