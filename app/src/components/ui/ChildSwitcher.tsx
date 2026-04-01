'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';

interface Child {
  id: string;
  name: string;
}

interface ChildSwitcherProps {
  /** 컴팩트 모드: 이름만 표시 (Navbar용) */
  compact?: boolean;
}

export function ChildSwitcher({ compact = false }: ChildSwitcherProps) {
  const { user } = useAuth();
  const { selectedChildId, setSelectedChildId } = useAppStore();
  const [children, setChildren] = useState<Child[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('children')
      .select('id, name')
      .eq('parent_id', user.id)
      .order('created_at')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setChildren(data);
          if (!selectedChildId || !data.find(c => c.id === selectedChildId)) {
            setSelectedChildId(data[0].id);
          }
        }
      });
  }, [user]);

  if (children.length <= 1) return null;

  const current = children.find(c => c.id === selectedChildId) || children[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1 font-bold transition-all active:scale-95 ${
          compact
            ? 'text-sm text-text-main dark:text-white'
            : 'bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full text-xs shadow-sm border border-primary/10'
        }`}
      >
        <span className="material-symbols-outlined text-[14px] text-child">child_care</span>
        {current.name}
        <span className={`material-symbols-outlined text-[16px] text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 min-w-[140px] z-50 animate-in fade-in zoom-in-95 duration-200">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => {
                  setSelectedChildId(child.id);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-sm font-bold text-left transition-colors ${
                  current.id === child.id
                    ? 'text-primary bg-primary/5'
                    : 'text-text-main dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
