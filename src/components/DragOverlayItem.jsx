import React from 'react';
import { getFaviconUrl } from '../utils/favicon';
import { Star } from 'lucide-react';

export default function DragOverlayItem({ link, viewType = 'expanded', iconSize = 48 }) {
  const { name, url, description, isStarred } = link;
  const faviconUrl = getFaviconUrl(url);

  if (viewType === 'icons') {
    const size = typeof iconSize === 'number' ? iconSize : 48;
    const innerSize = Math.max(16, size - 24);

    return (
      <div 
        className={`group flex items-center justify-center p-2 rounded-2xl transition-all duration-300 shadow-xl shadow-theme-primary/10 rotate-3 scale-105 cursor-grabbing ${
          isStarred 
            ? 'bg-amber-500/10 border border-amber-500/50' 
            : 'bg-theme-surface border border-theme-primary/50'
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <img 
          src={faviconUrl} 
          alt={name} 
          style={{ width: `${innerSize}px`, height: `${innerSize}px` }}
          className="object-contain z-10"
          onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=64'; }}
        />
        {isStarred && <Star size={10} className="absolute top-1 right-1 text-yellow-500 fill-yellow-500" />}
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-3 p-2.5 rounded-2xl border transition-all duration-300 shadow-xl shadow-theme-primary/10 rotate-3 scale-105 cursor-grabbing ${
        isStarred 
          ? 'bg-amber-500/10 border-amber-500/50' 
          : 'bg-theme-surface border-theme-primary/50'
      }`}>
        <div className={`rounded-xl overflow-hidden shrink-0 bg-theme-background border border-theme-border/50 flex items-center justify-center shadow-sm relative ${viewType === 'minimal' ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <img 
            src={faviconUrl} 
            alt={name} 
            className={`${viewType === 'minimal' ? 'w-4 h-4' : 'w-6 h-6'} object-contain z-10`}
            onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?domain=example.com&sz=64'; }}
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-theme-text truncate">{name}</span>
            {isStarred && <Star size={12} className="text-yellow-500 fill-yellow-500 shrink-0" />}
          </div>
          {viewType === 'expanded' && (
            <>
              <span className="text-[11px] font-medium text-theme-text-secondary truncate mt-0.5 opacity-80">{new URL(url).hostname}</span>
              {description && (
                <span className="text-xs text-theme-text opacity-75 line-clamp-2 mt-1 leading-snug pr-2">{description}</span>
              )}
            </>
          )}
        </div>
    </div>
  );
}
