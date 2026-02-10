import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to check owner session from cookies
function isOwnerAuthenticated(request: NextRequest): boolean {
    const cookies = request.cookies;
    const ownerSession = cookies.get('__owner_session');
    const showSetup = process.env.NEXT_PUBLIC_SHOW_SETUP_PAGE === 'true';

    return showSetup && ownerSession?.value === 'true';
}

// GET - List all blog posts
export async function GET(request: NextRequest) {
    try {
        const contentDir = path.join(process.cwd(), 'content', 'blog');

        if (!fs.existsSync(contentDir)) {
            return NextResponse.json({ posts: [] });
        }

        const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));

        const posts = files.map(filename => {
            const filePath = path.join(contentDir, filename);
            const content = fs.readFileSync(filePath, 'utf-8');

            // Parse frontmatter
            const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
            const match = content.match(frontmatterRegex);

            let frontmatter: any = {};
            if (match) {
                const frontmatterText = match[1];
                frontmatterText.split('\n').forEach(line => {
                    const [key, ...valueParts] = line.split(':');
                    if (key && valueParts.length) {
                        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                        frontmatter[key.trim()] = value;
                    }
                });
            }

            return {
                filename,
                title: frontmatter.title || filename.replace('.md', ''),
                date: frontmatter.date || '',
                excerpt: frontmatter.excerpt || '',
                tags: frontmatter.tags || '',
            };
        });

        // Sort by date descending
        posts.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return NextResponse.json({ posts });
    } catch (error: any) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts', details: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new post
export async function POST(request: NextRequest) {
    try {
        // Check owner authentication
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, excerpt, tags, date } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const contentDir = path.join(process.cwd(), 'content', 'blog');

        if (!fs.existsSync(contentDir)) {
            fs.mkdirSync(contentDir, { recursive: true });
        }

        // Create filename from title
        const filename = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') + '.md';

        const filePath = path.join(contentDir, filename);

        // Check if file already exists
        if (fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'A post with this title already exists' },
                { status: 409 }
            );
        }

        // Create frontmatter
        const postDate = date || new Date().toISOString().split('T')[0];
        const frontmatter = `---
title: "${title}"
date: "${postDate}"
excerpt: "${excerpt || ''}"
tags: "${tags || ''}"
---

${content}`;

        fs.writeFileSync(filePath, frontmatter, 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Post created successfully',
            filename
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
        // Check owner authentication
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { filename, title, content, excerpt, tags, date } = body;

        if (!filename || !title || !content) {
            return NextResponse.json(
                { error: 'Filename, title, and content are required' },
                { status: 400 }
            );
        }

        const contentDir = path.join(process.cwd(), 'content', 'blog');
        const filePath = path.join(contentDir, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Update frontmatter
        const postDate = date || new Date().toISOString().split('T')[0];
        const frontmatter = `---
title: "${title}"
date: "${postDate}"
excerpt: "${excerpt || ''}"
tags: "${tags || ''}"
---

${content}`;

        fs.writeFileSync(filePath, frontmatter, 'utf-8');

        return NextResponse.json({
            success: true,
            message: 'Post updated successfully'
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
        // Check owner authentication
        if (!isOwnerAuthenticated(request)) {
            return NextResponse.json(
                { error: 'Unauthorized - owner access only' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json(
                { error: 'Filename is required' },
                { status: 400 }
            );
        }

        const contentDir = path.join(process.cwd(), 'content', 'blog');
        const filePath = path.join(contentDir, filename);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        fs.unlinkSync(filePath);

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
