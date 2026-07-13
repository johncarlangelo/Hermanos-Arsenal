
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Link as LinkIcon, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareModal({ isOpen, onClose, longUrl }) {
  const handleCopyLong = async () => {
    try {
      await navigator.clipboard.writeText(longUrl);
      toast.success('Full link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleGenerateShort = () => {
    // We open TinyURL API directly in a new tab. It will instantly render a white page with just the short URL for the user to copy.
    // This perfectly bypasses CORS blocks and avoids database length limits from other providers like is.gd.
    window.open(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <Share2 size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Share Arsenal</h2>
              <p className="text-theme-text-secondary text-sm mb-6">
                Your share link is ready. Because all data is stored inside the link itself, it can be quite long.
              </p>
              
              <div className="space-y-4">
                {/* Full Link Option */}
                <div className="p-4 rounded-xl border border-theme-border/50 bg-theme-background/50 hover:border-theme-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-theme-text flex items-center gap-2 mb-1">
                        <LinkIcon size={14} className="text-theme-primary" /> Full Link
                      </h3>
                      <p className="text-xs text-theme-text-secondary">100% standalone and private. Best for permanent sharing.</p>
                    </div>
                    <button
                      onClick={handleCopyLong}
                      className="shrink-0 px-3 py-1.5 bg-theme-primary text-white rounded-lg text-xs font-semibold hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                </div>

                {/* Short Link Option */}
                <div className="p-4 rounded-xl border border-theme-border/50 bg-theme-background/50 hover:border-theme-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-theme-text flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-yellow-500" /> Short Link
                      </h3>
                      <p className="text-xs text-theme-text-secondary mb-3">Uses TinyURL to create a small link. Opens in a new tab.</p>
                      
                      <button
                        onClick={handleGenerateShort}
                        className="w-full py-2 bg-theme-surface border border-theme-border rounded-lg text-sm font-semibold text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary transition-colors flex items-center justify-center gap-2"
                      >
                        Open TinyURL in New Tab
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
