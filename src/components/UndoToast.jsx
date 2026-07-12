import { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UndoToast({ t, message, onUndo }) {
  const [progress, setProgress] = useState(100);
  const duration = 15000;

  useEffect(() => {
    const startTime = Date.now();
    let animationFrame;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining > 0) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-theme-surface shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-theme-border/50 backdrop-blur-xl`}
    >
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex-1 flex items-center gap-3 pr-4">
          <p className="text-sm font-medium text-theme-text">{message}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onUndo();
              toast.dismiss(t.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw size={14} />
            Undo
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="p-1.5 hover:bg-theme-border/50 text-theme-text-secondary hover:text-theme-text rounded-lg transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="h-1 bg-theme-border/50 w-full">
        <div 
          className="h-full bg-theme-primary transition-all ease-linear" 
          style={{ width: `${progress}%`, transitionDuration: '100ms' }}
        />
      </div>
    </div>
  );
}
