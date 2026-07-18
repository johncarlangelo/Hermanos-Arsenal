import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, ShieldCheck, KeyRound, Copy, Check } from 'lucide-react';
import { playSfx } from '../utils/sounds';
import { generateBackupPhrase } from '../utils/crypto';

export default function PinSetupModal({ isOpen, onClose, onSave }) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1 = Enter, 2 = Confirm, 3 = Backup Phrase
  const [backupPhrase, setBackupPhrase] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setStep(1);
      setError('');
      setBackupPhrase(generateBackupPhrase());
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index, value, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;
    
    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value.substring(value.length - 1);
    
    if (isConfirm) setConfirmPin(newPin);
    else setPin(newPin);
    
    playSfx('pop');

    // Auto-advance
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === 3) {
      inputRefs.current[3]?.blur();
      
      if (!isConfirm) {
        setTimeout(() => {
          setStep(2);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }, 300);
      } else {
        const pinStr = pin.join('');
        const confirmStr = newPin.join('');
        if (pinStr === confirmStr) {
          setStep(3); // Move to backup phrase step
        } else {
          setError('PINs do not match. Try again.');
          setConfirmPin(['', '', '', '']);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
        }
      }
    }
  };

  const handleKeyDown = (index, e, isConfirm = false) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClose = () => {
    playSfx('snap');
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(backupPhrase);
      setIsCopied(true);
      playSfx('pop');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy phrase', err);
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
                  {step === 1 ? <Lock size={24} /> : step === 2 ? <ShieldCheck size={24} /> : <KeyRound size={24} />}
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2 text-center w-full">
                {step === 1 ? 'Setup Vault PIN' : step === 2 ? 'Confirm PIN' : 'Secret Recovery Phrase'}
              </h2>
              <p className="text-theme-text-secondary text-sm mb-8 text-center px-4">
                {step === 1 
                  ? 'Create a 4-digit PIN to secure your private categories.' 
                  : step === 2 
                    ? 'Enter your 4-digit PIN again to confirm.' 
                    : 'Write this 6-word phrase down and keep it safe. You will need it to recover your Vault if you forget your PIN.'}
              </p>
              
              {step < 3 ? (
                <div className="flex gap-4 justify-center mb-6">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={step === 1 ? pin[index] : confirmPin[index]}
                      onChange={(e) => handleChange(index, e.target.value, step === 2)}
                      onKeyDown={(e) => handleKeyDown(index, e, step === 2)}
                      className="w-14 h-16 text-center text-2xl font-bold bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full mb-6 flex flex-col gap-6">
                  <div className="bg-theme-background/50 p-6 rounded-xl border border-theme-border relative group">
                    <p className="text-theme-text font-mono font-bold tracking-wide leading-relaxed text-lg text-center pr-8">
                      {backupPhrase}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-lg bg-theme-surface/50 text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 transition-all"
                      title="Copy to clipboard"
                    >
                      {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <button
                    onClick={() => onSave(pin.join(''), backupPhrase)}
                    className="w-full py-3 bg-theme-primary text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    I have saved this phrase
                  </button>
                </div>
              )}
              
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-red-500 text-sm font-medium mb-4"
                >
                  {error}
                </motion.p>
              )}
              
              {step < 3 && (
                <p className="text-xs text-theme-text-secondary text-center mt-2 opacity-70">
                  This PIN is stored locally in your browser.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
