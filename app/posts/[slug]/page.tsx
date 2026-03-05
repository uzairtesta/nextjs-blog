import { prisma } from '@/lib/db';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 0;

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await prisma.blogPost.findUnique({ where: { slug } });
        if (!post) return { title: 'Post Not Found' };
        return {
            title: `${post.title} — Smart Blog`,
            description: post.excerpt || post.title,
        };
    } catch {
        return { title: 'Blog Post' };
    }
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;

    let post;
    try {
        post = await prisma.blogPost.findUnique({
            where: { slug, published: true }
        });
    } catch {
        notFound();
    }

    if (!post) notFound();

    const readTime = `${Math.max(1, Math.ceil(post.content.length / 1000))} min read`;

    return (
        <article className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors text-sm"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <time>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</time>
                    <span>•</span>
                    <span>{readTime}</span>
                </div>
                {post.tags && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.split(',').map((tag, i) => (
                            <span key={i} className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
                {post.excerpt && (
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-4">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.content.split('\n\n').map((block, i) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;

                    // Heading support
                    if (trimmed.startsWith('### '))
                        return <h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{trimmed.slice(4)}</h3>;
                    if (trimmed.startsWith('## '))
                        return <h2 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">{trimmed.slice(3)}</h2>;
                    if (trimmed.startsWith('# '))
                        return <h1 key={i} className="text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4">{trimmed.slice(2)}</h1>;

                    // List support
                    if (trimmed.match(/^[\-\*\d+\.]\s/m)) {
                        const items = trimmed.split('\n').filter(l => l.trim());
                        return (
                            <ul key={i} className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 mb-6">
                                {items.map((item, j) => (
                                    <li key={j}>{item.replace(/^[\-\*]\s|^\d+\.\s/, '')}</li>
                                ))}
                            </ul>
                        );
                    }

                    // Bold text support
                    const renderInline = (text: string) => {
                        const parts = text.split(/(\*\*.*?\*\*)/g);
                        return parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        });
                    };

                    // Paragraph
                    return (
                        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            {trimmed.split('\n').map((line, j, arr) => (
                                <span key={j}>
                                    {renderInline(line)}
                                    {j < arr.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link
                    href="/"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                    ← Back to all posts
                </Link>
            </div>
        </article>
    );
}
