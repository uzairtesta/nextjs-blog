/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: export' to enable API routes for CRUD functionality
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // For routing AND static assets
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
