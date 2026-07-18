import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LockKeyhole } from 'lucide-react';
import { playSfx } from '../utils/sounds';
import { hashString } from '../utils/crypto';

export default function PinAuthModal({ isOpen, onClose, onAuth, correctPin, onForgotPin }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = async (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);
    
    playSfx('pop');
    setError(false);

    // Auto-advance
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === 3) {
      inputRefs.current[3]?.blur();
      
      const pinStr = newPin.join('');
      const hashedAttempt = await hashString(pinStr);
      
      if (hashedAttempt === correctPin || pinStr === correctPin) {
        // We check against plain text too just in case migration hasn't fired yet during active session
        setTimeout(() => onAuth(), 200);
      } else {
        setError(true);
        setTimeout(() => {
          setPin(['', '', '', '']);
          inputRefs.current[0]?.focus();
        }, 500);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    playSfx('snap');
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
            className={`relative w-full max-w-sm bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          >
            <div className="p-6 sm:p-8 flex flex-col items-center">
              <div className="w-full flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <LockKeyhole size={24} />
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2 text-center w-full">
                Enter Vault PIN
              </h2>
              <p className="text-theme-text-secondary text-sm mb-8 text-center">
                Access your private categories.
              </p>
              
              <div className="flex gap-4 justify-center mb-4">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={pin[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-14 h-16 text-center text-2xl font-bold bg-theme-background/50 text-theme-text rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      error 
                        ? 'border-red-500 focus:ring-red-500/50 text-red-500' 
                        : 'border-theme-border focus:ring-theme-primary/50 focus:border-theme-primary'
                    }`}
                  />
                ))}
              </div>
              
              <div className="h-6 mb-2">
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm font-medium"
                    >
                      Incorrect PIN
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={onForgotPin}
                className="text-sm text-theme-text-secondary hover:text-theme-primary transition-colors mt-2"
              >
                Forgot PIN?
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
