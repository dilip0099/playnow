'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Grid, Search, Tv } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenSearch?: () => void;
}

export default function MobileBottomNav({ onOpenSearch }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Flame,
      isActive: pathname === '/',
    },
    {
      name: 'Explore',
      href: '/explore',
      icon: Grid,
      isActive: pathname === '/explore',
    },
    {
      name: 'Series',
      href: '/#tv',
      icon: Tv,
      isActive: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-neutral-800/90 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-200 ${
                item.isActive
                  ? 'text-red-500 font-bold scale-105'
                  : 'text-neutral-400 font-medium hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? 'text-red-500' : ''}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* Search Modal Trigger Button */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-neutral-400 hover:text-white transition-all duration-200"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Search</span>
        </button>
      </div>
    </div>
  );
}
