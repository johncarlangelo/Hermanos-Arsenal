import { useState } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Layers } from 'lucide-react';
import { fetchMetadata } from '../utils/metadata';

export default function BulkAddModal({ isOpen, onClose, onSave, categories }) {
  const [text, setText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedCategoryId) return;

    setIsLoading(true);
    const urls = text.split('\n').map(l => l.trim()).filter(l => l);
    const validUrls = [];
    
    for (let u of urls) {
      if (!u.startsWith('http://') && !u.startsWith('https://')) {
        if (u.includes('.')) {
          u = 'https://' + u;
        } else {
          continue;
        }
      }
      try {
        new URL(u);
        validUrls.push(u);
      } catch {
        // invalid URL
      }
    }

    const linksToAdd = [];
    for (const url of validUrls) {
      let name = url;
      try {
        const metadata = await fetchMetadata(url);
        if (metadata && metadata.title) {
          name = metadata.title;
        }
      } catch { /* ignore */ }
      linksToAdd.push({ url, name });
    }

    onSave(selectedCategoryId, linksToAdd);
    setText('');
    setIsLoading(false);
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
            className="relative w-full max-w-lg bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-secondary/10 rounded-2xl flex items-center justify-center text-theme-secondary">
                  <Layers size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Bulk Add Links</h2>
              <p className="text-theme-text-secondary text-sm mb-6">
                Paste multiple URLs (one per line) to add them all at once.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    Target Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full px-4 py-3 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all font-medium appearance-none"
                    required
                  >
                    {categories.length === 0 && <option value="">No categories available</option>}
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                    URLs (one per line)
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="https://example.com&#10;https://google.com"
                    className="w-full h-32 px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium resize-none"
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!text.trim() || !selectedCategoryId || isLoading}
                  className="w-full py-3.5 mt-2 text-base font-semibold bg-theme-secondary text-white rounded-xl shadow-lg hover:shadow-theme-secondary/25 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Add Links'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
