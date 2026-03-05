import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Helper to check owner session from cookies
function isOwnerAuthenticated(request: NextRequest): boolean {
    const cookies = request.cookies;
    const ownerSession = cookies.get('pl_owner');
    const showSetup = process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true';

    return showSetup && ownerSession?.value === '1';
}

// Helper to generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// GET - List all blog posts
export async function GET(request: NextRequest) {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ posts });
    } catch (error: any) {
        console.error('Error fetching posts:', error);

        // If table doesn't exist yet, return empty + seed default posts
        if (error.message?.includes('does not exist') || error.code === 'P2021') {
            return NextResponse.json({ posts: [] });
        }

        return NextResponse.json(
            { error: 'Failed to fetch posts', details: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new post
export async function POST(request: NextRequest) {
    try {
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, excerpt, tags, date, image } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const slug = generateSlug(title);

        // Check for duplicate slug
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { error: 'A post with this title already exists' },
                { status: 409 }
            );
        }

        const post = await prisma.blogPost.create({
            data: {
                slug,
                title,
                content,
                excerpt: excerpt || '',
                tags: tags || '',
                image: image || null,
                published: true,
                createdAt: date ? new Date(date) : new Date(),
            }
        });

        revalidatePath('/');
        revalidatePath('/posts');
        revalidatePath(`/posts/${slug}`);

        return NextResponse.json({
            success: true,
            message: 'Post created successfully',
            post
        });
    } catch (error: any) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post', details: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update existing post
export async function PUT(request: NextRequest) {
    try {
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id, title, content, excerpt, tags, date, image } = body;

        if (!id || !title || !content) {
            return NextResponse.json(
                { error: 'ID, title, and content are required' },
                { status: 400 }
            );
        }

        const post = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                excerpt: excerpt || '',
                tags: tags || '',
                image: image !== undefined ? image : undefined,
                createdAt: date ? new Date(date) : undefined,
            }
        });

        revalidatePath('/');
        revalidatePath('/posts');
        revalidatePath(`/posts/${post.slug}`);

        return NextResponse.json({
            success: true,
            message: 'Post updated successfully',
            post
        });
    } catch (error: any) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest) {
    try {
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        await prisma.blogPost.delete({
            where: { id: parseInt(id) }
        });

        revalidatePath('/');
        revalidatePath('/posts');

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post', details: error.message },
            { status: 500 }
        );
    }
}
