import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// GET /api/data/export — export all blog posts as JSON (owner only)
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const isOwner = cookieStore.get('pl_owner')?.value === '1';
    if (!isOwner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const blogPosts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const exportData = {
            _meta: {
                exportedAt: new Date().toISOString(),
                template: 'nextjs-blog-smart',
                version: '1.0',
            },
            blogPosts,
        };

        const json = JSON.stringify(exportData, null, 2);

        return new NextResponse(json, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="blog-backup-${new Date().toISOString().slice(0, 10)}.json"`,
            },
        });
    } catch (error: any) {
        console.error('[Export] Error:', error.message);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
