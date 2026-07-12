import { useState } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, FolderPlus } from 'lucide-react';

export default function AddCategoryModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
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
                  <FolderPlus size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">New Category</h2>
              <p className="text-theme-text-secondary text-sm mb-6">Create a new space to organize your related links.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Design Resources"
                    className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
                    autoFocus
                    required
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full py-3.5 text-base font-semibold bg-theme-primary text-white rounded-xl shadow-lg hover:shadow-theme-primary/25 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Create Category
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
