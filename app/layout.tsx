import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Smart Blog - Lightweight & Fast',
    description: 'A lightweight static blog built with Next.js - Perfect for free tier deployments',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors">
                    <p>Built with Next.js Static Export | Optimized for 500MB Containers</p>
                </footer>
            </body>
        </html>
    );
}
