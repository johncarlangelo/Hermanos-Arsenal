import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const defaultKeybinds = {
  search: { key: 'k', meta: true, ctrl: true },
  addLink: { key: 'a', alt: true }, // Changed to Alt+A to prevent Ctrl+N browser conflict
  bulkAdd: { key: 'b', meta: true, ctrl: true },
  addCategory: { key: 'm', meta: true, ctrl: true }
};

/**
 * Normalizes a key event to check against our internal keybind representation.
 * We treat 'meta' (Cmd on Mac) and 'ctrl' (Ctrl on Windows) interchangeably for universal bindings.
 */
export function isKeybindMatch(event, keybind) {
  if (!keybind) return false;
  
  const keyMatches = event.key.toLowerCase() === keybind.key.toLowerCase();
  
  // We allow either meta or ctrl to trigger a "command" type modifier
  const modifierMatches = (keybind.meta || keybind.ctrl) 
    ? (event.metaKey || event.ctrlKey)
    : (!event.metaKey && !event.ctrlKey);
    
  const shiftMatches = !!keybind.shift === !!event.shiftKey;
  const altMatches = !!keybind.alt === !!event.altKey;

  return keyMatches && modifierMatches && shiftMatches && altMatches;
}

export function formatKeybind(keybind) {
  if (!keybind) return '';
  const parts = [];
  // Based on user feedback, universally use ⌘ for the primary modifier (Cmd/Ctrl)
  if (keybind.meta || keybind.ctrl) parts.push('⌘');
  if (keybind.shift) parts.push('Shift');
  if (keybind.alt) parts.push('Alt');
  parts.push(keybind.key.toUpperCase());
  return parts.join(' ');
}

export function useKeybinds() {
  const [keybinds, setKeybinds] = useLocalStorage('linkdock-keybinds', defaultKeybinds);

  // Ensure all default keybinds exist in case new ones were added after initial save
  useEffect(() => {
    let hasMissing = false;
    const updated = { ...keybinds };
    
    for (const [key, value] of Object.entries(defaultKeybinds)) {
      if (!updated[key]) {
        updated[key] = value;
        hasMissing = true;
      }
    }
    
    if (hasMissing) {
      setKeybinds(updated);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateKeybind = (action, newKeybind) => {
    setKeybinds(prev => ({
      ...prev,
      [action]: newKeybind
    }));
  };

  return {
    keybinds,
    updateKeybind,
    setKeybinds
  };
}
