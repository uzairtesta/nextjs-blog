import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="prose prose-lg max-w-none">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <time>{format(new Date(post.date), 'MMMM dd, yyyy')}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>
            </header>
            <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
            </div>
        </article>
    );
}
