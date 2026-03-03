import { NextResponse } from 'next/server';

export async function GET() {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const response = NextResponse.redirect(
        new URL(`${base}/`, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    );
    response.cookies.set('pl_owner', '', { maxAge: 0, path: base || '/' });
    return response;
}
