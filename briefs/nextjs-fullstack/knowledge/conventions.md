# Next.js Full-Stack Conventions

## Architecture Principles

- **Server Components by default** -- only add `'use client'` when you need browser APIs, event handlers, or useState/useEffect
- **Server Actions for mutations** -- prefer over API routes for form submissions and data mutations
- **Route segments** -- use `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` correctly
- **Parallel routes and intercepting routes** when the UX requires them
- **Metadata API** for SEO -- use `generateMetadata` in layouts and pages

## Data Fetching Patterns

- Fetch data in Server Components -- no `useEffect` for initial data loads
- Use `fetch` with Next.js caching semantics (`cache`, `revalidate`, `tags`)
- Use React `cache()` to deduplicate requests within a render pass
- Server Actions with `revalidatePath` / `revalidateTag` for cache invalidation
- Colocate data fetching with the component that uses it

## Styling Rules

- **Tailwind CSS** for all styling -- no CSS modules or styled-components
- Use `class-variance-authority` (cva) for component variants
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Follow mobile-first responsive design
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

## Component Patterns

- Co-locate tests next to components: `component.tsx` + `component.test.tsx`
- Use `Suspense` boundaries for streaming
- Use `dynamic()` for heavy client components
- Optimize images with `next/image`
- Use `next/font` for font loading
- Keep client components small and leaf-level -- push `'use client'` as far down the tree as possible

## Project Structure

```
app/
  layout.tsx          # Root layout
  page.tsx            # Home page
  (auth)/
    login/page.tsx
    register/page.tsx
  dashboard/
    layout.tsx
    page.tsx
    loading.tsx
    error.tsx
components/
  ui/                 # shadcn/ui primitives
  [feature]/          # Feature-specific components
lib/
  actions/            # Server Actions
  db/                 # Database queries
  utils.ts            # Shared utilities (cn, etc.)
```
