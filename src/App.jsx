import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { /* eslint-disable-line no-unused-vars */ motion, AnimatePresence, LayoutGroup } from 'motion/react';
import UsernamePrompt from './components/UsernamePrompt';
import Header from './components/Header';
import ThemePicker from './components/ThemePicker';
import Category from './components/Category';
import GridLayout from './components/GridLayout';
import SortableCategory from './components/SortableCategory';
import ShareModal from './components/ShareModal';
import AddCategoryModal from './components/AddCategoryModal';
import AddLinkModal from './components/AddLinkModal';
import BulkAddModal from './components/BulkAddModal';
import SettingsModal from './components/SettingsModal';
import CategoryIconPickerModal from './components/CategoryIconPickerModal';
import SavedArsenalsModal from './components/SavedArsenalsModal';
import PinSetupModal from './components/PinSetupModal';
import PinAuthModal from './components/PinAuthModal';
import ContextMenu from './components/ContextMenu';
import AnimatedBackground from './components/AnimatedBackground';
import GreetingClock from './components/GreetingClock';
import SearchOverlay from './components/SearchOverlay';
import UndoToast from './components/UndoToast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeybinds, isKeybindMatch } from './hooks/useKeybinds';
import { defaultThemes, incognitoTheme, applyTheme } from './utils/theme';
import { exportCatalogue, importCatalogue, mergeData, detectDuplicates } from './utils/export';
import { generateShareLink, getSharedCatalogueFromUrl } from './utils/share';
import { playSfx } from './utils/sounds';
import { hashString } from './utils/crypto';
import PinRecoveryModal from './components/PinRecoveryModal';
import { Plus, X, AlertTriangle, Eye } from 'lucide-react';
import Checkbox from './components/Checkbox';
import ThemeSplash from './components/ThemeSplash';
import GlobalTooltip from './components/GlobalTooltip';
import TrashBinModal from './components/TrashBinModal';

function App() {
  const [username, setUsername] = useLocalStorage('linkdock-username', null);
  const [categories, setCategories] = useLocalStorage('linkdock-categories', []);
  const [defaultCategorySize, setDefaultCategorySize] = useLocalStorage('linkdock-default-category-size', { width: 400, height: 400 });
  const [currentTheme, setCurrentTheme] = useLocalStorage('linkdock-current-theme', defaultThemes.midnight);
  const [customThemes, setCustomThemes] = useLocalStorage('linkdock-custom-themes', {});
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [sharedData, setSharedData] = useState(() => {
    const data = getSharedCatalogueFromUrl();
    if (data && (!data.categories || !Array.isArray(data.categories))) {
      return null;
    }
    return data;
  });
  const [isViewingShared, setIsViewingShared] = useState(() => {
    const data = getSharedCatalogueFromUrl();
    return !!(data && data.categories && Array.isArray(data.categories));
  });
  const [savedArsenals, setSavedArsenals] = useLocalStorage('linkdock-saved-arsenals', []);
  const [viewingSavedId, setViewingSavedId] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedArsenalsModalOpen, setIsSavedArsenalsModalOpen] = useState(false);
  const [isCategoryIconPickerOpen, setIsCategoryIconPickerOpen] = useState(false);
  const [editingCategoryAppearance, setEditingCategoryAppearance] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrashBinOpen, setIsTrashBinOpen] = useState(false);
  const [trashItems, setTrashItems] = useLocalStorage('linkdock-trash', []);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentShareUrl, setCurrentShareUrl] = useState('');

  // Private Vault State
  const [vaultPin, setVaultPin] = useLocalStorage('linkdock-vault-pin', null);
  const [vaultBackupHash, setVaultBackupHash] = useLocalStorage('linkdock-vault-backup', null);
  const [isPrivateView, setIsPrivateView] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);
  const [isPinAuthOpen, setIsPinAuthOpen] = useState(false);
  const [isPinRecoveryOpen, setIsPinRecoveryOpen] = useState(false);
  const [preVaultTheme, setPreVaultTheme] = useLocalStorage('linkdock-prevault-theme', null);

  // Revert Incognito theme on reload if not in private view
  useEffect(() => {
    if (currentTheme?.name === 'Incognito' && !isPrivateView) {
      setCurrentTheme(preVaultTheme || defaultThemes.midnight);
      setPreVaultTheme(null);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Migration for plain text PIN
  useEffect(() => {
    if (vaultPin && vaultPin.length === 4) {
      // It's a plain text PIN, let's hash it
      hashString(vaultPin).then(hashed => {
        setVaultPin(hashed);
      });
    }
  }, [vaultPin, setVaultPin]);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pendingTheme, setPendingTheme] = useState(null);
  
  // Preferences
  const [enableThemeAnimation, setEnableThemeAnimation] = useLocalStorage('linkdock-theme-animation', true);
  const [enableSoundEffects, setEnableSoundEffects] = useLocalStorage('linkdock-sound-enabled', true);

  const [hiddenOutdatedBanners, setHiddenOutdatedBanners] = useLocalStorage('linkdock-hidden-outdated-banners', []);
  const [dismissedSessionBanners, setDismissedSessionBanners] = useState([]);
  const [dontRemindOutdated, setDontRemindOutdated] = useState(false);

  // Determine if viewing outdated arsenal
  const activeSavedArsenal = isViewingShared && viewingSavedId ? savedArsenals.find(a => a.id === viewingSavedId) : null;
  const isOutdatedView = activeSavedArsenal && savedArsenals.some(a => a.username === activeSavedArsenal.username && new Date(a.timestamp).getTime() > new Date(activeSavedArsenal.timestamp).getTime());
  const showOutdatedBanner = isOutdatedView && !hiddenOutdatedBanners.includes(viewingSavedId) && !dismissedSessionBanners.includes(viewingSavedId);

  // Auto-clear trash items older than 30 days
  useEffect(() => {
    if (!trashItems || trashItems.length === 0) return;
    const now = new Date().getTime();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const filteredTrash = trashItems.filter(item => {
      const deletedAt = new Date(item.deletedAt).getTime();
      return (now - deletedAt) < thirtyDaysInMs;
    });
    if (filteredTrash.length !== trashItems.length) {
      setTrashItems(filteredTrash);
    }
  }, [trashItems, setTrashItems]);

  // Keybinds Hook
  const { keybinds, updateKeybind } = useKeybinds();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) && !isSearchOpen) {
        return;
      }
      
      if (isKeybindMatch(e, keybinds.search)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (isKeybindMatch(e, keybinds.addLink) && !isViewingShared) {
        e.preventDefault();
        setIsAddLinkModalOpen(true);
      } else if (isKeybindMatch(e, keybinds.bulkAdd) && !isViewingShared) {
        e.preventDefault();
        setIsBulkAddModalOpen(true);
      } else if (isKeybindMatch(e, keybinds.addCategory) && !isViewingShared) {
        e.preventDefault();
        setIsAddCategoryModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keybinds, isViewingShared, isSearchOpen]);

  // Add click outside listener for context menu

  useEffect(() => {
    let themeToApply = currentTheme;
    // If it's a default theme, ensure we're using the latest colors from code, not just the cached ones
    if (!currentTheme.isCustom) {
      const defaultThemeMatch = Object.values(defaultThemes).find(t => t.name === currentTheme.name);
      if (defaultThemeMatch) {
        themeToApply = defaultThemeMatch;
        // Update localStorage if the colors are outdated
        if (JSON.stringify(defaultThemeMatch.colors) !== JSON.stringify(currentTheme.colors)) {
          setCurrentTheme(defaultThemeMatch);
        }
      }
    }
    applyTheme(themeToApply);
  }, [currentTheme, setCurrentTheme]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      // Don't show custom context menu if viewing shared data (or handle it read-only)
      if (isViewingShared) return;

      let current = e.target;
      while (current && current !== document.body) {
        if (current.dataset.contextType) {
          e.preventDefault();
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            type: current.dataset.contextType,
            id: current.dataset.contextId,
            categoryId: current.dataset.categoryId,
            url: current.dataset.url,
            name: current.dataset.name,
            description: current.dataset.description,
            starred: current.dataset.starred,
            viewType: current.dataset.viewType,
            iconSize: current.dataset.iconSize && !isNaN(current.dataset.iconSize) ? parseInt(current.dataset.iconSize) : 48
          });
          return;
        }
        current = current.parentElement;
      }
      // If we clicked on the background
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        type: 'global'
      });
    };

    const handleClick = () => {
      if (contextMenu) setContextMenu(null);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, [isViewingShared, contextMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUsernameSet = (name) => setUsername(name);
  const handleExport = () => {
    if (isViewingShared && sharedData) {
      exportCatalogue(sharedData, sharedData.username || 'Shared');
    } else {
      exportCatalogue({ username, categories }, username);
    }
  };
  const handleImport = async (file) => {
    try {
      const importedData = await importCatalogue(file);
      const importedCategories = Array.isArray(importedData) ? importedData : importedData.categories;
      
      if (!importedCategories || !Array.isArray(importedCategories)) {
        throw new Error('Invalid file format. No categories found.');
      }
      
      const { duplicates } = detectDuplicates(categories, importedCategories);
      
      if (duplicates.length > 0) {
        toast((t) => (
          <div className="flex flex-col gap-3">
            <div>
              <strong>Found {duplicates.length} duplicate categories</strong>
              <p className="text-sm opacity-80 mt-1">How would you like to handle them?</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setCategories(mergeData(categories, importedCategories, 'replace'));
                  toast.dismiss(t.id);
                  toast.success('Imported and replaced duplicates');
                }}
                className="px-4 py-1.5 border border-theme-border rounded-lg text-sm font-medium hover:bg-theme-surface"
              >
                Replace
              </button>
              <button
                onClick={() => {
                  setCategories(mergeData(categories, importedCategories, 'merge'));
                  toast.dismiss(t.id);
                  toast.success('Imported and merged links');
                }}
                className="px-4 py-1.5 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90"
              >
                Merge
              </button>
            </div>
          </div>
        ), { duration: 10000 });
      } else {
        setCategories(mergeData(categories, importedCategories));
        toast.success('Import successful!');
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    const handleMoveLink = (e) => {
      const { sourceCategoryId, linkId, targetCategoryId } = e.detail;
      setCategories(prev => {
        const sourceCat = prev.find(cat => cat.id === sourceCategoryId);
        if (!sourceCat) return prev;
        
        const linkIndex = sourceCat.links.findIndex(link => link.id === linkId);
        if (linkIndex === -1) return prev;
        
        const linkToMove = sourceCat.links[linkIndex];
        
        return prev.map(cat => {
          if (cat.id === sourceCategoryId) {
            return { ...cat, links: cat.links.filter(link => link.id !== linkId) };
          }
          if (cat.id === targetCategoryId) {
            return { ...cat, links: [...(cat.links || []), linkToMove] };
          }
          return cat;
        });
      });
    };

    window.addEventListener('linkdock-move-link', handleMoveLink);
    return () => window.removeEventListener('linkdock-move-link', handleMoveLink);
  }, [setCategories]);

  const handleShare = async () => {
    try {
      const shareUrl = await generateShareLink({ username, categories });
      setCurrentShareUrl(shareUrl);
      setIsShareModalOpen(true);
    } catch (e) {
      toast.error('Failed to generate share link ' + (e.message || ''));
    }
  };

  const triggerThemeChange = (theme) => {
    if (enableThemeAnimation) {
      setPendingTheme(theme);
      setIsInitialLoad(false);
      setShowSplash(true);
    } else {
      setCurrentTheme(theme);
    }
  };

  const handleThemeChange = (theme) => triggerThemeChange(theme);
  
  const handleClearData = () => {
    localStorage.removeItem('linkdock-username');
    localStorage.removeItem('linkdock-categories');
    localStorage.removeItem('linkdock-current-theme');
    localStorage.removeItem('linkdock-custom-themes');
    localStorage.removeItem('linkdock-vault-pin');
    setUsername(null);
    setCategories([]);
    setCustomThemes({});
    setVaultPin(null);
    setIsPrivateView(false);
    triggerThemeChange(defaultThemes.midnight);
  };

  const handleSaveCustomTheme = (theme) => {
    const newThemes = { ...customThemes, [theme.name.toLowerCase().replace(/\s+/g, '-')]: theme };
    setCustomThemes(newThemes);
    triggerThemeChange(theme);
  };
  const handleDeleteCustomTheme = (themeKey) => {
    const newThemes = { ...customThemes };
    delete newThemes[themeKey];
    setCustomThemes(newThemes);
    if (currentTheme.name === customThemes[themeKey].name) {
      triggerThemeChange(defaultThemes.midnight);
    }
  };
  
  const handleSelectArsenal = (id) => {
    if (id === null) {
      setIsViewingShared(false);
      setSharedData(null);
      setViewingSavedId(null);
      window.history.pushState({}, '', window.location.pathname);
    } else {
      const arsenal = savedArsenals.find(a => a.id === id);
      if (arsenal) {
        setIsViewingShared(true);
        setSharedData({ username: arsenal.username, categories: arsenal.categories });
        setViewingSavedId(id);
      }
    }
  };

  const handleDeleteSavedArsenal = (id) => {
    setSavedArsenals(prev => prev.filter(a => a.id !== id));
    if (viewingSavedId === id) {
      handleSelectArsenal(null);
    }
    toast.success('Saved Arsenal removed');
  };

  const handleReturnToOwn = () => {
    handleSelectArsenal(null);
  };

  const handleSaveSharedToOwn = () => {
    if (!sharedData || !sharedData.categories) return;
    
    const targetUsername = sharedData.username || 'Friend';
    
    // Check for exact duplication
    const isDuplicate = savedArsenals.some(a => 
      a.username === targetUsername && 
      JSON.stringify(a.categories) === JSON.stringify(sharedData.categories)
    );
    
    if (isDuplicate) {
      toast.error("You have already saved this exact arsenal snapshot!");
      return;
    }
    
    const newArsenal = {
      id: Date.now().toString(),
      username: targetUsername,
      categories: sharedData.categories,
      timestamp: new Date().toISOString()
    };
    
    setSavedArsenals(prev => [...prev, newArsenal]);
    toast.success(`Saved ${newArsenal.username}'s Arsenal!`);
    
    setViewingSavedId(newArsenal.id);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleAddCategory = (name) => {
    setCategories([...categories, {
      id: Date.now().toString(),
      name,
      links: [],
      order: categories.length,
      size: defaultCategorySize,
      isPrivate: isPrivateView,
      createdAt: new Date().toISOString()
    }]);
  };

  const handleRenameCategory = (id, newName) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, name: newName } : cat));
  };
  
  const handleResizeCategory = (id, newSize) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, size: newSize } : cat));
    setDefaultCategorySize(newSize);
  };
  
  const handleDeleteCategory = (id, categoryName) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <strong>Delete "{categoryName}"?</strong>
          <p className="text-sm opacity-80 mt-1">This will delete the category and all its links.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 border border-theme-border rounded-lg text-sm font-medium hover:bg-theme-surface"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const categoryToDelete = categories.find(cat => cat.id === id);
              if (categoryToDelete) {
                setTrashItems(prev => [...prev, {
                  id: Date.now().toString(),
                  type: 'category',
                  data: categoryToDelete,
                  deletedAt: new Date().toISOString()
                }]);
              }
              setCategories(categories.filter(cat => cat.id !== id));
              toast.dismiss(t.id);
              toast.success(`Deleted "${categoryName}"`);
              playSfx('trash');
            }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const handleAddLink = (categoryId, linkData) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          links: [...(cat.links || []), { id: Date.now().toString(), ...linkData, createdAt: new Date().toISOString() }]
        };
      }
      return cat;
    }));
  };

  const handleBulkAddLinks = (categoryId, linksData) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        const newLinks = linksData.map((ld, i) => ({
          id: Date.now().toString() + i,
          ...ld,
          createdAt: new Date().toISOString()
        }));
        return {
          ...cat,
          links: [...(cat.links || []), ...newLinks]
        };
      }
      return cat;
    }));
    toast.success(`Added ${linksData.length} links!`);
  };

  const handleDeleteLink = (categoryId, linkId) => {
    let linkToRestore = null;
    let linkIndex = -1;
    let categoryName = '';
    
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      categoryName = category.name;
      linkIndex = category.links.findIndex(l => l.id === linkId);
      if (linkIndex !== -1) {
        linkToRestore = category.links[linkIndex];
      }
    }

    if (!linkToRestore) return;

    playSfx('trash');

    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, links: cat.links.filter(link => link.id !== linkId) };
      }
      return cat;
    }));

    if (linkToRestore) {
      const trashItemId = Date.now().toString();
      setTrashItems(prev => [...prev, {
        id: trashItemId,
        type: 'link',
        data: linkToRestore,
        originalCategoryId: categoryId,
        originalCategoryName: categoryName,
        deletedAt: new Date().toISOString()
      }]);

      toast.custom((t) => (
        <UndoToast 
          t={t} 
          message={`Deleted link "${linkToRestore.name || linkToRestore.url}"`}
          onUndo={() => {
            setTrashItems(prev => prev.filter(item => item.id !== trashItemId));
            setCategories(prev => prev.map(cat => {
              if (cat.id === categoryId) {
                const newLinks = [...(cat.links || [])];
                newLinks.splice(linkIndex, 0, linkToRestore);
                return { ...cat, links: newLinks };
              }
              return cat;
            }));
          }}
        />
      ), { duration: 5000, position: 'bottom-center' });
    }
  };

  const handleRestoreFromTrash = (item) => {
    if (item.type === 'category') {
      setCategories(prev => [...prev, item.data]);
      setTrashItems(prev => prev.filter(t => t.id !== item.id));
      toast.success(`Restored category`);
    } else if (item.type === 'link') {
      const categoryExists = categories.some(cat => cat.id === item.originalCategoryId);
      if (!categoryExists) {
        toast.error(`Original category "${item.originalCategoryName}" no longer exists.`);
        return;
      }
      setCategories(prev => prev.map(cat => {
        if (cat.id === item.originalCategoryId) {
          return { ...cat, links: [...(cat.links || []), item.data] };
        }
        return cat;
      }));
      setTrashItems(prev => prev.filter(t => t.id !== item.id));
      toast.success(`Restored link`);
    }
  };

  const handlePermanentDeleteFromTrash = (id) => {
    setTrashItems(prev => prev.filter(t => t.id !== id));
  };

  const handleEmptyTrash = () => {
    setTrashItems([]);
    toast.success('Trash emptied');
  };

  const handleOpenAddLinkModal = (categoryId) => {
    setActiveCategoryId(categoryId);
    setIsAddLinkModalOpen(true);
  };

  const handleSaveLink = (linkData) => {
    if (editingLink) {
      handleUpdateLink(editingLink.categoryId, editingLink.id, linkData);
      setEditingLink(null);
    } else if (activeCategoryId) {
      handleAddLink(activeCategoryId, linkData);
    }
  };

  const handleUpdateLink = (categoryId, linkId, updates) => {
    setCategories(categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          links: cat.links.map(link => link.id === linkId ? { ...link, ...updates } : link)
        };
      }
      return cat;
    }));
  };

  const handleContextMenuAction = (action, menuData) => {
    if (!['set-category-view'].includes(action)) {
      setContextMenu(null);
    } else {
      setContextMenu(prev => prev ? { ...prev, ...menuData } : null);
    }
    
    switch (action) {
      case 'open-link':
        window.open(menuData.url, '_blank', 'noopener,noreferrer');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(menuData.url).then(() => {
          toast.success('URL copied to clipboard');
        });
        break;
      case 'delete-link':
        handleDeleteLink(menuData.categoryId, menuData.id);
        break;
      case 'toggle-star-link':
        handleUpdateLink(menuData.categoryId, menuData.id, { isStarred: menuData.starred !== 'true' });
        break;
      case 'edit-link':
        // We can reuse the AddLinkModal for editing, we just need to pass an initial link state
        setEditingLink(menuData);
        setIsAddLinkModalOpen(true);
        break;
      case 'add-link':
        handleOpenAddLinkModal(menuData.id);
        break;
      case 'rename-category':
        window.dispatchEvent(new CustomEvent('linkdock-rename-category', { detail: menuData.id }));
        break;
      case 'delete-category':
        handleDeleteCategory(menuData.id, menuData.name);
        break;
      case 'open-category-icon-picker':
        setEditingCategoryAppearance(categories.find(cat => cat.id === menuData.id));
        setIsCategoryIconPickerOpen(true);
        break;
      case 'set-category-view':
        setCategories(categories.map(cat => cat.id === menuData.id ? { 
          ...cat, 
          viewType: menuData.viewType ?? cat.viewType,
          iconSize: menuData.iconSize ?? cat.iconSize 
        } : cat));
        break;
      case 'new-category':
        setIsAddCategoryModalOpen(true);
        break;
      case 'bulk-add':
        setIsBulkAddModalOpen(true);
        break;
      default:
        break;
    }
  };

  if (!username && !isViewingShared) {
    return <UsernamePrompt isOpen={true} onSet={handleUsernameSet} onUsernameSet={handleUsernameSet} />;
  }

  const handleToggleVault = () => {
    if (isPrivateView) {
      // Exiting vault
      setIsPrivateView(false);
      if (preVaultTheme) {
        triggerThemeChange(preVaultTheme);
      }
    } else {
      // Entering vault
      if (!vaultPin) {
        setIsPinSetupOpen(true);
      } else {
        setIsPinAuthOpen(true);
      }
    }
  };

  const handlePinAuthSuccess = () => {
    setIsPinAuthOpen(false);
    setIsPrivateView(true);
    setPreVaultTheme(currentTheme);
    triggerThemeChange(incognitoTheme);
  };

  const handlePinSetupSuccess = async (pin, backupPhrase) => {
    const hashedPin = await hashString(pin);
    const hashedBackup = await hashString(backupPhrase);
    setVaultPin(hashedPin);
    setVaultBackupHash(hashedBackup);
    setIsPinSetupOpen(false);
    setIsPrivateView(true);
    setPreVaultTheme(currentTheme);
    triggerThemeChange(incognitoTheme);
  };

  const handleRecoverPin = async (phrase) => {
    const hashedAttempt = await hashString(phrase);
    if (hashedAttempt === vaultBackupHash) {
      setIsPinRecoveryOpen(false);
      setIsPinSetupOpen(true); // Open setup to create a new PIN
      return true;
    }
    return false;
  };

  const handleDeleteVault = () => {
    setVaultPin(null);
    setVaultBackupHash(null);
    setCategories(categories.filter(cat => !cat.isPrivate));
    if (isPrivateView) {
      setIsPrivateView(false);
      if (preVaultTheme) triggerThemeChange(preVaultTheme);
    }
  };

  const displayCategories = isViewingShared 
    ? (sharedData?.categories || []) 
    : categories.filter(c => !!c.isPrivate === isPrivateView);
    
  const displayUsername = isViewingShared ? sharedData?.username : username;
  const activeCategory = categories.find(cat => cat.id === activeCategoryId);

  return (
    <LayoutGroup>
      {showSplash && (
        <ThemeSplash 
          isInitialLoad={isInitialLoad} 
          onDoorsClosed={() => {
            if (pendingTheme) {
              setCurrentTheme(pendingTheme);
              setPendingTheme(null);
            }
          }}
          onComplete={() => setShowSplash(false)} 
        />
      )}
      <div className="relative min-h-screen bg-theme-background text-theme-text selection:bg-theme-primary/30 font-sans">
        <AnimatedBackground themeName={currentTheme.name} isPrivateView={isPrivateView} />

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--color-theme-surface)',
              color: 'var(--color-theme-text)',
              border: '1px solid var(--color-theme-border)',
              borderRadius: '1rem',
              padding: '16px 20px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
              fontWeight: 500,
            },
            success: {
              iconTheme: { primary: 'var(--color-theme-primary)', secondary: 'white' },
            },
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen pt-28">
          <Header 
            username={displayUsername}
            onExport={handleExport}
            onImport={handleImport}
            onShare={handleShare}
            onThemeClick={() => setIsThemePickerOpen(true)}
            isViewingShared={isViewingShared}
            sharedUsername={sharedData?.username}
            viewingSavedId={viewingSavedId}
            onReturnToOwn={handleReturnToOwn}
            onSaveShared={handleSaveSharedToOwn}
            onSearchClick={() => setIsSearchOpen(true)}
            onOpenBulkAdd={() => setIsBulkAddModalOpen(true)}
            onOpenAddCategory={() => setIsAddCategoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenSavedArsenals={() => setIsSavedArsenalsModalOpen(true)}
            onOpenTrashBin={() => setIsTrashBinOpen(true)}
            isPrivateView={isPrivateView}
            onToggleVault={handleToggleVault}
            keybinds={keybinds}
          />

          <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col gap-12">
            
            {/* Hero / Action Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
              className="flex flex-col items-center justify-center space-y-4 mt-8 mb-4"
            >
              {isViewingShared && (
                <div className="w-full max-w-2xl bg-theme-surface border border-theme-border/50 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm">
                  <Eye size={20} className="text-theme-text-secondary shrink-0" />
                  <span className="text-sm font-medium text-theme-text-secondary text-center">
                    <strong className="text-theme-text font-semibold mr-1">View-Only Mode:</strong> 
                    You are exploring a saved snapshot. To customize these links, export this arsenal and import it into your own profile.
                  </span>
                </div>
              )}

              {showOutdatedBanner && (
                <div className="w-full max-w-2xl bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-orange-500">
                    <AlertTriangle size={20} className="shrink-0" />
                    <span className="text-sm font-semibold">You are viewing an outdated version of this Arsenal.</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        checked={dontRemindOutdated}
                        onChange={(e) => setDontRemindOutdated(e.target.checked)}
                        colorClass="text-orange-500"
                        id="dontRemindOutdated"
                      />
                      <label htmlFor="dontRemindOutdated" className="text-xs font-medium text-theme-text-secondary select-none cursor-default">
                        Don't remind me again
                      </label>
                    </div>
                    <button 
                      onClick={() => {
                        if (dontRemindOutdated) {
                          setHiddenOutdatedBanners(prev => [...prev, viewingSavedId]);
                        } else {
                          setDismissedSessionBanners(prev => [...prev, viewingSavedId]);
                        }
                      }}
                      className="p-1.5 text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <GreetingClock 
                username={displayUsername} 
                isViewingShared={isViewingShared}
                sharedUsername={sharedData?.username}
                isPrivateView={isPrivateView}
              />
            </motion.div>

            {/* Grid Section */}
            <AnimatePresence mode="wait">
              {displayCategories.length === 0 ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-32 h-32 mb-8 rounded-[2.5rem] glass-card flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-theme-primary/20 to-theme-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-500">✨</div>
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">Space is looking pristine</h2>
                  <p className="text-theme-text-secondary max-w-md text-lg mb-10 font-medium">
                    Start building your personalized collection of links and resources.
                  </p>
                  {!isViewingShared && (
                    <button 
                      onClick={() => setIsAddCategoryModalOpen(true)}
                      className="flex items-center gap-2 px-8 py-4 bg-theme-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-theme-primary/30 hover:shadow-theme-primary/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                      <Plus size={24} strokeWidth={3} />
                      Create First Category
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="grid"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.2 }}
                  className="min-h-[400px]"
                >
                  <GridLayout 
                    categories={displayCategories}
                    setCategories={setCategories}
                    onRename={handleRenameCategory}
                    onDelete={handleDeleteCategory}
                    onAddLink={handleOpenAddLinkModal}
                    onDeleteLink={handleDeleteLink}
                  >
                    {displayCategories.map((category) => (
                      <SortableCategory key={category.id} id={category.id}>
                        {({ dragHandleProps }) => (
                          <Category
                            id={category.id}
                            name={category.name}
                            color={category.color}
                            icon={category.icon}
                            size={category.size}
                            viewType={category.viewType}
                            iconSize={category.iconSize}
                            links={category.links || []}
                            onRename={handleRenameCategory}
                            onResize={handleResizeCategory}
                            onDelete={handleDeleteCategory}
                            onAddLink={handleOpenAddLinkModal}
                            onDeleteLink={handleDeleteLink}
                            dragHandleProps={dragHandleProps}
                            isLocked={isViewingShared}
                          />
                        )}
                      </SortableCategory>
                    ))}
                  </GridLayout>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        <SearchOverlay 
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          query={searchQuery}
          setQuery={setSearchQuery}
          categories={displayCategories}
        />

        <ThemePicker
          isOpen={isThemePickerOpen}
          onClose={() => setIsThemePickerOpen(false)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          customThemes={customThemes}
          onSaveCustomTheme={handleSaveCustomTheme}
          onDeleteCustomTheme={handleDeleteCustomTheme}
        />
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          longUrl={currentShareUrl}
        />
        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => setIsAddCategoryModalOpen(false)}
          onSave={handleAddCategory}
        />
        <AddLinkModal
          isOpen={isAddLinkModalOpen}
          onClose={() => {
            setIsAddLinkModalOpen(false);
            setActiveCategoryId(null);
            setEditingLink(null);
          }}
          onSave={handleSaveLink}
          categoryName={activeCategory?.name || (editingLink ? 'Edit Link' : '')}
          initialData={editingLink}
        />
        <BulkAddModal 
          isOpen={isBulkAddModalOpen}
          onClose={() => setIsBulkAddModalOpen(false)}
          onSave={handleBulkAddLinks}
          categories={categories}
        />
        <SavedArsenalsModal 
          isOpen={isSavedArsenalsModalOpen}
          onClose={() => setIsSavedArsenalsModalOpen(false)}
          savedArsenals={savedArsenals}
          onSelectArsenal={handleSelectArsenal}
          onDeleteArsenal={handleDeleteSavedArsenal}
          currentViewingId={viewingSavedId}
        />
        <PinSetupModal 
          isOpen={isPinSetupOpen}
          onClose={() => setIsPinSetupOpen(false)}
          onSave={handlePinSetupSuccess}
        />
        <PinAuthModal 
        isOpen={isPinAuthOpen} 
        onClose={() => setIsPinAuthOpen(false)}
        onAuth={handlePinAuthSuccess}
        correctPin={vaultPin}
        onForgotPin={() => {
          setIsPinAuthOpen(false);
          setIsPinRecoveryOpen(true);
        }}
      />
      
      <PinRecoveryModal
        isOpen={isPinRecoveryOpen}
        onClose={() => setIsPinRecoveryOpen(false)}
        onRecover={handleRecoverPin}
      />
        <ContextMenu 
          menu={contextMenu} 
          onClose={() => setContextMenu(null)} 
          onAction={handleContextMenuAction} 
        />
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          username={username}
          onUpdateUsername={setUsername}
          onClearData={handleClearData}
          onDeleteVault={handleDeleteVault}
          enableThemeAnimation={enableThemeAnimation}
          onToggleThemeAnimation={setEnableThemeAnimation}
          enableSoundEffects={enableSoundEffects}
          onToggleSoundEffects={setEnableSoundEffects}
          keybinds={keybinds}
          updateKeybind={updateKeybind}
        />
        <CategoryIconPickerModal
          isOpen={isCategoryIconPickerOpen}
          onClose={() => {
            setIsCategoryIconPickerOpen(false);
            setEditingCategoryAppearance(null);
          }}
          onSave={(id, appearance) => {
            setCategories(categories.map(cat => 
              cat.id === id ? { ...cat, icon: appearance.icon, color: appearance.color } : cat
            ));
          }}
          category={editingCategoryAppearance}
        />
        <TrashBinModal
          isOpen={isTrashBinOpen}
          onClose={() => setIsTrashBinOpen(false)}
          trashItems={trashItems}
          onRestore={handleRestoreFromTrash}
          onPermanentDelete={handlePermanentDeleteFromTrash}
          onEmptyTrash={handleEmptyTrash}
        />
        <GlobalTooltip />
      </div>
    </LayoutGroup>
  );
}

export default App;
