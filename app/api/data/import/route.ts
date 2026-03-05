import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// POST /api/data/import — import blog posts from JSON backup (owner only)
export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const isOwner = cookieStore.get('pl_owner')?.value === '1';
    if (!isOwner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();

        if (!data._meta || data._meta.template !== 'nextjs-blog-smart') {
            return NextResponse.json({ error: 'Invalid backup file. Must be a nextjs-blog-smart export.' }, { status: 400 });
        }

        let imported = 0;

        if (data.blogPosts?.length) {
            for (const p of data.blogPosts) {
                try {
                    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
                    if (!existing) {
                        await prisma.blogPost.create({
                            data: {
                                slug: p.slug,
                                title: p.title,
                                content: p.content,
                                excerpt: p.excerpt || '',
                                tags: p.tags || '',
                                published: p.published ?? true,
                                createdAt: new Date(p.createdAt),
                            }
                        });
                        imported++;
                    }
                } catch { }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Imported: ${imported} blog posts`,
            stats: { blogPosts: imported },
        });
    } catch (error: any) {
        console.error('[Import] Error:', error.message);
        return NextResponse.json({ error: `Import failed: ${error.message}` }, { status: 500 });
    }
}
