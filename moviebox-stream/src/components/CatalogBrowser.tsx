'use client';

import React, { useState } from 'react';
import { Film, Tv, Sparkles, Flame, Globe, Zap, Heart, ShieldAlert, Smile, Ghost, Compass } from 'lucide-react';

interface CatalogBrowserProps {
  onSelectCategory?: (categoryId: string) => void;
}

export default function CatalogBrowser({ onSelectCategory }: CatalogBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: '🔥 All Categories', icon: <Flame className="w-3.5 h-3.5 text-red-500" /> },
    { id: 'netflix', label: '🔴 Netflix', icon: <Sparkles className="w-3.5 h-3.5 text-red-400" /> },
    { id: 'prime', label: '🟡 Prime Video', icon: <Film className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'hotstar', label: '🟢 Hotstar', icon: <Globe className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'tv', label: '🍿 Web Series', icon: <Tv className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'action', label: '💥 Action', icon: <Zap className="w-3.5 h-3.5 text-orange-400" /> },
    { id: 'thriller', label: '😱 Thriller', icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" /> },
    { id: 'comedy', label: '😂 Comedy', icon: <Smile className="w-3.5 h-3.5 text-yellow-400" /> },
    { id: 'horror', label: '👻 Horror', icon: <Ghost className="w-3.5 h-3.5 text-green-400" /> },
    { id: 'romance', label: '💘 Romance', icon: <Heart className="w-3.5 h-3.5 text-pink-400" /> },
    { id: 'scifi', label: '🚀 Sci-Fi', icon: <Compass className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    if (onSelectCategory) {
      onSelectCategory(id);
    } else {
      if (id === 'all') {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <div className="w-full py-2 sm:py-4 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-hidden">
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x touch-pan-x">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`snap-start flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30 font-black'
                  : 'bg-neutral-900/90 text-neutral-300 border-neutral-800 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
