import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle } from 'lucide-react';
import { playSfx } from '../utils/sounds';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  confirmText = 'Confirm',
  icon: Icon = AlertTriangle,
  isDestructive = false
}) {
  const handleConfirm = () => {
    playSfx('pop');
    onConfirm();
  };

  const handleClose = () => {
    playSfx('snap');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-theme-background/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal Container */}
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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-theme-primary/10 text-theme-primary'}`}>
                  <Icon size={24} />
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">{title}</h2>
              <p className="text-theme-text-secondary text-sm mb-8">{message}</p>
              
              {/* Actions */}
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 text-base font-semibold bg-theme-background text-theme-text rounded-xl border border-theme-border hover:bg-theme-border/50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-3.5 text-base font-semibold text-white rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 ${isDestructive ? 'bg-red-500 hover:shadow-red-500/25' : 'bg-theme-primary hover:shadow-theme-primary/25'}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
