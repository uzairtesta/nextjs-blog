'use client';

import { useEffect, useState } from 'react';

const COOKIE_NAME = 'pl_owner';

/**
 * True when the visitor has owner access (HttpOnly pl_owner cookie set by /api/auth).
 * Setup link and /setup page should only show when this is true (and NEXT_PUBLIC_SHOW_SETUP_PAGE).
 */
export function useOwnerSession() {
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const showSetup = process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true';

        if (!showSetup) {
            setIsOwner(false);
            setIsLoading(false);
            return;
        }

        // Check for HttpOnly owner cookie (set by /api/auth after JWT verification)
        const cookies = document.cookie.split('; ');
        const hasSession = cookies.some(c => c.startsWith(`${COOKIE_NAME}=`));

        setIsOwner(hasSession);
        setIsLoading(false);
    }, []);

    return { isOwner, isLoading };
}
