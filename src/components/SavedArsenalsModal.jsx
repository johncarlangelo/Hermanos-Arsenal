import { useState } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Archive, Trash2, ExternalLink } from 'lucide-react';

export default function SavedArsenalsModal({ 
  isOpen, 
  onClose, 
  savedArsenals = [], 
  viewingSavedId = null,
  onSelectArsenal,
  onDeleteSavedArsenal
}) {
  const [arsenalToDelete, setArsenalToDelete] = useState(null);

  // Sort arsenals by newest first
  const sortedArsenals = [...savedArsenals].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Compute the latest timestamp for each username
  const latestByUsername = {};
  savedArsenals.forEach(arsenal => {
    const currentLatest = latestByUsername[arsenal.username];
    const arsenalTime = new Date(arsenal.timestamp).getTime();
    if (!currentLatest || arsenalTime > currentLatest) {
      latestByUsername[arsenal.username] = arsenalTime;
    }
  });

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
            className="relative w-full max-w-md max-h-[80vh] flex flex-col bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <Archive size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-display font-bold text-theme-text mb-2 shrink-0">Saved Arsenals</h2>
              <p className="text-theme-text-secondary text-sm mb-6 shrink-0">
                Manage and view the snapshots you've saved from your friends.
              </p>
              
              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2 pb-4 custom-scrollbar">
                {sortedArsenals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-theme-text-secondary text-sm">No saved arsenals yet.</p>
                  </div>
                ) : (
                  sortedArsenals.map(arsenal => {
                    const isViewing = viewingSavedId === arsenal.id;
                    const dateAdded = new Date(arsenal.timestamp).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    });
                    
                    const arsenalTime = new Date(arsenal.timestamp).getTime();
                    const isLatest = arsenalTime === latestByUsername[arsenal.username];
                    const hasMultipleVersions = savedArsenals.filter(a => a.username === arsenal.username).length > 1;
                    const isStale = hasMultipleVersions && !isLatest;

                    return (
                      <div 
                        key={arsenal.id} 
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                          isViewing ? 'border-theme-primary bg-theme-primary/5' : 'border-theme-border hover:bg-theme-primary/5'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-theme-text truncate min-w-0">{arsenal.username}'s Arsenal</span>
                            {isStale && (
                              <span className="text-[9px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                Outdated
                              </span>
                            )}
                            {isLatest && hasMultipleVersions && (
                              <span className="text-[9px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                                Latest
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-theme-text-secondary uppercase tracking-wider bg-theme-background w-max px-2 py-0.5 rounded-full border border-theme-border/50">
                            Saved {dateAdded}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {isViewing ? (
                            <span className="px-3 py-1.5 text-xs font-semibold text-theme-primary bg-theme-primary/10 rounded-lg">
                              Currently Viewing
                            </span>
                          ) : (
                            <button 
                              onClick={() => {
                                onSelectArsenal(arsenal.id);
                                onClose();
                              }}
                              className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium bg-theme-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <ExternalLink size={14} /> View
                            </button>
                          )}
                          <button 
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            onClick={() => setArsenalToDelete(arsenal.id)}
                            title="Delete Arsenal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Delete Confirmation Overlay */}
              <AnimatePresence>
                {arsenalToDelete && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-theme-surface/80 backdrop-blur-md rounded-[2rem]"
                  >
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="w-full bg-theme-background border border-theme-border/60 rounded-2xl p-6 shadow-2xl text-center relative"
                    >
                      <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <Trash2 size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-theme-text mb-2">Delete Saved Arsenal?</h3>
                      <p className="text-sm text-theme-text-secondary mb-6">
                        Are you sure you want to permanently remove this snapshot from your saved arsenals?
                      </p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setArsenalToDelete(null)}
                          className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-theme-border text-theme-text hover:bg-theme-surface transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            onDeleteSavedArsenal(arsenalToDelete);
                            setArsenalToDelete(null);
                          }}
                          className="flex-1 py-2.5 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
