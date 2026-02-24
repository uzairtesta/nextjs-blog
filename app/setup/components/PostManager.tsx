'use client';

import { useState, useEffect } from 'react';

// fetch() doesn't respect Next.js basePath - must prefix manually
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface Post {
    filename: string;
    title: string;
    date: string;
    excerpt: string;
    tags: string;
}

export default function PostManager() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        tags: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Fetch posts
    const fetchPosts = async () => {
        try {
            const res = await fetch(`${BASE}/api/posts`);
            const data = await res.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            showMessage('error', 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleNew = () => {
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            tags: '',
            date: new Date().toISOString().split('T')[0]
        });
        setShowModal(true);
    };

    const handleEdit = async (post: Post) => {
        try {
            // Fetch full post content
            const res = await fetch(`${BASE}/content/blog/${post.filename}`);
            const fullContent = await res.text();

            // Extract content after frontmatter
            const contentMatch = fullContent.match(/---[\s\S]*?---\s*([\s\S]*)/);
            const content = contentMatch ? contentMatch[1].trim() : '';

            setEditingPost(post);
            setFormData({
                title: post.title,
                content,
                excerpt: post.excerpt,
                tags: post.tags,
                date: post.date
            });
            setShowModal(true);
        } catch (error) {
            showMessage('error', 'Failed to load post content');
        }
    };

    const handleDelete = async (filename: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            const res = await fetch(`${BASE}/api/posts?filename=${filename}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (res.ok) {
                showMessage('success', 'Post deleted successfully');
                fetchPosts();
            } else {
                showMessage('error', data.error || 'Failed to delete post');
            }
        } catch (error) {
            showMessage('error', 'Network error - could not delete post');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const method = editingPost ? 'PUT' : 'POST';
            const payload = editingPost
                ? { ...formData, filename: editingPost.filename }
                : formData;

            const res = await fetch(`${BASE}/api/posts`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                showMessage('success', editingPost ? 'Post updated!' : 'Post created!');
                setShowModal(false);
                fetchPosts();
            } else {
                showMessage('error', data.error || 'Failed to save post');
            }
        } catch (error) {
            showMessage('error', 'Network error - could not save post');
        } finally {
            setSaving(false);
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
            {/* Header with New Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Blog Posts</h3>
                    <p className="text-sm text-gray-600 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
                </button>
            </div>

            {/* Message Banner */}
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Posts List */}
            {posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                    <p className="text-gray-600 mb-4">Create your first post to get started</p>
                    <button
                        onClick={handleNew}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create First Post
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div
                            key={post.filename}
                            className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                                    {post.excerpt && (
                                        <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {post.date || 'No date'}
                                        </span>
                                        {post.tags && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                {post.tags}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.filename, post.title)}
                                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingPost ? 'Edit Post' : 'New Post'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Content * (Markdown)</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                    rows={12}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                                <input
                                    type="text"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Brief summary..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="React, Next.js, Tutorial"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
