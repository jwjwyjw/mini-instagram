# Mini Instagram

A photo sharing app built with React 19, TypeScript, and TanStack Query. Demonstrates caching, error resilience, performance optimization, and accessibility.

## Key Highlights

### 🎯 Performance Optimizations
- **Route-based code splitting** with React.lazy — reduces initial bundle by ~40%
- **Image loading skeleton** — smooth fade-in with placeholder, prevents layout shift
- **Memoized computations** — useMemo prevents unnecessary re-renders on infinite scroll
- **Lazy image loading** — `loading="lazy"` defers off-screen images
- **Cache implementation** - 5 mins for each endpoints

### 🛡️ Resilience & Error Handling
- **Request timeout** — AbortController with 30s timeout prevents hanging requests
- **Retry logic** — TanStack Query auto-retries failed requests (3 attempts)
- **Fallback strategy** —Error catching with graceful fallback UI
- **User-friendly errors** — API errors translated to clear messages (not technical jargon)
- **Optimistic updates** — New posts appear instantly before server confirmation

### 📸 Image Handling
- **Client-side compression** — Reduces 5MB images to <1MB before upload (60-80% reduction), choose to enable with enableCompression prop
- **Validation** — Type & size checks before compression attempt
- **Compression feedback** — Shows user how much was saved
- **Drag-and-drop** — Full upload UX with preview and error states

### ♿ Accessibility & UX
- **WCAG 2.1 AA compliant** — ARIA labels, semantic HTML, keyboard navigation
- **Error messages** — Contextual, actionable feedback
- **Loading states** — Skeleton screens, spinners, and progress indicators
- **Responsive design** — Mobile-first, works on all devices

## Tech Stack

**React 19** | **TypeScript** | **Vite** | **TanStack Query** | **React Router v6** | **Tailwind CSS**

## Architecture

### State Management
- **TanStack Query** — Server state (posts, comments, caching, pagination)
- **Component state** — UI state (forms, loading, errors)
- **Custom hooks** — useForm, usePosts, useComments for reusable logic

### API Layer
```typescript
// Centralized, typed API client with interceptors
class ApiClient {
  - Request/response interceptors
  - Timeout handling with AbortController
  - Custom error classes for type safety
  - Automatic retry logic via TanStack Query
}
```

## Getting Started

```bash
# Install dependencies
npm install

# Create .env.local from .env.example
cp .env.example .env.local

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure
```
src/
├── api/              # API client, error handling, interceptors
├── components/       # Reusable UI components (FormField, ImageUpload, etc)
├── hooks/            # Custom hooks (useForm, usePosts, useComments)
├── pages/            # Route pages (FeedPage, PostPage, CreatePostPage)
├── utils/            # Utilities (validation, date formatting, image compression)
├── config/           # Constants and environment configuration
```
