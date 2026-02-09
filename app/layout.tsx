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
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="text-center py-8 text-gray-600 text-sm border-t mt-16">
                    <p>Built with Next.js Static Export | Optimized for 500MB Containers</p>
                </footer>
            </body>
        </html>
    );
}
