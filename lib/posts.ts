// Blog posts are now stored in the database via Prisma.
// This file is kept for backward-compatibility but all data access
// should go through `@/lib/db` (prisma) instead.

export interface PostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    readTime: string;
    content: string;
}

// Legacy stub — use prisma.blogPost.findMany() instead
export function getAllPosts(): PostData[] {
    return [];
}

export function getPostBySlug(slug: string): PostData | null {
    return null;
}
