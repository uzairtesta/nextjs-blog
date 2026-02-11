/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: export' to enable API routes for CRUD functionality
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '', // For static assets only
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
