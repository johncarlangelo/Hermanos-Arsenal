import { useState, useEffect } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

// Common icons suitable for categories
const ICON_SUGGESTIONS = [
  'Briefcase', 'Code', 'Monitor', 'Cpu', 'Laptop',
  'Coffee', 'Music', 'Video', 'Gamepad', 'Headphones',
  'Book', 'GraduationCap', 'Newspaper', 'PenTool', 'Lightbulb',
  'Heart', 'Smile', 'Star', 'Gift', 'Plane',
  'Home', 'Map', 'Compass', 'Image', 'Camera',
  'Folder', 'FileText', 'Archive', 'Database', 'Cloud',
  'Shield', 'Key', 'Lock', 'Unlock', 'Settings',
  'Terminal', 'Bug', 'GitBranch', 'Github', 'Trello',
  'Figma', 'Slack', 'Youtube', 'Twitter', 'Linkedin'
];

export default function CategoryIconPickerModal({ isOpen, onClose, onSave, category }) {
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || null);
  const [selectedColor, setSelectedColor] = useState(category?.color || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen && category) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSelectedIcon(category.icon || null);
      setSelectedColor(category.color || null);
      setSearchQuery('');
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isOpen, category]);

  const filteredIcons = ICON_SUGGESTIONS.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    onSave(category.id, { icon: selectedIcon, color: selectedColor });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-theme-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-lg bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="p-6 sm:p-8 flex flex-col flex-1 min-h-0">
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-theme-border bg-theme-background/50 shadow-sm" style={{ color: selectedColor || 'var(--color-theme-text)' }}>
                  {selectedIcon && LucideIcons[selectedIcon] ? (
                    (() => {
                      const Icon = LucideIcons[selectedIcon];
                      return <Icon size={24} />;
                    })()
                  ) : (
                    <div className="text-xl">✨</div>
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2 shrink-0">Category Appearance</h2>
              <p className="text-theme-text-secondary text-sm mb-6 shrink-0">Customize icon and color for '{category?.name}'.</p>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-theme-text-secondary uppercase tracking-wider mb-3">Color</h3>
                  <div className="flex gap-6 items-start">
                    <div className="bg-theme-surface p-3 rounded-2xl border border-theme-border/50 inline-block w-fit shadow-sm shrink-0">
                      <HexColorPicker color={selectedColor || '#ffffff'} onChange={setSelectedColor} />
                    </div>
                    <div className="flex flex-col gap-4 py-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full shadow-inner border border-theme-border/50" 
                          style={{ backgroundColor: selectedColor || 'transparent' }}
                        />
                        <span className="text-sm font-mono text-theme-text-secondary uppercase">
                          {selectedColor || 'Default'}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedColor(null)}
                        className="w-fit px-3 py-1.5 text-xs font-medium bg-theme-background/50 text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface hover:text-red-400 rounded-lg border border-theme-border transition-colors flex items-center gap-1.5 mt-auto"
                      >
                        <X size={14} /> Clear Color
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-theme-text-secondary uppercase tracking-wider mb-3">Icon</h3>
                  
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-secondary w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search icons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-theme-background/50 text-theme-text text-sm rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50"
                    />
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                    <button
                      onClick={() => setSelectedIcon(null)}
                      className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                        selectedIcon === null
                          ? 'bg-theme-primary text-white border-theme-primary shadow-md'
                          : 'bg-theme-background/50 border-theme-border text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text'
                      }`}
                      title="No Icon"
                    >
                      <X size={20} />
                    </button>
                    {filteredIcons.map(iconName => {
                      const Icon = LucideIcons[iconName];
                      if (!Icon) return null;
                      return (
                        <button
                          key={iconName}
                          onClick={() => setSelectedIcon(iconName)}
                          className={`aspect-square rounded-xl border flex items-center justify-center transition-all ${
                            selectedIcon === iconName
                              ? 'bg-theme-primary text-white border-theme-primary shadow-md'
                              : 'bg-theme-background/50 border-theme-border text-theme-text-secondary hover:bg-theme-surface hover:text-theme-text'
                          }`}
                          title={iconName}
                        >
                          <Icon size={20} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-theme-border/50 shrink-0">
                <button 
                  onClick={handleSave}
                  className="w-full py-3.5 text-base font-semibold bg-theme-primary text-white rounded-xl shadow-lg hover:shadow-theme-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Save Appearance
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
