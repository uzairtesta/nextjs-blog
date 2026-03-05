import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// DELETE /api/data/clear — wipe all blog data (owner only)
export async function DELETE(request: NextRequest) {
    const cookieStore = await cookies();
    const isOwner = cookieStore.get('pl_owner')?.value === '1';
    if (!isOwner) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.blogPost.deleteMany({});
        try { await prisma.siteSettings.deleteMany({}); } catch { }

        return NextResponse.json({
            success: true,
            message: 'All blog data has been cleared.',
        });
    } catch (error: any) {
        console.error('[Clear] Error:', error.message);
        return NextResponse.json({ error: `Clear failed: ${error.message}` }, { status: 500 });
    }
}
