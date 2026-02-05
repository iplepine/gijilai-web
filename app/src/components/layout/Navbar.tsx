'use client';

import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  title: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightClick?: () => void;
}

export function Navbar({ title, showBack = false, rightIcon, onRightClick }: NavbarProps) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 flex items-center bg-[var(--background-light)]/90 dark:bg-[var(--background-dark)]/90 backdrop-blur-xl p-4 justify-between border-b border-gray-100 dark:border-gray-800">
      <div className="size-10 flex items-center justify-center">
        {showBack ? (
          <button onClick={() => router.back()} className="text-[var(--navy)] dark:text-white">
            <Icon name="arrow_back_ios" />
          </button>
        ) : (
          <button className="text-[var(--navy)] dark:text-white">
            <Icon name="menu" />
          </button>
        )}
      </div>
      <h2 className="text-[var(--navy)] dark:text-white text-base font-bold flex-1 text-center">
        {title}
      </h2>
      <div className="size-10 flex items-center justify-center">
        {rightIcon ? (
          <button onClick={onRightClick} className="text-[var(--navy)] dark:text-white">
            <Icon name={rightIcon} />
          </button>
        ) : (
          <Icon name="account_circle" className="text-[var(--navy)] dark:text-white" />
        )}
      </div>
    </nav>
  );
}
