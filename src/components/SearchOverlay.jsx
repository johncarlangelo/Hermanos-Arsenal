import { useEffect, useRef } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { Search, X, Folder, ExternalLink } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, query, setQuery, categories }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setTimeout(() => setQuery(''), 300);
    }
  }, [isOpen, setQuery]);

  const normalizedQuery = query.toLowerCase();
  
  const results = [];
  if (normalizedQuery) {
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(normalizedQuery)) {
        results.push({ type: 'category', item: cat });
      }
      (cat.links || []).forEach(link => {
        if (link.name.toLowerCase().includes(normalizedQuery) || link.url.toLowerCase().includes(normalizedQuery)) {
          results.push({ type: 'link', item: link, categoryName: cat.name });
        }
      });
    });
  }

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col p-4 sm:p-6 lg:p-12 items-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-theme-background/80 backdrop-blur-xl pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            layoutId="search-container"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-4xl bg-theme-surface/90 backdrop-blur-3xl border border-theme-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-h-[85vh] mt-[5vh]"
          >
            <div className="flex items-center p-6 sm:p-8 border-b border-theme-border/50 bg-theme-surface/50">
              <motion.div layoutId="search-icon" className="flex shrink-0">
                <Search size={32} className="text-theme-primary mr-5" strokeWidth={2.5} />
              </motion.div>
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-2xl sm:text-4xl text-theme-text focus:outline-none placeholder:text-theme-text-secondary/50 font-display font-bold w-full"
                placeholder="Search everything..."
              />
              <button 
                onClick={onClose} 
                className="p-3 bg-theme-background/50 hover:bg-theme-border rounded-2xl text-theme-text-secondary hover:text-theme-text transition-all hover:scale-105 active:scale-95 ml-4 shrink-0"
              >
                <X size={24} />
              </button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-theme-surface/10 to-theme-background/30 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-theme-border [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {!query ? (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-theme-text-secondary opacity-60">
                  <Search size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">Type to search across all your links and categories</p>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-theme-text-secondary opacity-60">
                  <p className="text-xl font-medium">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="grid gap-3 pb-8">
                  {results.map((result, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                      key={`${result.type}-${result.item.id}`}
                    >
                      {result.type === 'category' ? (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-theme-background/50 border border-theme-border/50 hover:border-theme-primary/50 transition-colors cursor-pointer group" onClick={onClose}>
                          <div className="w-12 h-12 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center shrink-0">
                            <Folder size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-theme-text group-hover:text-theme-primary transition-colors">{result.item.name}</h4>
                            <p className="text-sm text-theme-text-secondary">{result.item.links?.length || 0} links</p>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleLinkClick(result.item.url)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl bg-theme-surface/50 border border-theme-border/50 hover:border-theme-primary/50 hover:bg-theme-surface hover:shadow-lg hover:-translate-y-0.5 transition-all text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden border border-theme-border/20">
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${new URL(result.item.url).hostname}&sz=64`}
                              alt=""
                              className="w-6 h-6 group-hover:scale-110 transition-transform"
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-theme-text truncate group-hover:text-theme-primary transition-colors">{result.item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-theme-primary/30 bg-theme-primary/10 text-theme-primary tracking-wide uppercase">
                                {result.categoryName}
                              </span>
                              <span className="text-sm text-theme-text-secondary truncate">{result.item.url}</span>
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-theme-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                            <ExternalLink size={18} className="text-theme-primary" />
                          </div>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
