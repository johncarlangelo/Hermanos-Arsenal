# Hermanos Arsenal - Design System & Guidelines

This document outlines the core design philosophy, reusable patterns, spacing guidelines, and component structures used across the Hermanos Arsenal codebase. Whenever creating new modals, UI elements, or features, please refer to this guide to ensure visual and functional consistency.

## 🎨 Typography

We use two primary fonts, imported via Google Fonts:
- **Display Font (`font-display`)**: `Outfit` (used for Headings, Logos, emphasis)
- **Base Font (`font-sans`)**: `Plus Jakarta Sans` (used for Body text, paragraphs, buttons, general UI)

### Usage Patterns
- **Main Headings (Modals)**: `text-2xl font-display font-bold text-theme-text`
- **Subtext/Descriptions**: `text-sm text-theme-text-secondary`
- **Buttons**: `text-sm font-semibold` or `text-base font-semibold`

## 🎨 Color System (CSS Variables)

The application uses a dynamic theme system based on CSS variables, mapped to Tailwind classes via `@theme` in `src/index.css`. **Do not hardcode hex colors** (except for specific destructive actions like delete `red-500`).

Always use the semantic `theme-*` utility classes:
- **Backgrounds**: `bg-theme-background`, `bg-theme-surface`
- **Text**: `text-theme-text`, `text-theme-text-secondary`
- **Accents**: `text-theme-primary`, `bg-theme-primary`, `text-theme-secondary`
- **Borders**: `border-theme-border`
- **Hovers**: `hover:bg-theme-hover`, `hover:text-theme-hover-text`

*Note: You can apply opacity directly to these classes, e.g., `bg-theme-background/50` or `text-theme-primary/10`.*

## 💎 Global UI Utilities

These classes are globally available in `src/index.css` and should be favored to maintain the "glassmorphic" aesthetic of the application:
- **`.glass-panel`**: Heavy frosted glass with drop shadows (e.g., used for main structural elements or headers).
- **`.glass-card`**: Lighter frosted glass (e.g., used for category blocks or links).
- **`.text-gradient`**: Text with a horizontal gradient spanning from `theme-primary` to `theme-secondary`.
- **`.bg-noise`**: Adds a grainy noise overlay (use sparingly on large background canvases).

## 🔳 Component Structures

### 1. Modals & Dialogs

All modals **must** follow the same Framer Motion structure and layout to preserve consistency. 

**Standard Modal Wrapper Pattern:**
```jsx
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function ExampleModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-theme-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-md bg-theme-surface/90 backdrop-blur-xl border border-theme-border rounded-[2rem] shadow-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-theme-primary/10 rounded-2xl flex items-center justify-center text-theme-primary">
                  <Icon size={24} />
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-theme-text-secondary hover:text-theme-text hover:bg-theme-border/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-display font-bold text-theme-text mb-2">Modal Title</h2>
              <p className="text-theme-text-secondary text-sm mb-6">Brief description here.</p>
              
              {/* Form / Content */}
              <form className="space-y-6">
                 {/* Inputs... */}
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

**Key Layout Rules for Modals:**
- `rounded-[2rem]` for the outer modal container.
- `p-6 sm:p-8` for the internal padding.
- Include a close button (`<X size={18} />`) in the top right.
- Use a `w-12 h-12` icon box (`bg-theme-primary/10`, `rounded-2xl`) in the top left for primary actions.

### 2. Forms & Inputs
Inputs should always be spacious and clearly focused:
```jsx
<input
  className="w-full px-4 py-3.5 bg-theme-background/50 text-theme-text rounded-xl border border-theme-border focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-theme-primary transition-all placeholder:text-theme-text-secondary/50 font-medium"
/>
```
- **Radius**: `rounded-xl`
- **Padding**: `py-3.5 px-4`
- **Focus States**: Ring border using `focus:ring-theme-primary/50`

### 3. Primary Buttons
Buttons should be robust, with shadow interactions.
```jsx
<button
  className="w-full py-3.5 text-base font-semibold bg-theme-primary text-white rounded-xl shadow-lg hover:shadow-theme-primary/25 disabled:opacity-50 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all"
>
  Save
</button>
```
- `rounded-xl`
- `py-3.5` for full-width, large buttons.
- `hover:-translate-y-0.5` micro-interaction.

### 4. Spacing & Layout
- Prefer gap-based layouts using `flex` or `grid` with Tailwind's `gap-x`, `gap-y` utilities.
- Vertical rhythm inside cards/modals usually follows `space-y-6`.
- Keep max-width constraints on the main app container: `max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8`.

### 5. Checkboxes (Custom Checkbox Component)
Do not use native checkboxes if you need custom styling. Use the reusable `<Checkbox>` component (`src/components/Checkbox.jsx`):
```jsx
import Checkbox from './components/Checkbox';

<Checkbox 
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
  colorClass="text-theme-primary"
/>
```
- The component handles accessibility under the hood by wrapping a native hidden input.
- You should provide your own unclickable `<label>` alongside it.
- **Customization**: Pass a `colorClass` to adapt it to warnings (`text-orange-500`) or specific themes.

## 🔮 Animations & Transitions
- `motion/react` is the standard animation library. Use it for entrances/exits (`AnimatePresence`) and layout animations (`LayoutGroup`, `layoutId`).
- For standard CSS hover effects, always include `transition-all` or `transition-colors` with a default tailwind duration.

## ❗ Danger Actions (Destructive)
When styling destructive actions (delete, clear data):
- Use standard `red-500` instead of the dynamic theme variables.
- Example destructive zone:
```jsx
<div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
  <h4 className="text-red-500 font-semibold mb-2 flex items-center gap-2">
    <Trash2 size={16} /> Danger Zone
  </h4>
  {/* Content */}
</div>
```

---
*Follow these patterns strictly to maintain a unified user experience in Hermanos Arsenal.*
