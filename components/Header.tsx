'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useOwnerSession } from '@/lib/hooks/useOwnerSession';

const THEME_KEY = 'blog_theme';

export default function Header() {
    const { isOwner } = useOwnerSession();
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [blogName, setBlogName] = useState('Smart Blog');

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY);
        const dark = stored === 'dark';
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
        setMounted(true);

        // Fetch site settings
        const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
        fetch(`${BASE}/api/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.settings?.blogName) {
                    setBlogName(data.settings.blogName);
                }
            })
            .catch(() => { });
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            SB
                        </span>
                        {blogName}
                    </Link>

                    {/* Nav */}
                    <nav className="flex gap-4 items-center">
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm">
                            Home
                        </Link>
                        <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm">
                            About
                        </Link>

                        {/* Dark Mode Toggle */}
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle dark mode"
                                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                            >
                                {isDark ? (
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>
                        )}

                        {isOwner && (
                            <Link
                                href="/setup"
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                            >
                                ⚙️ Setup
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
