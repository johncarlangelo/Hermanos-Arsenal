import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers } from 'lucide-react';

export default function ThemeSplash({ onComplete, isInitialLoad, onDoorsClosed }) {
  // Initial load starts closed. Theme switch starts by animating from open to closed.
  const [stage, setStage] = useState(isInitialLoad ? 'closed' : 'closing');

  useEffect(() => {
    if (isInitialLoad) {
      const textFadeTimer = setTimeout(() => setStage('text-fade'), 1800);
      const doorOpenTimer = setTimeout(() => setStage('door-open'), 2200);
      const completeTimer = setTimeout(() => onComplete(), 3400);

      return () => {
        clearTimeout(textFadeTimer);
        clearTimeout(doorOpenTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Theme change transition
      const closeDuration = 1000; 

      const closedTimer = setTimeout(() => {
        setStage('closed'); // Fully closed
        if (onDoorsClosed) onDoorsClosed(); // Trigger the actual CSS theme change!
      }, closeDuration);

      const textFadeTimer = setTimeout(() => {
        setStage('text-fade');
      }, closeDuration + 1200);

      const doorOpenTimer = setTimeout(() => {
        setStage('door-open');
      }, closeDuration + 1600);

      const completeTimer = setTimeout(() => {
        onComplete();
      }, closeDuration + 2800);

      return () => {
        clearTimeout(closedTimer);
        clearTimeout(textFadeTimer);
        clearTimeout(doorOpenTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [onComplete, isInitialLoad, onDoorsClosed]);

  const areDoorsOpen = stage === 'door-open';
  const showText = stage === 'closed';

  const DoorPanel = ({ isLeft }) => (
    <div className={`w-[calc(100%-3rem)] h-[calc(100%-6rem)] border-2 border-theme-border/40 rounded-3xl m-8 ${isLeft ? 'mr-4' : 'ml-4'} p-8 flex flex-col justify-between relative overflow-hidden shadow-inner bg-theme-surface/50 backdrop-blur-md`}>
      {/* 4 Corner Rivets */}
      <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-theme-border/60 shadow-inner" />
      <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-theme-border/60 shadow-inner" />
      <div className="absolute bottom-6 left-6 w-3 h-3 rounded-full bg-theme-border/60 shadow-inner" />
      <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-theme-border/60 shadow-inner" />
      
      {/* Decorative mechanical details */}
      <div className={`absolute top-1/4 bottom-1/4 w-1.5 bg-theme-border/30 rounded-full ${isLeft ? 'right-6' : 'left-6'}`} />
      <div className={`absolute top-1/3 bottom-1/3 w-1.5 bg-theme-border/20 rounded-full ${isLeft ? 'right-10' : 'left-10'}`} />
      
      {/* Center lock mechanism half */}
      <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-32 bg-theme-border/20 ${isLeft ? 'right-0 rounded-l-xl' : 'left-0 rounded-r-xl'} backdrop-blur-sm`} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none select-none flex">
      {/* Left Door */}
      <motion.div
        initial={isInitialLoad ? { x: 0 } : { x: '-100%' }}
        animate={{ x: areDoorsOpen ? '-100%' : 0 }}
        transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }}
        className="w-1/2 h-full bg-theme-background border-r-2 border-theme-border shadow-[20px_0_40px_rgba(0,0,0,0.5)] pointer-events-auto relative z-10 flex items-center justify-end"
      >
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-theme-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-theme-border) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem'
          }}
        />
        <DoorPanel isLeft={true} />
      </motion.div>

      {/* Right Door */}
      <motion.div
        initial={isInitialLoad ? { x: 0 } : { x: '100%' }}
        animate={{ x: areDoorsOpen ? '100%' : 0 }}
        transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }}
        className="w-1/2 h-full bg-theme-background border-l-2 border-theme-border shadow-[-20px_0_40px_rgba(0,0,0,0.5)] pointer-events-auto relative z-10 flex items-center justify-start"
      >
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-theme-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-theme-border) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem'
          }}
        />
        <DoorPanel isLeft={false} />
      </motion.div>

      {/* Center Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-12 bg-theme-surface/80 backdrop-blur-2xl rounded-[3rem] border border-theme-border/50 shadow-2xl glass-panel relative"
            >
              <div className="w-24 h-24 bg-theme-primary/10 border-2 border-theme-primary/30 rounded-3xl flex items-center justify-center shadow-inner mb-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/20 to-theme-secondary/20" />
                 <Layers size={48} className="text-theme-primary drop-shadow-md relative z-10" />
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient tracking-tight drop-shadow-lg text-center leading-tight">
                Hermanos<br/>Arsenal
              </h1>
              {isInitialLoad && (
                <div className="flex items-center gap-3 mt-8 opacity-80">
                  <div className="w-2 h-2 rounded-full bg-theme-primary animate-pulse" />
                  <p className="text-theme-text-secondary font-medium tracking-[0.3em] uppercase text-xs">
                    Initializing Core Systems
                  </p>
                  <div className="w-2 h-2 rounded-full bg-theme-secondary animate-pulse" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
