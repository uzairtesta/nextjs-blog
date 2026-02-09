import Link from 'next/link';

export default function Header() {
    return (
        <header className="border-b">
            <nav className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Smart Blog
                </Link>
                <div className="flex gap-6">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
                        Home
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
                        About
                    </Link>
                </div>
            </nav>
        </header>
    );
}
