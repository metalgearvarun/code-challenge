# 🗂️ UX Engineer Take-Home Challenge

## Build a Folder Grid in React + TypeScript

### 🧭 Overview

This challenge is focused on building a responsive Folder Grid interface in React using TypeScript. It's designed to evaluate your skills in component architecture, styling, interaction design, and system-level thinking.

You'll be working in a preconfigured CodeSandbox environment that includes folder data and an icon system. Your task is to design and implement a reusable FolderGrid UI.

---

### ⚙️ Instructions

1. Fork the CodeSandbox and implement your solution.
   - All dependencies and mock data are included—no setup required
   - Feel free to download the challenge and work in your preferred editor
2. Add a short summary in the CodeSandbox description with:
   - Assumptions or decisions you made
   - Anything unfinished (if applicable)
3. Be prepared to walk us through your approach and code

---

### 📁 Provided Files

#### `public/data.json`

This file contains the mock data for the folder grid:

- Object with `files` and `folders` properties
- Each folder has properties like `fileIds`, `name`, `isPrivate`, `created`, `updated`
- Each file has properties like `name`, `type`, `created`, `updated`
- The data structure is fully typed with TypeScript interfaces in `src/types.ts`

#### `src/theme.ts`

This file provides the design system configuration:

- Color palette and typography settings
- Spacing and layout constants
- Animation timing and easing functions
- Responsive breakpoints
- Shadow and z-index configurations

#### `src/components/icon.tsx`

This file contains the icon component system:

- Reusable Icon component with TypeScript props interface
- Integration with Phosphor React icons
- Support for different sizes, colors, and weights

#### `src/types.ts`

This file contains TypeScript type definitions:

- `FolderData` interface for folder metadata
- `FileData` interface for file metadata
- `Data` interface for the complete data structure

---

### 🎯 Your Task

Implement a responsive FolderGrid component that:

- Displays a list of folders in a grid layout
- Allows selecting and removing multiple folders from the grid
- Is fully typed with TypeScript
- Looks good and functions well across screen sizes

Bonus Points:

- Add the ability to undo folder removal (e.g., temporary trash state or toast-based undo)

---

### ✅ Requirements

#### Technical

- React + TypeScript
- Strong component typing
- Responsive grid layout (CSS Grid or Flexbox)
- Clear component structure
- Clean, maintainable code

#### UI/UX

- Intuitive grid layout with visual hierarchy
- Smooth hover and selection animations
- Consistent styling using provided system
- Responsive and adaptive layout
- Sensible loading states
- Accessibility considerations (roles, focus, keyboard nav if possible)

---

### 🧪 How You'll Be Evaluated

#### Code Quality

- Type safety and prop typing
- Component reusability and structure
- Clean, readable code

#### UI/UX Craft

- Responsive and intuitive layout
- Attention to interaction states and hierarchy
- Touch support and accessibility

#### Technical Execution

- React and TypeScript best practices
- Performance considerations
- State management (if needed)

---

Thanks for taking the time to complete this—we're excited to see your work! Let us know if you have any questions.
