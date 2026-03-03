import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || 'http';
    const origin = `${proto}://${host}`;

    const response = NextResponse.redirect(new URL(`${base}/`, origin));
    response.cookies.set('pl_owner', '', { maxAge: 0, path: base || '/' });
    return response;
}
