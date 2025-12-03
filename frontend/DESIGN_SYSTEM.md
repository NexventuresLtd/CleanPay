# 🎨 CleanPay UI - Design System Reference

Quick reference for the Tailwind v4 design system used in CleanPay.

## 🎨 Colors

### Using Colors in Components

All colors are defined as CSS variables and used with Tailwind's bracket notation:

```tsx
// Primary color
className = "bg-[var(--color-primary)]";
className = "text-[var(--color-primary)]";
className = "border-[var(--color-primary)]";

// Hover state
className = "hover:bg-[var(--color-primary-hover)]";

// Light variant
className = "bg-[var(--color-primary-light)]";
```

### Color Palette

| Color           | Variable                  | Hex       | Usage               |
| --------------- | ------------------------- | --------- | ------------------- |
| **Primary**     | `--color-primary`         | `#2563eb` | Main actions, links |
| Primary Hover   | `--color-primary-hover`   | `#1d4ed8` | Hover states        |
| Primary Light   | `--color-primary-light`   | `#dbeafe` | Backgrounds         |
| Primary Dark    | `--color-primary-dark`    | `#1e40af` | Dark mode           |
| **Secondary**   | `--color-secondary`       | `#64748b` | Secondary actions   |
| Secondary Hover | `--color-secondary-hover` | `#475569` | Hover states        |
| **Success**     | `--color-success`         | `#10b981` | Success states      |
| Success Hover   | `--color-success-hover`   | `#059669` | Hover states        |
| Success Light   | `--color-success-light`   | `#d1fae5` | Backgrounds         |
| **Warning**     | `--color-warning`         | `#f59e0b` | Warning states      |
| Warning Light   | `--color-warning-light`   | `#fef3c7` | Backgrounds         |
| **Danger**      | `--color-danger`          | `#ef4444` | Errors, delete      |
| Danger Hover    | `--color-danger-hover`    | `#dc2626` | Hover states        |
| Danger Light    | `--color-danger-light`    | `#fee2e2` | Backgrounds         |
| **Info**        | `--color-info`            | `#3b82f6` | Information         |

### Text Colors

```tsx
// Primary text (dark)
className = "text-[var(--color-text-primary)]"; // #111827

// Secondary text (medium)
className = "text-[var(--color-text-secondary)]"; // #4b5563

// Tertiary text (light)
className = "text-[var(--color-text-tertiary)]"; // #6b7280

// Disabled text
className = "text-[var(--color-text-disabled)]"; // #9ca3af

// Inverse text (white on dark bg)
className = "text-[var(--color-text-inverse)]"; // #ffffff
```

### Background Colors

```tsx
// Base (white)
className = "bg-[var(--color-bg-base)]"; // #ffffff

// Subtle (very light gray)
className = "bg-[var(--color-bg-subtle)]"; // #f9fafb

// Muted (light gray)
className = "bg-[var(--color-bg-muted)]"; // #f3f4f6

// Emphasis (medium gray)
className = "bg-[var(--color-bg-emphasis)]"; // #e5e7eb
```

### Border Colors

```tsx
// Base border
className = "border-[var(--color-border-base)]"; // #e5e7eb

// Emphasis (darker)
className = "border-[var(--color-border-emphasis)]"; // #d1d5db

// Muted (lighter)
className = "border-[var(--color-border-muted)]"; // #f3f4f6
```

## 📏 Spacing

### Padding & Margin

```tsx
// Small spacing (4px)
className = "p-1"; // padding: 4px
className = "px-1"; // padding-left & right: 4px
className = "py-1"; // padding-top & bottom: 4px

// Medium spacing (8px)
className = "p-2"; // padding: 8px

// Standard spacing (16px)
className = "p-4"; // padding: 16px

// Large spacing (24px)
className = "p-6"; // padding: 24px

// Extra large (32px)
className = "p-8"; // padding: 32px
```

### Gap (Flexbox/Grid)

```tsx
// Small gap
className = "gap-2"; // 8px gap

// Medium gap
className = "gap-4"; // 16px gap

// Large gap
className = "gap-6"; // 24px gap
```

## 🔤 Typography

### Font Sizes

```tsx
className = "text-xs"; // 12px - Small labels
className = "text-sm"; // 14px - Body text, buttons
className = "text-base"; // 16px - Default body
className = "text-lg"; // 18px - Subheadings
className = "text-xl"; // 20px - Headings
className = "text-2xl"; // 24px - Large headings
className = "text-3xl"; // 30px - Page titles
className = "text-4xl"; // 36px - Hero text
```

### Font Weights

```tsx
className = "font-normal"; // 400 - Body text
className = "font-medium"; // 500 - Emphasis
className = "font-semibold"; // 600 - Headings
className = "font-bold"; // 700 - Strong emphasis
```

### Line Heights

```tsx
className = "leading-tight"; // 1.25 - Headings
className = "leading-normal"; // 1.5 - Body text (default)
className = "leading-relaxed"; // 1.625 - Comfortable reading
```

## 🔘 Border Radius

```tsx
// Small (2px)
className = "rounded-[var(--radius-sm)]";

// Base (4px)
className = "rounded-[var(--radius-base)]";

// Medium (6px)
className = "rounded-[var(--radius-md)]";

// Large (8px) - Buttons
className = "rounded-[var(--radius-lg)]";

// Extra large (12px)
className = "rounded-[var(--radius-xl)]";

// 2X large (16px) - Cards
className = "rounded-[var(--radius-2xl)]";

// Full (9999px) - Pills, circles
className = "rounded-[var(--radius-full)]";
```

## 🌑 Shadows

```tsx
// Small shadow
className = "shadow-[var(--shadow-sm)]";

// Base shadow
className = "shadow-[var(--shadow-base)]";

// Medium shadow (cards)
className = "shadow-[var(--shadow-md)]";

// Large shadow (modals)
className = "shadow-[var(--shadow-lg)]";

// Extra large shadow
className = "shadow-[var(--shadow-xl)]";
```

## 📦 Component Patterns

### Card

```tsx
<div className="bg-[var(--color-bg-base)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] p-6">
  {/* Card content */}
</div>
```

### Button (Primary)

```tsx
<button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-text-inverse)] rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-hover)] transition-colors">
  Button
</button>
```

### Input Field

```tsx
<input
  className="px-3 py-2 border border-[var(--color-border-base)] rounded-[var(--radius-lg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
  type="text"
/>
```

### Alert (Error)

```tsx
<div className="p-4 bg-[var(--color-danger-light)] border-l-4 border-[var(--color-danger)] rounded-[var(--radius-lg)]">
  <p className="text-[var(--color-danger-dark)]">Error message</p>
</div>
```

### Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{/* Content */}</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
```

### Flex Layout

```tsx
<div className="flex items-center justify-between gap-4">
  {/* Flex items */}
</div>
```

## 🎯 Common Patterns

### Full-height Page

```tsx
<div className="min-h-screen bg-[var(--color-bg-subtle)]">
  {/* Page content */}
</div>
```

### Centered Container

```tsx
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="w-full max-w-md">{/* Centered content */}</div>
</div>
```

### Header

```tsx
<header className="bg-[var(--color-bg-base)] border-b border-[var(--color-border-base)]">
  <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
    {/* Header content */}
  </div>
</header>
```

### Loading Spinner

```tsx
<div className="animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-border-base)] border-t-[var(--color-primary)]"></div>
```

### Hover Effect

```tsx
className = "transition-colors duration-200 hover:bg-[var(--color-bg-muted)]";
```

### Focus Ring

```tsx
className =
  "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2";
```

## 🔧 Utility Classes

### Responsive Design

```tsx
// Mobile first approach
className = "text-base md:text-lg lg:text-xl";
className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
className = "px-4 sm:px-6 lg:px-8";
```

### Conditional Classes (with clsx)

```tsx
import clsx from 'clsx';

className={clsx(
  'base-classes',
  isActive && 'active-classes',
  isError && 'error-classes',
  size === 'large' && 'large-classes'
)}
```

### Transitions

```tsx
// Quick transition
className = "transition-all duration-200";

// Color transition
className = "transition-colors duration-200";

// Transform transition
className = "transition-transform duration-300";
```

## 📱 Responsive Breakpoints

```tsx
// Tailwind breakpoints:
sm:  // >= 640px
md:  // >= 768px
lg:  // >= 1024px
xl:  // >= 1280px
2xl: // >= 1536px

// Usage:
className="text-sm md:text-base lg:text-lg"
```

## 🎨 Quick Copy-Paste

### Stat Card

```tsx
<div className="bg-[var(--color-bg-base)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6">
  <div className="flex items-center justify-between mb-4">
    <div className="p-3 rounded-[var(--radius-lg)] bg-[var(--color-primary-light)]">
      {/* Icon */}
    </div>
    <span className="text-sm font-medium text-[var(--color-success)]">
      +12%
    </span>
  </div>
  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
    $24,532
  </h3>
  <p className="text-sm text-[var(--color-text-tertiary)]">Total Revenue</p>
</div>
```

### Form Group

```tsx
<div className="space-y-6">{/* Multiple inputs with consistent spacing */}</div>
```

### Link Style

```tsx
<a
  href="#"
  className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
>
  Link text
</a>
```

---

## 💡 Pro Tips

1. **Always use CSS variables** - Never hardcode colors
2. **Use spacing scale** - Stick to 4px increments
3. **Consistent radius** - lg for buttons, 2xl for cards
4. **Transition everything** - Add `transition-colors duration-200` for smooth interactions
5. **Focus states** - Always include focus rings for accessibility
6. **Responsive by default** - Use mobile-first approach
7. **Dark mode ready** - CSS variables make theming easy

---

**Need to add a new color?** Add it to `index.css` under `@theme` and it's available everywhere!
