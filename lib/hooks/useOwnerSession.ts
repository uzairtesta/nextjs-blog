'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to check if user has owner session
 * Returns true if valid owner cookie exists and SHOW_SETUP_PAGE is enabled
 */
export function useOwnerSession() {
    const [isOwner, setIsOwner] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if setup feature is enabled
        const showSetup = process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true';

        if (!showSetup) {
            setIsOwner(false);
            setIsLoading(false);
            return;
        }

        // Check for owner session cookie
        const cookies = document.cookie.split('; ');
        const hasSession = cookies.some(c => c.startsWith('__owner_session=true'));

        setIsOwner(hasSession);
        setIsLoading(false);
    }, []);

    return { isOwner, isLoading };
}

/**
 * Hook to get environment config safely
 */
export function useEnvConfig() {
    return {
        showSetup: process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true',
        ownerKey: process.env.NEXT_PUBLIC_OWNER_KEY || '',
        seedSecret: process.env.NEXT_PUBLIC_SEED_SECRET || ''
    };
}
