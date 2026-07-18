import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound } from 'lucide-react';
import { playSfx } from '../utils/sounds';

export default function PinRecoveryModal({ isOpen, onClose, onRecover }) {
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phrase.trim()) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const isValid = await onRecover(phrase);
      if (!isValid) {
        setError('Incorrect recovery phrase.');
        playSfx('error'); // Assuming you have an error sound, else ignore
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    playSfx('snap');
    setPhrase('');
    setError('');
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
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-sm bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <KeyRound size={24} />
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2 text-center w-full">
                Recover Vault
              </h2>
              <p className="text-theme-text-secondary text-sm mb-6 text-center">
                Enter your 6-word secret recovery phrase to reset your PIN.
              </p>
              
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <textarea
                  value={phrase}
                  onChange={(e) => {
                    setPhrase(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. apple brave crane drift eagle flame"
                  className="w-full h-24 bg-theme-background/50 text-theme-text text-sm rounded-xl border border-theme-border p-3 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all resize-none"
                />
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-red-500 text-sm font-medium text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !phrase.trim()}
                  className="w-full py-3 bg-theme-primary text-white font-semibold rounded-xl hover:shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Verify Phrase
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
