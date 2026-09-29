# Smart Blog - Lightweight Blog Template

A lightweight blog template built with Next.js 14 and Prisma/SQLite, optimized for free-tier deployments with minimal resource usage.

## Features

- ✅ **Prisma + SQLite** - Database-powered content management
- ✅ **CRUD API Routes** - Full blog post management via REST API
- ✅ **Admin Setup Panel** - Create, edit, and delete posts from the browser
- ✅ **JWT Authentication** - Secure owner session management
- ✅ **Import/Export** - Data portability with JSON import and export
- ✅ **Site Settings** - Configurable blog name, description, author info
- ✅ **RSS Feed** - Auto-generated feed.xml
- ✅ **Image Support** - Inline image handling for blog posts
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS** - Modern styling
- ✅ **SEO Friendly** - Pre-rendered pages

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
app/
├── api/
│   ├── auth/route.ts       # JWT authentication
│   ├── posts/route.ts      # Blog post CRUD
│   ├── settings/route.ts   # Site settings API
│   ├── data/
│   │   ├── export/route.ts # Data export
│   │   ├── import/route.ts # Data import
│   │   └── clear/route.ts  # Data cleanup
│   └── logout/route.ts     # Session logout
├── setup/                  # Admin panel
├── posts/[slug]/           # Dynamic blog post pages
├── about/                  # About page
└── feed.xml/               # RSS feed
prisma/
├── schema.prisma           # Database schema (SQLite)
lib/
├── db.ts                   # Prisma client singleton
├── hooks/
│   └── useOwnerSession.ts  # Auth hook
```

## Deployment

After building, the application runs as a Next.js server:

1. Set `DATABASE_URL` environment variable (defaults to `file:./data/blog.db`)
2. Run `npm run build` (handles Prisma generation and DB setup automatically)
3. Run `npm start` to serve
4. Deploy to any Node.js host (Vercel, container, VPS, etc.)

## Resource Requirements

- **Build Time**: ~200MB RAM
- **Runtime**: ~150MB RAM
- **Storage**: <50MB (excluding uploaded images)

## License

MIT
