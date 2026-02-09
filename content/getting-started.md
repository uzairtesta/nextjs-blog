---
title: "Getting Started with Smart Blog"
date: "2024-02-08"
excerpt: "Learn how to add your first blog post and customize this template."
readTime: "5 min read"
---

# Getting Started

Adding content to Smart Blog is simple. Just create markdown files in the `content/` directory.

## Adding a New Post

Create a file like `content/my-post.md`:

```markdown
---
title: My First Post
date: 2024-02-09
excerpt: A short description of the post
readTime: 4 min read
---

Your content here...
```

## Customization

- Edit `app/layout.tsx` to change site metadata
- Modify `components/Header.tsx` for navigation  
- Update Tailwind config for theming

## Deployment

This template uses Next.js static export, which means:

1. Run `npm run build` to generate static files
2. The `out/` directory contains your entire site
3. Deploy the `out/` directory to any static host
4. No server runtime needed!

## Resource Usage

Smart Blog is optimized for minimal resource consumption:

- **Build**: ~200MB RAM during build (on platform server)
- **Runtime**: 50-150MB RAM (just serving static files)
- **Free Tier Compatible**: ✅ Works perfectly on 500MB containers

That's it! Your blog is ready to deploy.
