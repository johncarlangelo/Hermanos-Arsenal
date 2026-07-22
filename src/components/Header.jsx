import { useRef, useState } from 'react';
import { Palette, Share2, Download, Upload, LogOut, ChevronDown, Command, Search, Layers, Plus, Settings, Trash2, Check, Archive, Save, Vault } from 'lucide-react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { formatKeybind, defaultKeybinds } from '../hooks/useKeybinds';

export default function Header({ 
  username, 
  onExport, 
  onImport, 
  onShare, 
  onThemeClick,
  isViewingShared,
  sharedUsername,
  onReturnToOwn,
  onSaveShared,
  onSearchClick,
  onOpenBulkAdd,
  onOpenAddCategory,
  onOpenSettings,
  onOpenSavedArsenals,
  onOpenTrashBin,
  viewingSavedId = null,
  isPrivateView,
  onToggleVault,
  keybinds
}) {
  const fileInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
    }
    event.target.value = '';
  };

  return (
    <div className="fixed top-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pointer-events-auto glass-panel rounded-[2rem] px-3 py-3 flex items-center justify-between gap-3 w-full max-w-6xl border-theme-border/60 shadow-theme-primary/5"
      >
        <div className="flex items-center gap-3 pl-2 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-theme-primary to-theme-secondary flex items-center justify-center shadow-lg shadow-theme-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Command className="text-white w-5 h-5" />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <h1 className="text-lg font-display font-extrabold tracking-tight text-theme-text leading-tight">
              Hermanos Arsenal
            </h1>
            {isViewingShared ? (
              <span className="text-[10px] font-medium text-theme-primary uppercase tracking-wider">
                {sharedUsername}'s Arsenal
              </span>
            ) : isPrivateView ? (
              <span className="text-[10px] font-medium text-theme-primary uppercase tracking-wider">
                Private Vault
              </span>
            ) : null}
          </div>
        </div>

        {/* Search Bar Trigger */}
        <motion.div 
          layoutId="search-container"
          onClick={onSearchClick}
          className="flex-1 max-w-md h-12 bg-theme-surface/50 hover:bg-theme-surface border border-theme-border/60 hover:border-theme-primary/50 rounded-2xl flex items-center px-4 text-theme-text-secondary hover:text-theme-text transition-all cursor-pointer group shadow-sm mx-2"
        >
          <motion.div layoutId="search-icon" className="flex shrink-0">
            <Search size={18} className="mr-3 text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
          </motion.div>
          <motion.span layoutId="search-text" className="text-sm font-medium flex-1 truncate">
            Search your arsenal...
          </motion.span>
          <div className="hidden lg:flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
            {formatKeybind(keybinds?.search || defaultKeybinds.search).split(' ').map((part, i) => (
              <kbd key={i} className="inline-flex items-center justify-center h-5 px-1.5 text-[10px] font-bold bg-theme-background border border-theme-border/80 rounded text-theme-text-secondary">
                {part}
              </kbd>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center gap-2 shrink-0">
          {!isViewingShared && (
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button 
                onClick={onOpenBulkAdd}
                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-theme-background/50 hover:bg-theme-secondary/10 text-theme-text hover:text-theme-secondary border border-theme-border/50 hover:border-theme-secondary/30 transition-all text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0"
              >
                <Layers size={16} /> <span className="hidden xl:inline">Bulk Add</span>
              </button>
              <button 
                onClick={onOpenAddCategory}
                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-theme-text text-theme-background hover:bg-theme-primary hover:text-white transition-all text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              >
                <Plus size={18} strokeWidth={3} /> <span className="hidden xl:inline">Category</span>
              </button>
            </div>
          )}

          {!isPrivateView && (
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-theme-background/50 hover:bg-theme-surface border border-theme-border/50 text-theme-text-secondary hover:text-theme-text hover:scale-105 active:scale-95 transition-all shadow-sm"
              onClick={onThemeClick}
              title="Appearance"
            >
              <Palette size={18} />
            </button>
          )}

          {!isViewingShared && (
            <button 
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shadow-sm hover:scale-105 active:scale-95 ${
                isPrivateView 
                  ? 'bg-theme-primary/20 border-theme-primary/50 text-theme-primary hover:bg-theme-primary/30' 
                  : 'bg-theme-background/50 hover:bg-theme-surface border-theme-border/50 text-theme-text-secondary hover:text-theme-text'
              }`}
              onClick={onToggleVault}
              title={isPrivateView ? "Exit Private Vault" : "Enter Private Vault"}
            >
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor">
                <path fillRule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205l-.014-.058-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5s-1.411-.136-2.025-.267c-.541-.115-1.093.2-1.239.735m.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a30 30 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274M3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5m-1.5.5q.001-.264.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085q.084.236.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5"/>
              </svg>
            </button>
          )}
          
          {isViewingShared && (
            <button 
              onClick={onReturnToOwn}
              className="h-10 px-3 sm:px-4 flex items-center gap-2 rounded-xl bg-theme-surface/50 hover:bg-theme-surface border border-theme-border/50 text-theme-text-secondary hover:text-theme-text transition-all text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Back to My Arsenal</span>
            </button>
          )}

          {isViewingShared && viewingSavedId === null && (
            <button 
              onClick={onSaveShared}
              className="h-10 px-3 sm:px-4 flex items-center gap-2 rounded-xl bg-theme-primary text-white hover:opacity-90 transition-all text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 shadow-sm shadow-theme-primary/20"
            >
              <Save size={16} /> <span className="hidden sm:inline">Save</span>
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-10 px-3 sm:px-4 flex items-center gap-2 rounded-xl bg-theme-background/50 hover:bg-theme-surface border border-theme-border/50 text-theme-text transition-all shadow-sm font-semibold text-sm hover:scale-105 active:scale-95"
            >
              <span className="hidden sm:inline truncate max-w-[100px]">{username}</span>
              <span className="sm:hidden">{username.charAt(0).toUpperCase()}</span>
              <ChevronDown size={14} className={cn("transition-transform duration-300", isMenuOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(5px)" }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel overflow-hidden py-2 z-50 transform-origin-top-right border border-theme-border/60"
                >
                  {/* Dropdown Content */}
                  <button 
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                    onClick={() => {
                      onOpenSavedArsenals();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Archive size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                    Saved Arsenals
                  </button>

                  {isViewingShared ? (
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                      onClick={() => {
                        onExport();
                        setIsMenuOpen(false);
                      }}
                    >
                      <Download size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                      Export Data
                    </button>
                  ) : (
                    <>
                      <div className="px-4 py-2 mb-2 border-b border-theme-border/50">
                        <p className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">Account</p>
                      </div>
                      
                      {/* Mobile visible action buttons */}
                      <div className="md:hidden border-b border-theme-border/50 mb-2 pb-2">
                        <button 
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                          onClick={() => {
                            onOpenAddCategory();
                            setIsMenuOpen(false);
                          }}
                        >
                          <Plus size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                          New Category
                        </button>
                        <button 
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                          onClick={() => {
                            onOpenBulkAdd();
                            setIsMenuOpen(false);
                          }}
                        >
                          <Layers size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                          Bulk Add
                        </button>
                      </div>
                      
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                        onClick={() => {
                          onOpenSettings();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                        Settings
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                        onClick={() => {
                          onOpenTrashBin();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Trash2 size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                        Trash Bin
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                        onClick={() => {
                          onShare();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Share2 size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                        Share Arsenal
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                        onClick={() => {
                          onExport();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Download size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                        Export Data
                      </button>
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors group"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsMenuOpen(false);
                        }}
                      >
                        <Upload size={16} className="text-theme-text-secondary group-hover:text-theme-primary transition-colors" />
                        Import Data
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <input 
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </motion.header>
    </div>
  );
}
