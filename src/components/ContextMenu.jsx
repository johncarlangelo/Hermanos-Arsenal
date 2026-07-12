import { useEffect, useRef } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, ExternalLink, Copy, Plus, X, Maximize2, Star, List, LayoutList, LayoutGrid, Palette } from 'lucide-react';

export default function ContextMenu({ menu, onClose, onAction }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menu) return;
    
    // Adjust position if it goes off screen
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let newX = menu.x;
      let newY = menu.y;
      
      if (newX + rect.width > window.innerWidth) {
        newX = window.innerWidth - rect.width - 10;
      }
      if (newY + rect.height > window.innerHeight) {
        newY = window.innerHeight - rect.height - 10;
      }
      
      menuRef.current.style.left = `${newX}px`;
      menuRef.current.style.top = `${newY}px`;
    }
  }, [menu]);

  const renderItems = () => {
    if (!menu) return null;

    if (menu.type === 'link') {
      const isStarred = menu.starred === 'true';
      return (
        <>
          <ContextMenuItem 
            icon={<ExternalLink size={14} />} 
            label="Open in New Tab" 
            onClick={() => onAction('open-link', menu)} 
          />
          <ContextMenuItem 
            icon={<Copy size={14} />} 
            label="Copy URL" 
            onClick={() => onAction('copy-link', menu)} 
          />
          <div className="h-px bg-theme-border/50 my-1 mx-2" />
          <ContextMenuItem 
            icon={<Star size={14} className={isStarred ? "fill-yellow-500 text-yellow-500" : ""} />} 
            label={isStarred ? "Unstar" : "Star"} 
            onClick={() => onAction('toggle-star-link', menu)} 
          />
          <ContextMenuItem 
            icon={<Edit2 size={14} />} 
            label="Edit Link" 
            onClick={() => onAction('edit-link', menu)} 
          />
          <div className="h-px bg-theme-border/50 my-1 mx-2" />
          <ContextMenuItem 
            icon={<Trash2 size={14} />} 
            label="Delete Link" 
            variant="danger"
            onClick={() => onAction('delete-link', menu)} 
          />
        </>
      );
    }
    
    if (menu.type === 'category') {
      return (
        <>
          <ContextMenuItem 
            icon={<Palette size={14} />} 
            label="Change Icon & Color" 
            onClick={() => {
              onAction('open-category-icon-picker', menu);
            }} 
          />
          <div className="h-px bg-theme-border/50 my-1 mx-2" />
          <div className="px-3 py-2">
            <div className="text-[11px] font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">View Style</div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('set-category-view', { ...menu, viewType: 'expanded' });
                }}
                className={`flex-1 p-2 flex justify-center items-center rounded-lg border transition-colors ${menu.viewType === 'expanded' || !menu.viewType ? 'bg-theme-primary/10 border-theme-primary text-theme-primary' : 'border-theme-border/50 text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text'}`}
                title="Expanded View"
              >
                <LayoutList size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('set-category-view', { ...menu, viewType: 'minimal' });
                }}
                className={`flex-1 p-2 flex justify-center items-center rounded-lg border transition-colors ${menu.viewType === 'minimal' ? 'bg-theme-primary/10 border-theme-primary text-theme-primary' : 'border-theme-border/50 text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text'}`}
                title="Minimal View"
              >
                <List size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction('set-category-view', { ...menu, viewType: 'icons' });
                }}
                className={`flex-1 p-2 flex justify-center items-center rounded-lg border transition-colors ${menu.viewType === 'icons' ? 'bg-theme-primary/10 border-theme-primary text-theme-primary' : 'border-theme-border/50 text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text'}`}
                title="Icons Only"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            {menu.viewType === 'icons' && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1 text-[10px] text-theme-text-secondary uppercase tracking-wider">
                  <span>Size</span>
                  <span>{menu.iconSize || 48}px</span>
                </div>
                <input 
                  type="range" 
                  min="32" 
                  max="96" 
                  step="4"
                  value={menu.iconSize || 48} 
                  onChange={(e) => {
                    onAction('set-category-view', { ...menu, iconSize: parseInt(e.target.value) });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerMove={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full accent-theme-primary h-1.5 bg-theme-border/50 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
          <div className="h-px bg-theme-border/50 my-1 mx-2" />
          <ContextMenuItem 
            icon={<Plus size={14} />} 
            label="Add Link" 
            onClick={() => onAction('add-link', menu)} 
          />
          <ContextMenuItem 
            icon={<Edit2 size={14} />} 
            label="Rename Category" 
            onClick={() => onAction('rename-category', menu)} 
          />
          <div className="h-px bg-theme-border/50 my-1 mx-2" />
          <ContextMenuItem 
            icon={<Trash2 size={14} />} 
            label="Delete Category" 
            variant="danger"
            onClick={() => onAction('delete-category', menu)} 
          />
        </>
      );
    }

    if (menu.type === 'global') {
      return (
        <>
          <ContextMenuItem 
            icon={<Plus size={14} />} 
            label="New Category" 
            onClick={() => onAction('new-category')} 
          />
          <ContextMenuItem 
            icon={<Maximize2 size={14} />} 
            label="Bulk Add Links" 
            onClick={() => onAction('bulk-add')} 
          />
        </>
      );
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-[100] min-w-[200px] py-1.5 rounded-xl bg-theme-surface/95 backdrop-blur-xl border border-theme-border/50 shadow-2xl flex flex-col gap-0.5"
          style={{ left: menu.x, top: menu.y, transformOrigin: 'top left' }}
          onContextMenu={(e) => { e.preventDefault(); onClose(); }}
        >
          {renderItems()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContextMenuItem({ icon, label, onClick, variant = 'default' }) {
  const isDanger = variant === 'danger';
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors outline-none
        ${isDanger 
          ? 'text-red-500 hover:bg-red-500/10' 
          : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-primary/10'
        }
      `}
    >
      <span className={isDanger ? 'text-red-500/80' : 'text-theme-primary/80'}>{icon}</span>
      {label}
    </button>
  );
}
