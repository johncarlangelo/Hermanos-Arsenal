import { useState, useEffect } from 'react';
import {/* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Trash2, Edit2, Palette } from 'lucide-react';
import { defaultThemes, applyTheme } from '../utils/theme';

export default function ThemePicker({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  customThemes,
  onSaveCustomTheme,
  onDeleteCustomTheme
}) {
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [editingThemeKey, setEditingThemeKey] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customColors, setCustomColors] = useState({
    primary: '#818cf8',
    secondary: '#c084fc',
    background: '#09090b',
    surface: '#18181b',
    text: '#f8fafc',
    textSecondary: '#a1a1aa',
    border: '#27272a',
    hover: '#27272a',
    hoverText: '#f8fafc',
  });

  useEffect(() => {
    if (isCreatingCustom || isEditingCustom) {
      applyTheme({
        name: customName || 'Preview',
        colors: customColors
      });
    }
  }, [customColors, customName, isCreatingCustom, isEditingCustom]);

  const handleClose = () => {
    if (isCreatingCustom || isEditingCustom) {
      applyTheme(currentTheme);
    }
    setIsCreatingCustom(false);
    setIsEditingCustom(false);
    setEditingThemeKey(null);
    setCustomName('');
    onClose();
  };

  const handleSaveCustom = () => {
    if (!customName.trim()) return;
    const newTheme = {
      name: customName.trim(),
      colors: customColors,
      isCustom: true
    };
    if (isEditingCustom && editingThemeKey) {
      onDeleteCustomTheme(editingThemeKey);
    }
    onSaveCustomTheme(newTheme);
    setIsCreatingCustom(false);
    setIsEditingCustom(false);
    setEditingThemeKey(null);
    setCustomName('');
  };

  const startEditCustom = (themeKey, theme) => {
    setIsEditingCustom(true);
    setEditingThemeKey(themeKey);
    setCustomName(theme.name);
    setCustomColors(theme.colors);
  };

  const handleColorChange = (key, value) => {
    setCustomColors(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'text' ? { hoverText: value } : {}),
      ...(key === 'border' ? { hover: value } : {})
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-theme-background/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-theme-surface/80 backdrop-blur-xl border-l border-theme-border shadow-2xl h-full overflow-y-auto"
          >
            <div className="sticky top-0 bg-theme-surface/80 backdrop-blur-xl border-b border-theme-border/50 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                  <Palette size={20} />
                </div>
                <h2 className="text-xl font-display font-bold text-theme-text">Appearance</h2>
              </div>
              <button 
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-theme-background hover:bg-theme-border text-theme-text-secondary hover:text-theme-text transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-10">
              {!isCreatingCustom && !isEditingCustom && (
                <>
                  <section>
                    <h3 className="text-sm font-semibold text-theme-text-secondary tracking-wider uppercase mb-4">Default Themes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(defaultThemes).map(([key, theme]) => (
                        <ThemeCard
                          key={key}
                          theme={theme}
                          isActive={currentTheme.name === theme.name}
                          onClick={() => onThemeChange(theme)}
                        />
                      ))}
                    </div>
                  </section>

                  {Object.keys(customThemes).length > 0 && (
                    <section>
                      <h3 className="text-sm font-semibold text-theme-text-secondary tracking-wider uppercase mb-4">Custom Themes</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(customThemes).map(([key, theme]) => (
                          <ThemeCard
                            key={key}
                            theme={theme}
                            isActive={currentTheme.name === theme.name}
                            onClick={() => onThemeChange(theme)}
                            onEdit={() => startEditCustom(key, theme)}
                            onDelete={() => onDeleteCustomTheme(key)}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}

              {(isCreatingCustom || isEditingCustom) ? (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-theme-text-secondary tracking-wider uppercase">
                      {isEditingCustom ? 'Edit Theme' : 'New Theme'}
                    </h3>
                    <button 
                      onClick={() => {
                        setIsCreatingCustom(false);
                        setIsEditingCustom(false);
                        applyTheme(currentTheme);
                      }}
                      className="text-xs text-theme-text-secondary hover:text-theme-text transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="bg-theme-background/50 rounded-2xl p-5 border border-theme-border/50 space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-theme-text-secondary mb-1.5">Theme Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. My Awesome Theme"
                        className="w-full bg-theme-surface border border-theme-border text-theme-text rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary/50"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-xs font-medium text-theme-text-secondary">Colors</label>
                      {Object.entries({
                        primary: 'Primary Accent',
                        secondary: 'Secondary Accent',
                        background: 'Background',
                        surface: 'Card Surface',
                        text: 'Primary Text',
                        textSecondary: 'Secondary Text'
                      }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between gap-3 bg-theme-surface p-2 rounded-xl border border-theme-border/50">
                          <span className="text-sm font-medium text-theme-text ml-2 flex-1">{label}</span>
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-theme-border">
                            <input
                              type="color"
                              value={customColors[key]}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSaveCustom}
                      disabled={!customName.trim()}
                      className="w-full py-3 mt-4 bg-theme-primary text-white font-semibold rounded-xl disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                      Save Theme
                    </button>
                  </div>
                </section>
              ) : (
                <button
                  onClick={() => {
                    setCustomName('');
                    setCustomColors(defaultThemes.midnight.colors);
                    setIsCreatingCustom(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-theme-border text-theme-text-secondary hover:text-theme-primary hover:border-theme-primary/50 hover:bg-theme-primary/5 rounded-2xl transition-all"
                >
                  <Plus size={18} />
                  <span className="font-medium">Create Custom Theme</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ThemeCard({ theme, isActive, onClick, onEdit, onDelete }) {
  return (
    <div 
      className={`group relative p-3 rounded-2xl cursor-pointer transition-all border-2 ${isActive ? 'border-theme-primary bg-theme-primary/5' : 'border-transparent bg-theme-surface/50 hover:bg-theme-surface hover:border-theme-border'}`}
      onClick={onClick}
    >
      <div 
        className="w-full h-16 rounded-xl mb-3 shadow-inner overflow-hidden flex border border-theme-border/20"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="w-1/2 h-full p-2">
          <div className="w-full h-full rounded-md shadow-sm" style={{ backgroundColor: theme.colors.surface }}>
            <div className="w-1/2 h-2 rounded mt-2 ml-2" style={{ backgroundColor: theme.colors.text }} />
            <div className="w-3/4 h-1.5 rounded mt-1.5 ml-2" style={{ backgroundColor: theme.colors.textSecondary }} />
          </div>
        </div>
        <div className="w-1/2 h-full bg-gradient-to-br" style={{ 
          backgroundImage: `linear-gradient(to bottom right, ${theme.colors.primary}40, ${theme.colors.secondary}40)` 
        }} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-theme-text truncate">{theme.name}</span>
        {isActive && (
          <div className="w-5 h-5 rounded-full bg-theme-primary flex items-center justify-center shrink-0">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>

      {theme.isCustom && (
        <div className="absolute inset-0 bg-theme-surface/90 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
