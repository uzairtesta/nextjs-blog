export default function AboutPage() {
    return (
        <div className="prose prose-lg max-w-none">
            <h1>About Smart Blog</h1>
            <p className="lead">
                A lightweight, static blog template optimized for free-tier deployments.
            </p>

            <h2>Why Smart Blog?</h2>
            <p>
                Most modern blog templates are resource-heavy, requiring databases, server runtimes,
                and significant memory allocation. Smart Blog takes a different approach.
            </p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Static Export</strong>: Entire blog is pre-rendered at build time</li>
                <li><strong>Minimal Runtime</strong>: 50-150MB RAM footprint</li>
                <li><strong>No Database</strong>: Markdown files for content</li>
                <li><strong>Fast Deployment</strong>: Build once, deploy anywhere</li>
                <li><strong>Free Tier Friendly</strong>: Works perfectly on 500MB containers</li>
            </ul>

            <h3>Technical Stack</h3>
            <ul>
                <li>Next.js 14 with Static Export</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Gray Matter (markdown parsing)</li>
            </ul>

            <h2>Perfect For</h2>
            <p>
                This template is ideal for developers who want a modern, fast blog without
                the overhead of databases, CMS systems, or complex server configurations.
            </p>
        </div>
    );
}
