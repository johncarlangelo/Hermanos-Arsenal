import { ExternalLink, X, Star } from 'lucide-react';
import { getFaviconUrl } from '../utils/favicon';
import { /* eslint-disable-line no-unused-vars */ motion } from 'motion/react';

export default function Link({ id, categoryId, name, url, description, isStarred, index = 0, viewType = 'expanded', iconSize = 48, onDelete }) {
  const faviconUrl = getFaviconUrl(url);

  const handleClick = (e) => {
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMouseEnter = (e) => {
    if (viewType !== 'icons') return;
    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('linkdock-show-tooltip', {
      detail: {
        text: name,
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    }));
  };

  const handleMouseLeave = () => {
    if (viewType !== 'icons') return;
    window.dispatchEvent(new CustomEvent('linkdock-hide-tooltip'));
  };

  if (viewType === 'icons') {
    const size = typeof iconSize === 'number' ? iconSize : 48;
    const innerSize = Math.max(16, size - 24); // Ensure reasonable icon size

    return (
      <motion.div 
        data-context-type="link"
        data-context-id={id}
        data-category-id={categoryId}
        data-url={url}
        data-name={name}
        data-description={description || ''}
        data-starred={isStarred ? 'true' : 'false'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.02 }}
        className={`relative flex items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1 ${
          isStarred 
            ? 'bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/30 shadow-amber-500/5' 
            : 'bg-theme-surface/40 hover:bg-theme-surface border border-theme-border/30 hover:border-theme-primary/30'
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseLeave} // Hide tooltip when starting to drag
      >
        <a 
          href={url}
          onClick={handleClick}
          className="w-full h-full flex items-center justify-center z-10"
        >
          <img 
            src={faviconUrl}
            alt={`${name} icon`}
            style={{ width: `${innerSize}px`, height: `${innerSize}px` }}
            className="object-contain hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          {isStarred && <Star size={10} className="absolute top-1 right-1 text-yellow-500 fill-yellow-500" />}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div 
      data-context-type="link"
      data-context-id={id}
      data-category-id={categoryId}
      data-url={url}
      data-name={name}
      data-description={description || ''}
      data-starred={isStarred ? 'true' : 'false'}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
      className={`group relative flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-0.5 ${
        isStarred 
          ? 'bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 shadow-amber-500/5' 
          : 'bg-theme-surface/40 hover:bg-theme-surface border border-theme-border/30 hover:border-theme-primary/30 hover:shadow-theme-primary/5'
      }`}
    >
      {/* Hover glow effect behind the link */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-theme-primary/0 via-theme-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <a 
        href={url}
        onClick={handleClick}
        className="flex-1 flex items-center gap-4 min-w-0 z-10"
        title={url}
      >
        <div className={`rounded-xl bg-white shadow-sm border border-theme-border/20 flex items-center justify-center shrink-0 overflow-hidden relative group-hover:shadow-md transition-shadow ${viewType === 'minimal' ? 'w-8 h-8' : 'w-10 h-10'}`}>
          <img 
            src={faviconUrl}
            alt={`${name} icon`}
            className={`${viewType === 'minimal' ? 'w-4 h-4' : 'w-5 h-5'} object-contain group-hover:scale-110 transition-transform duration-300`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-theme-text truncate group-hover:text-theme-primary transition-colors">{name}</span>
            {isStarred && <Star size={12} className="text-yellow-500 fill-yellow-500 shrink-0" />}
          </div>
          {viewType === 'expanded' && (
            <>
              <span className="text-[11px] font-medium text-theme-text-secondary truncate mt-0.5 opacity-80">{new URL(url).hostname}</span>
              {description && (
                <span className="text-xs text-theme-text opacity-75 line-clamp-2 mt-1 leading-snug pr-2" title={description}>{description}</span>
              )}
            </>
          )}
        </div>
        
        <div className="w-8 h-8 rounded-full bg-theme-primary/10 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <ExternalLink size={14} className="text-theme-primary" />
        </div>
      </a>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }} 
        className="z-10 w-8 h-8 flex items-center justify-center text-theme-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300 shrink-0 hover:rotate-90 hover:scale-110"
        title="Delete link"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
