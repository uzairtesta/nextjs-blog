/** @type {import('next').NextConfig} */

// Load .env files explicitly before reading process.env
// This ensures NEXT_PUBLIC_BASE_PATH is available when this config file is loaded
try {
    require('dotenv').config({ path: './.env.production.local' });
    require('dotenv').config({ path: './.env' });
} catch (e) {
    // dotenv not installed or .env files don't exist yet - will use process.env from build command
}

const nextConfig = {
    // Removed 'output: export' to enable API routes for CRUD functionality
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // For routing AND static assets
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
