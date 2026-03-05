import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/settings — fetch site settings
export async function GET() {
    try {
        let settings = await (prisma as any).siteSettings.findUnique({ where: { id: 'default' } });
        if (!settings) {
            settings = await (prisma as any).siteSettings.create({
                data: { id: 'default' }
            });
        }
        return NextResponse.json({ settings });
    } catch (error: any) {
        return NextResponse.json({ settings: null, error: error.message }, { status: 200 });
    }
}

// PUT /api/settings — update site settings (owner only)
export async function PUT(request: NextRequest) {
    const ownerCookie = request.cookies.get('pl_owner');
    if (ownerCookie?.value !== '1') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const settings = await (prisma as any).siteSettings.upsert({
            where: { id: 'default' },
            update: {
                blogName: body.blogName || 'Smart Blog',
                description: body.description || '',
                authorName: body.authorName || '',
                authorBio: body.authorBio || '',
                footerText: body.footerText || '',
            },
            create: {
                id: 'default',
                blogName: body.blogName || 'Smart Blog',
                description: body.description || '',
                authorName: body.authorName || '',
                authorBio: body.authorBio || '',
                footerText: body.footerText || '',
            },
        });
        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
