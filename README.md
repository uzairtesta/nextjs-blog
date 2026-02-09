# Smart Blog - Lightweight Static Template

A lightweight, static blog template built with Next.js 14, optimized for free-tier deployments with minimal resource usage (50-150MB RAM).

## Features

- ✅ **Static Export** - No server runtime, just static files
- ✅ **Minimal RAM** - 50-150MB footprint (500MB container compatible)
- ✅ **No Database** - Markdown-based content
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Modern styling
- ✅ **SEO Friendly** - Pre-rendered pages
- ✅ **Fast** - Instant page loads

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Serve static export
npm start
```

## Adding Content

Create markdown files in the `content/` directory:

```markdown
---
title: "My Post Title"
date: "2024-02-09"
excerpt: "Short description"
readTime: "5 min read"
---

Your markdown content here...
```

## Deployment

This template uses `output: 'export'` for static generation. After building:

1. Static files are in the `out/` directory
2. Deploy to any static host (Vercel, Netlify, etc.)
3. Or use this platform's container deployment

## Resource Requirements

- **Build Time**: ~200MB RAM (platform server handles this)
- **Runtime**: 50-150MB RAM (perfect for free tier!)
- **Storage**: <20MB

## Architecture

Unlike database-heavy templates (nextjs-commerce, nextjs-portfolio), this template:
- No Prisma / SQLite
- No API routes
- No `app.prepare()` overhead
- Pure static file serving

Perfect for free-tier users!

## License

MIT
