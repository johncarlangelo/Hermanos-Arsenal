import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, RotateCcw, AlertTriangle, Link as LinkIcon, Folder } from 'lucide-react';
export default function TrashBinModal({ 
  isOpen, 
  onClose, 
  trashItems, 
  onRestore, 
  onPermanentDelete, 
  onEmptyTrash 
}) {
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Simple relative time formatter
  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Sort trash items so most recently deleted are at the top
  const sortedItems = [...(trashItems || [])].sort((a, b) => 
    new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()
  );

  const handleClose = () => {
    setShowEmptyConfirm(false);
    setConfirmDeleteId(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="relative w-full max-w-2xl bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="p-6 sm:p-8 flex-shrink-0">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <Trash2 size={24} />
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Trash Bin</h2>
              <p className="text-theme-text-secondary text-sm mb-4">
                Items here will be permanently deleted after 30 days.
              </p>

              {sortedItems.length > 0 && !showEmptyConfirm && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowEmptyConfirm(true)}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Empty Trash
                  </button>
                </div>
              )}

              <AnimatePresence>
                {showEmptyConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                      <h4 className="text-red-500 font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} /> Danger Zone
                      </h4>
                      <p className="text-sm text-theme-text-secondary mb-4">
                        Are you sure you want to permanently delete all items in the trash? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            onEmptyTrash();
                            setShowEmptyConfirm(false);
                          }}
                          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
                        >
                          Yes, empty trash
                        </button>
                        <button
                          onClick={() => setShowEmptyConfirm(false)}
                          className="px-4 py-2 border border-theme-border/50 text-theme-text text-sm font-semibold rounded-xl hover:bg-theme-surface transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
              {sortedItems.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-theme-border/50">
                  <Trash2 size={48} className="mx-auto text-theme-text-secondary/30 mb-4" />
                  <h3 className="text-lg font-medium text-theme-text mb-1">Trash is empty</h3>
                  <p className="text-sm text-theme-text-secondary">No recently deleted items.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {sortedItems.map(item => {
                    const isLink = item.type === 'link';
                    const Icon = isLink ? LinkIcon : Folder;
                    const isConfirming = confirmDeleteId === item.id;
                    
                    return (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-colors gap-4 ${isConfirming ? 'border-red-500/30 bg-red-500/5' : 'border-theme-border/50 bg-theme-background/30 hover:bg-theme-surface'}`}
                      >
                        {isConfirming ? (
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertTriangle size={16} />
                              <span className="text-sm font-semibold">Delete permanently?</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  onPermanentDelete(item.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1.5 border border-theme-border/50 text-theme-text text-xs font-semibold rounded-lg hover:bg-theme-surface transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${isLink ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                <Icon size={20} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-theme-text truncate text-sm">
                                  {item.data.name || item.data.url}
                                </h4>
                                <p className="text-xs text-theme-text-secondary truncate mt-0.5 flex gap-2">
                                  <span className="capitalize">{item.type}</span>
                                  <span>&bull;</span>
                                  <span>Deleted {formatRelativeTime(item.deletedAt)}</span>
                                  {isLink && item.originalCategoryName && (
                                    <>
                                      <span>&bull;</span>
                                      <span>From: {item.originalCategoryName}</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => onRestore(item)}
                                className="p-2 text-theme-text-secondary hover:text-theme-primary hover:bg-theme-primary/10 rounded-lg transition-colors"
                                title="Restore"
                              >
                                <RotateCcw size={18} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="p-2 text-theme-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete Permanently"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
