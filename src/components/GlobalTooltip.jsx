import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function GlobalTooltip() {
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const handleShow = (e) => setTooltip(e.detail);
    const handleHide = () => setTooltip(null);

    window.addEventListener('linkdock-show-tooltip', handleShow);
    window.addEventListener('linkdock-hide-tooltip', handleHide);
    // Hide on any scroll event to prevent detached tooltips
    window.addEventListener('scroll', handleHide, true);

    return () => {
      window.removeEventListener('linkdock-show-tooltip', handleShow);
      window.removeEventListener('linkdock-hide-tooltip', handleHide);
      window.removeEventListener('scroll', handleHide, true);
    };
  }, []);

  return (
    <AnimatePresence>
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 99999
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="px-3 py-1.5 bg-theme-surface/95 backdrop-blur-xl border border-theme-border text-theme-text text-xs font-medium rounded-lg shadow-xl whitespace-nowrap flex items-center justify-center relative"
          >
            {tooltip.text}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-theme-surface/95 border-b border-r border-theme-border rotate-45"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
