import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        // Verify seed secret from header
        const secret = req.headers.get('x-seed-secret');
        const expectedSecret = process.env.SEED_SECRET;

        if (!expectedSecret || secret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Unauthorized - Invalid seed secret' },
                { status: 401 }
            );
        }

        // Seed blog posts
        const contentDir = path.join(process.cwd(), 'content', 'blog');

        // Ensure content directory exists
        if (!fs.existsSync(contentDir)) {
            fs.mkdirSync(contentDir, { recursive: true });
        }

        // Sample blog posts
        const samplePosts = [
            {
                filename: 'getting-started.md',
                content: `---
title: "Getting Started with Next.js Blog"
date: "2024-01-15"
excerpt: "Learn how to set up and customize your Next.js blog with this comprehensive guide."
author: "Blog Admin"
tags: ["tutorial", "getting-started"]
---

# Welcome to Your New Blog!

This is a sample blog post to help you get started. You can edit or delete this post and create your own content.

## What You Can Do

- Write posts in Markdown format
- Add images and code snippets
- Organize content with tags
- Customize the design

## Next Steps

1. Delete this sample post
2. Create your first real blog post
3. Customize your blog's appearance
4. Share your blog with the world!

Happy blogging! 🚀
`
            },
            {
                filename: 'markdown-guide.md',
                content: `---
title: "Markdown Formatting Guide"
date: "2024-01-14"
excerpt: "A quick reference for formatting your blog posts with Markdown syntax."
author: "Blog Admin"
tags: ["markdown", "reference"]
---

# Markdown Formatting Guide

Markdown makes it easy to format your blog posts. Here's a quick reference:

## Headings

Use \`#\` for headings:
- \`# H1\`
- \`## H2\`
- \`### H3\`

## Text Formatting

- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- ~~Strikethrough~~: \`~~text~~\`

## Lists

Unordered:
- Item 1
- Item 2
- Item 3

Ordered:
1. First
2. Second
3. Third

## Code

Inline code: \`const x = 10;\`

Code blocks:
\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

## Links and Images

- Link: \`[text](url)\`
- Image: \`![alt](url)\`

That's all you need to get started! Happy writing! ✍️
`
            },
            {
                filename: 'why-choose-nextjs.md',
                content: `---
title: "Why Choose Next.js for Your Blog?"
date: "2024-01-13"
excerpt: "Discover the benefits of using Next.js for building modern, fast, and SEO-friendly blogs."
author: "Blog Admin"
tags: ["nextjs", "performance", "seo"]
---

# Why Choose Next.js for Your Blog?

Next.js is an excellent choice for building modern blogs. Here's why:

## ⚡ Lightning Fast

- Static site generation for instant page loads
- Automatic code splitting
- Optimized images and fonts

## 🎯 SEO Friendly

- Server-side rendering support
- Automatic sitemap generation
- Meta tags and OpenGraph support

## 🛠️ Developer Experience

- Hot module replacement
- TypeScript support out of the box
- Great documentation and community

## 🚀 Deploy Anywhere

- Deploy to Vercel, Netlify, or any platform
- Easy CI/CD integration
- Scalable and reliable

## 📱 Mobile First

- Responsive by default
- Progressive Web App support
- Excellent performance on mobile devices

Start building your blog with Next.js today!
`
            }
        ];

        // Write sample posts
        let createdCount = 0;
        for (const post of samplePosts) {
            const filePath = path.join(contentDir, post.filename);

            // Only create if doesn't exist (avoid duplicates)
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, post.content, 'utf-8');
                createdCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: createdCount > 0
                ? `✅ Successfully created ${createdCount} sample blog post${createdCount > 1 ? 's' : ''}!`
                : '✅ Sample posts already exist!'
        });

    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Failed to seed content', details: error.message },
            { status: 500 }
        );
    }
}
