/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Static export for minimal runtime
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // Support subpath deployments
    trailingSlash: true,
    images: {
        unoptimized: true // Required for static export
    }
};

module.exports = nextConfig;
