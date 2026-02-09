import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content');

export interface PostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    readTime: string;
    content: string;
}

export function getAllPosts(): PostData[] {
    // Handle case where content directory doesn't exist yet
    if (!fs.existsSync(postsDirectory)) {
        return getDefaultPosts();
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString(),
                excerpt: data.excerpt || '',
                readTime: data.readTime || '5 min read',
                content,
            };
        });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(fullPath)) {
            const defaultPosts = getDefaultPosts();
            return defaultPosts.find(p => p.slug === slug) || null;
        }
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            readTime: data.readTime,
            content,
        };
    } catch (error) {
        return null;
    }
}

function getDefaultPosts(): PostData[] {
    return [
        {
            slug: 'welcome',
            title: 'Welcome to Smart Blog',
            date: '2024-02-09',
            excerpt: 'Discover how this lightweight blog template can help you deploy on free-tier hosting with minimal resources.',
            readTime: '3 min read',
            content: `# Welcome to Smart Blog

This is a lightweight, static blog template built with Next.js 14 and optimized for minimal resource usage.

## Why Smart Blog?

- **Static Export**: No server runtime needed, just serve static files
- **Minimal RAM**: Uses only 50-150MB RAM (perfect for free tier!)
- **Fast**: Pre-rendered pages load instantly
- **SEO-Friendly**: All pages are server-rendered at build time

## Features

- Markdown-based content
- Tailwind CSS styling
- TypeScript support
- Zero database dependencies
- File-system based routing

Start writing your blog posts in the \`content/\` directory and deploy with confidence!`,
        },
        {
            slug: 'getting-started',
            title: 'Getting Started with Smart Blog',
            date: '2024-02-08',
            excerpt: 'Learn how to add your first blog post and customize this template.',
            readTime: '5 min read',
            content: `# Getting Started

Adding content to Smart Blog is simple. Just create markdown files in the \`content/\` directory.

## Adding a New Post

Create a file like \`content/my-post.md\`:

\`\`\`markdown
---
title: My First Post
date: 2024-02-09
excerpt: A short description of the post
readTime: 4 min read
---

Your content here...
\`\`\`

## Customization

- Edit \`app/layout.tsx\` to change site metadata
- Modify \`components/Header.tsx\` for navigation
- Update Tailwind config for theming

That's it! Your blog is ready to deploy.`,
        },
    ];
}
