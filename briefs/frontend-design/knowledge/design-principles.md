# Frontend Design Principles

## Design Philosophy

- **Bold over safe** -- use confident colors, generous whitespace, clear visual hierarchy. Reject the default gray developer aesthetic.
- **Content-first** -- design serves content. Typography is the foundation. Choose type scales that create clear hierarchy.
- **Accessible by default** -- WCAG 2.1 AA minimum. Semantic HTML, keyboard navigation, sufficient color contrast, screen reader friendly.
- **Motion with purpose** -- subtle transitions (150-300ms) for feedback. No decorative animations that add no information.

## Tech Stack

- **React** for component architecture
- **Tailwind CSS** for styling -- utility-first, no custom CSS unless absolutely necessary
- **shadcn/ui** for component primitives (Dialog, Dropdown, Toast, etc.)
- **Radix UI** for unstyled accessible primitives when shadcn does not have what you need
- **Lucide** for icons

## Component Patterns

- Build from shadcn/ui primitives -- customize with Tailwind, do not rebuild from scratch
- Use `cva` (class-variance-authority) for component variants (size, color, state)
- Use `cn()` for conditional class merging
- Every interactive element must have visible focus styles
- Every button must have an accessible label
- Keep component APIs minimal -- prefer composition over configuration

## Responsive Breakpoints

- Mobile-first: start with the smallest breakpoint, layer up
- `sm` (640px) -- large phones, landscape
- `md` (768px) -- tablets
- `lg` (1024px) -- small desktops
- `xl` (1280px) -- large desktops
- Use CSS Grid for page layouts, Flexbox for component layouts
- Test at 320px width minimum

## Color and Typography

- Maintain 4.5:1 minimum contrast ratio for normal text, 3:1 for large text
- Use a consistent type scale (e.g., 12/14/16/20/24/30/36)
- Limit to 2 font families maximum
- Line height: 1.5 for body text, 1.2 for headings
- Maximum line length: 65-75 characters for readability
