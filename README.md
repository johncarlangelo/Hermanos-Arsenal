# Hermanos Arsenal 🔗

A beautiful, fully client-side bookmark manager with customizable grid layouts, view modes, themes, and sharing capabilities. No backend required!

![Hermanos Arsenal](https://img.shields.io/badge/React-19.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Personal Identity**: Set your username on first visit for personalized welcome messages.
- **Smart Categories & Grid Layout**: Create, rename, delete, and reorder categories. Categories are laid out in a responsive grid.
- **Advanced Drag & Drop**: Buttery smooth drag & drop with `@dnd-kit` for both categories and individual links. Move links between categories!
- **Multiple View Styles**:
  - **Expanded**: Full view with title, hostname, and description.
  - **Minimal**: Compact view with small icon and title.
  - **Icons Only**: Pure icon grid with adjustable sizes (32px to 96px).
- **Custom Context Menus**: Right-click on categories, links, or the empty space to quickly add links, edit colors, change view styles, delete, or edit.
- **Persistent Storage**: Everything saved locally in your browser (`localStorage`).

### 🎨 Theme System
- **Default Themes**: Light and Dark mode.
- **Custom Themes**: Create unlimited custom themes with primary/secondary/surface colors.
- **Color Picker**: Intuitive color wheel + hex input.

### 📤 Export & Import
- **JSON Export**: Download your entire catalogue as a JSON file.
- **Smart Import**: Import with duplicate detection.

### 🔗 Sharing
- **One-Click Sharing**: Generate shareable links with encoded catalogue data.
- **Read-Only View**: Shared catalogues display owner's username.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johncarlangelo/LinkDock.git
   cd LinkDock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit (sortable, core, utilities)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + localStorage

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`:
- `linkdock-username`: Your username
- `linkdock-categories`: All categories and links
- `linkdock-current-theme`: Active theme
- `linkdock-custom-themes`: Your custom themes

**Note**: Clearing browser data will erase your dashboard. Use Export to backup!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.


---

**Built with ❤️ using React + Vite**

<!-- dont remove or edit after this line -->
*© Hermanos 2026 - For Hermanos. By Hermanos*