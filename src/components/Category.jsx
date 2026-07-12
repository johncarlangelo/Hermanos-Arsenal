import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, GripVertical, Settings, MoreHorizontal } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import SortableLink from './SortableLink';
import ResizeIcon from './ResizeIcon';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

export default function Category({
  id,
  name,
  color,
  icon,
  size,
  viewType = 'expanded',
  iconSize = 48,
  links = [],
  onRename,
  onDelete,
  onAddLink,
  onDeleteLink,
  onResize,
  isLocked = false,
  dragHandleProps
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const defaultSize = { width: 400, height: 400 };
  const [localSize, setLocalSize] = useState(size || defaultSize);
  
  useEffect(() => {
    if (size) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSize(size);
    }
  }, [size]);

  const handleResizeStart = (e) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = localSize.width;
    const startHeight = localSize.height;
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      setLocalSize({
        width: Math.max(280, startWidth + deltaX),
        height: Math.max(200, startHeight + deltaY)
      });
    };
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
      
      setLocalSize((currentSize) => {
        if (onResize) onResize(id, currentSize);
        return currentSize;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };


  useEffect(() => {
    const handleRenameEvent = (e) => {
      if (e.detail === id) {
        setIsEditing(true);
      }
    };
    window.addEventListener('linkdock-rename-category', handleRenameEvent);
    return () => window.removeEventListener('linkdock-rename-category', handleRenameEvent);
  }, [id]);

  const handleDoubleClick = () => {
    if (!isLocked) setIsEditing(true);
  };

  const handleSaveRename = () => {
    if (editName.trim() && editName.trim() !== name) {
      onRename(id, editName.trim());
    } else {
      setEditName(name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') handleSaveRename();
    if (e.key === 'Escape') {
      setEditName(name);
      setIsEditing(false);
    }
  };

  const handleDeleteCategory = (e) => {
    e.stopPropagation();
    onDelete(id, name);
    setIsMenuOpen(false);
  };

  const { setNodeRef, isOver } = useDroppable({
    id: `category-drop-${id}`,
    disabled: isLocked,
    data: {
      type: 'Category',
      category: { id, name }
    }
  });

  const linkIds = useMemo(() => links.map(l => l.id), [links]);

  return (
    <motion.div 
      ref={setNodeRef}
      data-context-type="category"
      data-context-id={id}
      data-name={name}
      data-view-type={viewType}
      data-icon-size={iconSize}
      style={{ width: localSize.width, height: localSize.height, maxWidth: '100%' }}
      className={`group relative flex flex-col glass-card rounded-[2rem] overflow-hidden ${isResizing ? '' : 'transition-all duration-300'} hover:shadow-2xl hover:shadow-theme-primary/5 ${isOver ? 'border-theme-primary ring-2 ring-theme-primary/30 bg-theme-primary/5' : 'hover:border-theme-primary/30'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsMenuOpen(false); }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Glossy top highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-30" />

      <div 
        className="flex items-center justify-between px-5 py-4 bg-theme-surface/40 border-b border-theme-border/40 relative z-20 group/header"
        {...(isLocked ? {} : dragHandleProps)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-theme-text-secondary/30 group-hover/header:text-theme-text-secondary cursor-grab active:cursor-grabbing transition-colors p-1 -ml-2 rounded-lg hover:bg-theme-border/50">
            <GripVertical size={18} />
          </div>
          
          {icon && LucideIcons[icon] && (
            <div className="flex items-center justify-center p-1.5 rounded-lg border border-theme-border/50 shadow-sm" style={{ backgroundColor: color ? `${color}15` : 'var(--color-theme-surface)', color: color || 'var(--color-theme-text)' }}>
              {(() => {
                const IconComponent = LucideIcons[icon];
                return <IconComponent size={16} strokeWidth={2.5} />;
              })()}
            </div>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-theme-background border border-theme-primary/50 focus:outline-none focus:ring-4 focus:ring-theme-primary/20 text-theme-text font-display font-bold text-lg px-3 py-1 rounded-xl shadow-inner transition-all"
              autoFocus
            />
          ) : (
            <h3 
              onDoubleClick={handleDoubleClick}
              className="font-display font-bold text-lg tracking-tight text-theme-text truncate cursor-text select-none group-hover/header:text-theme-primary transition-colors"
            >
              {name}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center min-w-[24px] h-[24px] px-2 text-[11px] font-bold bg-theme-surface border border-theme-border/50 text-theme-text-secondary rounded-full shadow-sm">
            {links.length}
          </div>
          {!isLocked && (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className={`p-1.5 rounded-xl transition-all duration-300 ${isMenuOpen || isHovered ? 'opacity-100 text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text hover:shadow-sm border border-transparent hover:border-theme-border/50' : 'opacity-0 scale-95'}`}
              >
                <MoreHorizontal size={18} />
              </button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, y: -10, filter: "blur(5px)" }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-2xl overflow-hidden py-1.5 z-40"
                  >
                    <button 
                      onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors flex items-center gap-3 group/btn"
                    >
                      <Settings size={16} className="text-theme-text-secondary group-hover/btn:text-theme-primary" /> Rename
                    </button>
                    <button 
                      onClick={handleDeleteCategory}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-theme-border/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-theme-border relative z-10">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60 hover:opacity-100 transition-opacity duration-300">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-16 h-16 mb-4 rounded-3xl bg-theme-surface/50 flex items-center justify-center text-3xl shadow-lg border border-theme-border/50 backdrop-blur-md"
            >
              🪄
            </motion.div>
            <p className="text-sm text-theme-text-secondary font-medium mb-5">It's empty in here</p>
            <button 
              onClick={() => onAddLink(id)}
              className="text-sm font-bold px-6 py-2.5 bg-theme-text text-theme-background rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-theme-text/10"
            >
              Add Link
            </button>
          </div>
        ) : (
          <div className={`gap-3 pb-16 ${viewType === 'icons' ? 'flex flex-wrap items-start content-start' : 'grid grid-cols-1'}`}>
            <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
              <AnimatePresence>
                {links.map((link, index) => (
                  <SortableLink
                    key={link.id}
                    id={link.id}
                    categoryId={id}
                    name={link.name}
                    url={link.url}
                    description={link.description}
                    isStarred={link.isStarred}
                    index={index}
                    viewType={viewType}
                    iconSize={iconSize}
                    onDelete={() => onDeleteLink(id, link.id)}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
          </div>
        )}
      </div>

      {links.length > 0 && !isLocked && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-theme-surface via-theme-surface/80 to-transparent flex justify-center z-20 pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddLink(id); }}
            className={`pointer-events-auto flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-primary text-white shadow-xl shadow-theme-primary/40 transition-all duration-400 transform ${isHovered ? 'translate-y-0 opacity-100 hover:scale-110 hover:-translate-y-1 hover:rotate-3 active:scale-95' : 'translate-y-8 opacity-0 scale-75'}`}
            title="Add link"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      )}

      <div 
        className="absolute bottom-1 right-1 p-2 text-theme-text-secondary/30 hover:text-theme-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <ResizeIcon size={16} />
      </div>
    </motion.div>
  );
}
