import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import { prisma } from '@/lib/db';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
    try {
        const settings = await (prisma as any).siteSettings.findUnique({ where: { id: 'default' } });
        if (settings) {
            return {
                title: `${settings.blogName} - ${settings.description}`,
                description: settings.description,
            };
        }
    } catch { }

    return {
        title: 'Smart Blog',
        description: 'A lightweight static blog built with Next.js',
    };
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let footerText = 'Built with Next.js | Optimized for 500MB Containers';
    try {
        const settings = await (prisma as any).siteSettings.findUnique({ where: { id: 'default' } });
        if (settings?.footerText) {
            footerText = settings.footerText;
        }
    } catch { }

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col min-h-screen`}>
                <Header />
                <main className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full">
                    {children}
                </main>
                <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors">
                    <p>{footerText}</p>
                </footer>
            </body>
        </html>
    );
}
