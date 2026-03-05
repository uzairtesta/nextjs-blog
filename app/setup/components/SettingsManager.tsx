'use client';

import { useState, useEffect } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Settings {
    blogName: string;
    description: string;
    authorName: string;
    authorBio: string;
    footerText: string;
}

export default function SettingsManager() {
    const [settings, setSettings] = useState<Settings>({
        blogName: 'Smart Blog',
        description: 'A lightweight, database-powered blog',
        authorName: '',
        authorBio: '',
        footerText: 'Built with Next.js | Optimized for 500MB Containers',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetch(`${BASE}/api/settings`)
            .then(r => r.json())
            .then(data => { if (data.settings) setSettings(data.settings); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${BASE}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Settings saved!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Site Settings</h3>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blog Name</label>
                    <input
                        type="text"
                        value={settings.blogName}
                        onChange={e => setSettings({ ...settings, blogName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blog Description</label>
                    <input
                        type="text"
                        value={settings.description}
                        onChange={e => setSettings({ ...settings, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                        <input
                            type="text"
                            value={settings.authorName}
                            onChange={e => setSettings({ ...settings, authorName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                        <input
                            type="text"
                            value={settings.footerText}
                            onChange={e => setSettings({ ...settings, footerText: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
                    <textarea
                        value={settings.authorBio}
                        onChange={e => setSettings({ ...settings, authorBio: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                        rows={3}
                        placeholder="A short bio about you..."
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold disabled:opacity-50 transition-all"
            >
                {saving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
}
