import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const SIGNING_SECRET = process.env.JWT_SIGNING_SECRET;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
const COOKIE_NAME = 'pl_owner';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function verifyToken(token: string): { valid: boolean; expired?: boolean } {
    if (!SIGNING_SECRET) return { valid: false };

    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signatureB64] = parts;

    const expectedSig = createHmac('sha256', SIGNING_SECRET)
        .update(payloadB64)
        .digest('base64url');

    let sigMatch = false;
    try {
        sigMatch = timingSafeEqual(
            Buffer.from(signatureB64, 'base64url'),
            Buffer.from(expectedSig, 'base64url')
        );
    } catch {
        return { valid: false };
    }

    if (!sigMatch) return { valid: false };

    try {
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
        if (payload.exp < Math.floor(Date.now() / 1000)) {
            return { valid: false, expired: true };
        }
        return { valid: true };
    } catch {
        return { valid: false };
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const result = verifyToken(token);

    if (!result.valid) {
        const redirectUrl = `${BASE_PATH}/`;
        return NextResponse.redirect(new URL(redirectUrl, req.url), 302);
    }

    const response = NextResponse.redirect(new URL(`${BASE_PATH}/setup`, req.url), 302);
    response.cookies.set(COOKIE_NAME, '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
        secure: process.env.NODE_ENV === 'production',
    });

    return response;
}

export async function DELETE(_req: NextRequest) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
    return response;
}
