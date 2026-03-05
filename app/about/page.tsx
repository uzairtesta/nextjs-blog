export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Profile Section */}
            <div className="mb-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    ✍️
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">About Smart Blog</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    A ultra-lightweight static blog built with Next.js — no database, no heavy runtime, just great content.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {[
                    { icon: '⚡', title: '50–150 MB RAM', desc: 'Runs on the smallest containers and free-tier plans' },
                    { icon: '🚀', title: 'Static Export', desc: 'Pre-rendered at build time — blazing fast page loads' },
                    { icon: '🗄️', title: 'No Database', desc: 'Posts are Markdown files — no SQL setup required' },
                    { icon: '🌙', title: 'Dark Mode', desc: 'Full dark/light mode support with toggle in header' },
                    { icon: '🔍', title: 'Search', desc: 'Instant client-side search — no server needed' },
                    { icon: '📱', title: 'Responsive', desc: 'Looks great on all screen sizes out of the box' },
                ].map(f => (
                    <div key={f.title} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-start gap-3">
                        <span className="text-2xl">{f.icon}</span>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{f.title}</div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{f.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stack */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🛠 Technical Stack</h2>
                <div className="flex flex-wrap gap-2">
                    {['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Gray Matter', 'Static Export', 'date-fns'].map(t => (
                        <span key={t} className="px-3 py-1.5 text-sm font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            {/* Perfect for section */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                <h2 className="text-xl font-bold mb-2">Perfect For</h2>
                <p className="text-blue-100 text-sm">
                    Developers, writers, and creators who want a modern blog without database overhead.
                    Deploy on any free VPS, Cloudflare Pages, or Vercel with zero config.
                </p>
            </div>
        </div>
    );
}
