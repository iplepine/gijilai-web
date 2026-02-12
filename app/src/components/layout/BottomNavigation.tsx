'use client';

import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavigation() {
    const pathname = usePathname();

    const leftNavItems = [
        { label: 'HOME', icon: 'home', path: '/' },
        { label: 'ANALYSIS', icon: 'content_paste_search', path: '/analysis' },
    ];

    const rightNavItems = [
        { label: 'DIARY', icon: 'auto_stories', path: '/diary' },
        { label: 'MORE', icon: 'settings', path: '/more' },
    ];

    const NavItem = ({ item }: { item: { label: string, icon: string, path: string } }) => {
        const isActive = pathname === item.path;
        return (
            <Link
                href={item.path}
                className={`flex flex-col items-center gap-1 ${isActive ? 'text-garden-green' : 'text-garden-brown/40'}`}
            >
                <Icon
                    name={item.icon}
                    className={isActive ? 'filled' : ''}
                    size="md"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
        );
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-garden-accent/10 px-6 pt-3 pb-8 flex justify-between items-center z-[100]">
            {leftNavItems.map((item) => (
                <NavItem key={item.label} item={item} />
            ))}

            <div className="relative -top-6">
                <Link href="/add-record">
                    <button className="w-14 h-14 bg-garden-green text-white rounded-full shadow-lg shadow-garden-green/30 flex items-center justify-center active:scale-90 transition-transform">
                        <Icon name="add" size="lg" className="text-3xl" />
                    </button>
                </Link>
            </div>

            {rightNavItems.map((item) => (
                <NavItem key={item.label} item={item} />
            ))}
        </nav>
    );
}
