import { useState } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'framer-motion';

export default function UsernamePrompt({ isOpen, onSet }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSet(name.trim());
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
            className="absolute inset-0 bg-theme-background/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6, delay: 0.1 }}
            className="relative w-full max-w-md bg-theme-surface/50 border border-theme-border/50 rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
          >
            <div className="text-6xl mb-6 inline-block">👋</div>
            <h1 className="text-3xl font-display font-bold text-theme-text mb-2 tracking-tight">Welcome to Hermanos Arsenal</h1>
            <p className="text-theme-text-secondary mb-8">How should we address you?</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-6 py-4 text-center bg-theme-background text-theme-text text-lg font-medium rounded-2xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50"
                autoFocus
                required
              />
              <button 
                type="submit"
                disabled={!name.trim()}
                className="w-full px-6 py-4 text-lg font-semibold bg-theme-primary text-white rounded-2xl shadow-sm hover:shadow-lg hover:shadow-theme-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                Get Started
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
