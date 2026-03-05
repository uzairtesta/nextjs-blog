'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Post {
    slug: string;
    title: string;
    excerpt?: string;
    date: string;
    readTime: string;
    tags?: string;
    image?: string | null;
}

export default function BlogHome({ posts }: { posts: Post[] }) {
    const [search, setSearch] = useState('');
    const [activeTag, setActiveTag] = useState('');

    // Collect all unique tags
    const allTags = [...new Set(
        posts.flatMap(p => (p.tags || '').split(',').map(t => t.trim()).filter(Boolean))
    )].sort();

    const filtered = posts.filter(p => {
        const matchSearch = !search.trim() ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.excerpt || '').toLowerCase().includes(search.toLowerCase());
        const matchTag = !activeTag ||
            (p.tags || '').split(',').map(t => t.trim()).includes(activeTag);
        return matchSearch && matchTag;
    });

    return (
        <div>
            {/* Hero Banner */}
            <section className="mb-12 py-14 px-6 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23fff'/%3E%3C/svg%3E\")" }} />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow">
                        ✍️ Smart Blog
                    </h1>
                    <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
                        Fast, lightweight thoughts — no database, just great writing.
                    </p>
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search posts..."
                            className="w-full px-5 py-3 pr-12 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                        />
                        <svg className="absolute right-4 top-3.5 w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Tag Filter Chips */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveTag('')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!activeTag
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeTag === tag
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Posts List */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {search ? `Results for "${search}"` : activeTag ? `Tagged: ${activeTag}` : 'Latest Posts'}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filtered.length} post{filtered.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No posts found{search ? ` for "${search}"` : activeTag ? ` tagged "${activeTag}"` : ''}
                        </p>
                        <button
                            onClick={() => { setSearch(''); setActiveTag(''); }}
                            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/posts/${post.slug}`}
                                className="group flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md bg-white dark:bg-gray-800 transition-all duration-200"
                            >
                                {/* Cover image */}
                                {post.image && (
                                    <div className="w-full md:w-32 h-32 md:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
                                        {post.title}
                                    </h3>
                                    {post.excerpt && (
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    {/* Tags */}
                                    {post.tags && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {post.tags.split(',').map((t, i) => t.trim() && (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                    <time>{format(new Date(post.date), 'MMM dd, yyyy')}</time>
                                    <span className="hidden md:block">•</span>
                                    <span className="hidden md:block">{post.readTime}</span>
                                    <svg className="w-4 h-4 text-blue-500 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
