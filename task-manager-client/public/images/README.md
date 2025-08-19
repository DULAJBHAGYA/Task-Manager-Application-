# Images Directory

This directory contains all static images used in the TaskMate application.

## File Structure

```
public/images/
├── logo.png              # Main application logo (32x32px recommended)
├── landing/              # Landing page specific images
│   ├── hero-bg.jpg       # Hero section background
│   └── features/         # Feature section images
├── avatars/              # User avatar images
│   ├── default.png       # Default user avatar
│   └── user-avatars/     # Individual user avatars
├── icons/                # Application icons
│   ├── task-icon.svg     # Task related icons
│   ├── project-icon.svg  # Project related icons
│   └── calendar-icon.svg # Calendar related icons
└── README.md             # This file
```

## Logo Specifications

- **File**: `logo.png`
- **Size**: 32x32px (recommended for sidebar)
- **Format**: PNG with transparency
- **Location**: `/images/logo.png`
- **Usage**: Sidebar, navigation, footer

## Image Guidelines

1. **Optimize images** for web use (compress PNG/JPG files)
2. **Use appropriate formats**:
   - PNG for logos and icons with transparency
   - JPG for photographs and backgrounds
   - SVG for scalable icons
3. **Keep file sizes small** for faster loading
4. **Use descriptive filenames** for easy identification

## Usage in Components

```jsx
// Example usage in React components
<img 
  src="/images/logo.png" 
  alt="TaskMate Logo" 
  className="w-8 h-8 object-contain"
/>
```

## Current Logo Implementation

The logo is currently implemented in:
- Sidebar logo component
- Landing page navigation
- Auth page navigation  
- Footer section 