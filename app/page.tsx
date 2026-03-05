import { prisma } from '@/lib/db';
import BlogHome from './BlogHome';

export const revalidate = 0;

// Default seed posts for empty databases
const defaultPosts = [
    {
        slug: 'welcome',
        title: 'Welcome to Smart Blog',
        content: 'This is a lightweight blog template built with Next.js 14, now powered by a database for easy content management.\n\n## Features\n\n- **Database-powered**: Create, edit, and delete posts from the setup page\n- **Data persists**: Your posts survive redeployments\n- **Dark mode**: Toggle between light and dark themes\n- **Search**: Find posts instantly with client-side search\n- **RSS feed**: Subscribers can follow at /feed.xml\n- **Low RAM**: Uses SQLite — perfect for free-tier hosting',
        excerpt: 'Discover how this lightweight blog template can help you deploy on free-tier hosting with minimal resources.',
        tags: 'Welcome, Guide',
        published: true,
        createdAt: new Date('2024-02-09'),
    },
    {
        slug: 'getting-started',
        title: 'Getting Started with Smart Blog',
        content: '## Adding Posts\n\nClick the **Setup** button in the header (visible to owners only) to access the admin panel.\n\nFrom there you can:\n1. Create new blog posts with markdown content\n2. Edit existing posts\n3. Delete posts you no longer need\n\n## Customization\n\n- Edit the header in `components/Header.tsx`\n- Change colors in `tailwind.config.ts`\n- Update the About page in `app/about/page.tsx`\n\nThat\'s it! Your blog is ready.',
        excerpt: 'Learn how to add your first blog post and customize this template.',
        tags: 'Tutorial, Setup',
        published: true,
        createdAt: new Date('2024-02-08'),
    },
];

export default async function Home() {
    let posts: any[] = [];

    try {
        const dbPosts = await prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
        });

        if (dbPosts.length === 0) {
            // Seed default posts on first load
            for (const p of defaultPosts) {
                try {
                    await prisma.blogPost.create({ data: p });
                } catch { /* duplicate slug, skip */ }
            }
            posts = defaultPosts.map(p => ({
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                date: p.createdAt.toISOString(),
                readTime: `${Math.max(1, Math.ceil(p.content.length / 1000))} min read`,
            }));
        } else {
            posts = dbPosts.map(p => ({
                slug: p.slug,
                title: p.title,
                excerpt: p.excerpt,
                date: p.createdAt.toISOString(),
                readTime: `${Math.max(1, Math.ceil(p.content.length / 1000))} min read`,
            }));
        }
    } catch (error) {
        // DB not ready yet — show defaults
        posts = defaultPosts.map(p => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.createdAt.toISOString(),
            readTime: `${Math.max(1, Math.ceil(p.content.length / 1000))} min read`,
        }));
    }

    return <BlogHome posts={posts} />;
}
