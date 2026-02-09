import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import { format } from 'date-fns';

export default function Home() {
    const posts = getAllPosts();

    return (
        <div>
            <section className="mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Smart Blog
                </h1>
                <p className="text-xl text-gray-600">
                    A lightweight, static blog template optimized for minimal resource usage.
                    Perfect for free-tier deployments with under 150MB RAM footprint.
                </p>
            </section>

            <section>
                <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
                <div className="space-y-6">
                    {posts.map((post) => (
                        <article key={post.slug} className="border-b pb-6">
                            <Link href={`/posts/${post.slug}`} className="group">
                                <h3 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <time>{format(new Date(post.date), 'MMMM dd, yyyy')}</time>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
