/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Static export for minimal runtime
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '', // For static assets only
    trailingSlash: true,
    images: {
        unoptimized: true // Required for static export
    }
};

module.exports = nextConfig;
