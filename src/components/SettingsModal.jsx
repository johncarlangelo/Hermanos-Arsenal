import { useState, useEffect } from 'react';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence } from 'motion/react';
import { X, Settings, User, Trash2, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';
import ToggleSwitch from './ToggleSwitch';

export default function SettingsModal({ isOpen, onClose, username, onUpdateUsername, onClearData, enableThemeAnimation, onToggleThemeAnimation }) {
  const [name, setName] = useState(username || '');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(username || '');
      setActiveTab('profile');
    }
  }, [isOpen, username]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onUpdateUsername(name.trim());
      toast.success('Profile updated');
      onClose();
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      onClearData();
      toast.success('All data cleared');
      onClose();
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
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-lg bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col sm:flex-row min-h-[400px]"
          >
            {/* Sidebar Tabs */}
            <div className="w-full sm:w-48 bg-theme-background/30 p-4 border-b sm:border-b-0 sm:border-r border-theme-border/50 flex flex-row sm:flex-col gap-2">
              <div className="hidden sm:flex items-center gap-3 px-3 py-4 mb-2">
                <div className="w-8 h-8 bg-theme-primary/10 rounded-xl flex items-center justify-center text-theme-primary">
                  <Settings size={18} />
                </div>
                <h3 className="font-display font-bold text-theme-text text-lg">Settings</h3>
              </div>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 sm:flex-none flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-theme-primary text-white shadow-lg shadow-theme-primary/20' : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50'}`}
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 sm:flex-none flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'preferences' ? 'bg-theme-primary text-white shadow-lg shadow-theme-primary/20' : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50'}`}
              >
                <Sliders size={16} />
                <span className="hidden sm:inline">Preferences</span>
              </button>
              
              <button
                onClick={() => setActiveTab('data')}
                className={`flex-1 sm:flex-none flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'data' ? 'bg-theme-primary text-white shadow-lg shadow-theme-primary/20' : 'text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50'}`}
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Data</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 sm:p-8 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
              >
                <X size={18} />
              </button>

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Profile</h2>
                    <p className="text-theme-text-secondary text-sm mb-6">Update how you appear in your arsenal.</p>
                  </div>
                  
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
                        autoFocus
                        required
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={!name.trim() || name.trim() === username}
                      className="py-3 px-6 text-sm font-semibold bg-theme-primary text-white rounded-xl shadow-lg hover:shadow-theme-primary/25 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Preferences</h2>
                    <p className="text-theme-text-secondary text-sm mb-6">Customize your experience.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between p-4 bg-theme-background/30 rounded-xl border border-theme-border/50">
                      <div>
                        <h4 className="text-theme-text font-medium">Theme Switching Animation</h4>
                        <p className="text-theme-text-secondary text-sm">Show the splash screen when switching between themes to hide visual lag.</p>
                      </div>
                      <div className="ml-4">
                        <ToggleSwitch 
                          checked={enableThemeAnimation}
                          onChange={(e) => onToggleThemeAnimation(e.target.checked)}
                          colorClass="bg-theme-primary"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'data' && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Data Management</h2>
                    <p className="text-theme-text-secondary text-sm mb-6">Manage your local browser data.</p>
                  </div>
                  
                  <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                    <h4 className="text-red-500 font-semibold mb-2 flex items-center gap-2">
                      <Trash2 size={16} /> Danger Zone
                    </h4>
                    <p className="text-sm text-theme-text-secondary mb-4">
                      Permanently delete all categories, links, custom themes, and your profile data from this browser. This action is irreversible.
                    </p>
                    <button
                      onClick={handleClearData}
                      className="py-2.5 px-5 text-sm font-semibold bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    >
                      Clear All Data
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
