// Server component - loads posts then passes to client search UI
import { getAllPosts } from '@/lib/posts';
import BlogHome from './BlogHome';

export default function Home() {
    const posts = getAllPosts();
    return <BlogHome posts={posts} />;
}
