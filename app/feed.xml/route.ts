import { prisma } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://example.com${basePath}`;

    let posts: any[] = [];
    let siteSettings: any = null;
    try {
        [posts, siteSettings] = await Promise.all([
            prisma.blogPost.findMany({
                where: { published: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            (prisma as any).siteSettings.findUnique({ where: { id: 'default' } }),
        ]);
    } catch { }

    const blogTitle = siteSettings?.blogName || 'Smart Blog';
    const blogDescription = siteSettings?.description || 'A lightweight, database-powered blog';

    const items = posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blogTitle}</title>
    <link>${siteUrl}</link>
    <description>${blogDescription}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
