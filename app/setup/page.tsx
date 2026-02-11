'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostManager from './components/PostManager';

export default function SetupPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-lg text-gray-700">Loading...</p>
                </div>
            </div>
        }>
            <SetupPageContent />
        </Suspense>
    );
}

function SetupPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOwner, setIsOwner] = useState<boolean | null>(null);

    useEffect(() => {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const showSetup = process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true';

        // Feature disabled (admin demo or public deployment)
        if (!showSetup) {
            router.replace(basePath || '/');
            return;
        }

        // Step 1: Check owner query parameter
        const ownerParam = searchParams.get('owner');
        const ownerKey = process.env.NEXT_PUBLIC_OWNER_KEY;

        if (ownerParam && ownerParam === ownerKey) {
            // Valid owner key in URL
            // Set cookie (lasts 24 hours)
            document.cookie = `__owner_session=true; path=${basePath || '/'}; max-age=86400; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;

            // Clean URL (remove ?owner=)
            router.replace(`${basePath}/setup`);
            setIsOwner(true);
            return;
        }

        // Step 2: Check existing session cookie
        const cookies = document.cookie.split('; ');
        const hasSession = cookies.some(c => c.startsWith('__owner_session=true'));

        if (hasSession) {
            setIsOwner(true);
        } else {
            // No valid session → redirect to public site
            router.replace(basePath || '/');
        }
    }, [searchParams, router]);

    // Loading state
    if (isOwner === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-lg text-gray-700">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Authenticated owner
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Setup & Management</h1>
                                <p className="text-sm text-gray-500">Manage your blog content and settings</p>
                            </div>
                        </div>
                        <a
                            href={process.env.NEXT_PUBLIC_BASE_PATH || '/'}
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            ← Back to Site
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-8">
                <SetupDashboard />
            </main>
        </div>
    );
}

function SetupDashboard() {
    const [activeTab, setActiveTab] = useState('seed');
    const [seeding, setSeeding] = useState(false);
    const [seedStatus, setSeedStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSeedData = async () => {
        setSeeding(true);
        setSeedStatus({ type: null, message: '' });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-seed-secret': process.env.NEXT_PUBLIC_SEED_SECRET || ''
                }
            });

            const data = await res.json();

            if (res.ok) {
                setSeedStatus({ type: 'success', message: data.message || 'Content seeded successfully!' });
            } else {
                setSeedStatus({ type: 'error', message: data.error || 'Failed to seed content' });
            }
        } catch (error) {
            setSeedStatus({ type: 'error', message: 'Network error - could not seed content' });
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-2">👋 Welcome to Your Blog Admin Panel</h2>
                <p className="text-blue-100 mb-4">
                    Use this panel to manage your blog content. Seed sample posts to get started or create your own content.
                </p>
                <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-sm text-blue-100">Status</div>
                        <div className="font-semibold">🟢 Active</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                        <div className="text-sm text-blue-100">Access Level</div>
                        <div className="font-semibold">✨ Owner</div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6 px-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('seed')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'seed'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            🌱 Seed Content
                        </button>
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'posts'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            📝 Manage Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'settings'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            ⚙️ Settings
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'seed' && (
                        <div className="max-w-2xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seed Sample Content</h3>
                            <p className="text-gray-600 mb-6">
                                Populate your blog with sample posts to see how it works. You can edit or delete them later.
                            </p>

                            {seedStatus.type && (
                                <div className={`mb-6 p-4 rounded-lg ${seedStatus.type === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                    <div className="flex items-center gap-2">
                                        {seedStatus.type === 'success' ? '✅' : '❌'}
                                        <span className="font-medium">{seedStatus.message}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleSeedData}
                                disabled={seeding}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                            >
                                {seeding ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Seeding...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Seed Sample Posts
                                    </>
                                )}
                            </button>

                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    What happens when you seed?
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-1 ml-7">
                                    <li>• 3-5 sample blog posts will be created</li>
                                    <li>• Each post includes title, content, and metadata</li>
                                    <li>• You can edit or delete any seeded content</li>
                                    <li>• Safe to run multiple times (won't duplicate)</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'posts' && (
                        <PostManager />
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Settings</h3>
                            <p className="text-gray-600 mb-6">
                                Configure your blog settings and preferences.
                            </p>

                            <div className="space-y-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Blog Title
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="My Awesome Blog"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        defaultValue="A blog about web development, design, and technology."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                                        Save Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Need Help?
                </h3>
                <p className="text-sm text-gray-600">
                    This is your private admin panel. The public URL (without ?owner= query) shows a view-only version of your blog.
                    Only you can access this setup page using the admin link from your dashboard.
                </p>
            </div>
        </div >
    );
}
