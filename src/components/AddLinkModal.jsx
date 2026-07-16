import { useState, useEffect } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Link as LinkIcon } from 'lucide-react';
import { playSfx } from '../utils/sounds';
import { fetchMetadata } from '../utils/metadata';

export default function AddLinkModal({ isOpen, onClose, onSave, categoryName, initialData }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isManualName, setIsManualName] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        if (initialData) {
          setUrl(initialData.url || '');
          setName(initialData.name || '');
          setDescription(initialData.description || '');
          setIsManualName(true);
        } else {
          setUrl('');
          setName('');
          setDescription('');
          setIsManualName(false);
        }
      }, 0);
    } else {
      timer = setTimeout(() => {
        setUrl('');
        setName('');
        setDescription('');
        setIsLoading(false);
        setIsManualName(false);
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [isOpen, initialData]);

  useEffect(() => {
    const fetchUrlMetadata = async () => {
      let fetchUrl = url.trim();
      if (fetchUrl && !isManualName) {
        if (!fetchUrl.startsWith('http://') && !fetchUrl.startsWith('https://')) {
          // Naive check if it looks like a domain before trying to fetch
          if (fetchUrl.includes('.')) {
             fetchUrl = 'https://' + fetchUrl;
          } else {
             return; // Don't fetch if it's just a word without protocol or dot
          }
        }
        
        if (fetchUrl.match(/^https?:\/\/.+/)) {
          setIsLoading(true);
          try {
            const metadata = await fetchMetadata(fetchUrl);
            if (metadata && metadata.title && !isManualName) {
              setName(metadata.title);
            }
          } catch {
            // ignore
          } finally {
            setIsLoading(false);
          }
        }
      }
    };

    const timeoutId = setTimeout(fetchUrlMetadata, 500);
    return () => clearTimeout(timeoutId);
  }, [url, isManualName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim() && name.trim()) {
      playSfx('pop');
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        if (finalUrl.includes('.')) {
          finalUrl = 'https://' + finalUrl;
        } else {
          // Fallback to searching or just ignore if it's invalid
          return;
        }
      }
      
      try {
        new URL(finalUrl);
        onSave({ url: finalUrl, name: name.trim(), description: description.trim() });
        onClose();
      } catch {
        // invalid URL
      }
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setIsManualName(true);
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
            className="relative w-full max-w-md bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <LinkIcon size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">
                {initialData ? 'Edit Link' : 'Add New Link'}
              </h2>
              <p className="text-theme-text-secondary text-sm mb-6">
                {initialData ? 'Editing link in ' : 'Adding to '}<span className="font-semibold text-theme-text">{categoryName}</span>
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
                    autoFocus
                    required
                  />
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Display Name"
                      className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
                      required
                    />
                    {isLoading && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!url.trim() || !name.trim()}
                  className="w-full py-3.5 mt-2 text-base font-semibold bg-theme-primary text-white rounded-xl shadow-lg hover:shadow-theme-primary/25 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Save Link
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
