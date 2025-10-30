# 🧩 Frontend Code Review Checklist

Use this checklist to review frontend code before merging or releasing.
Reviewer can tick the boxes below ✅

---

## 📋 Checklist Items Classified

Items are categorized into **Must** (non-negotiable), **Should** (highly recommended), and **Could** (nice-to-have) based on their criticality to functionality, security, performance, and maintainability.

---

### Must (Non-negotiable for production)

These items are critical for ensuring the code is functional, secure, and meets basic quality standards.

#### 📁 Structure

- [ ] Folder structure is clear and consistent (components, store, services, utils, etc.)

#### ⚙️ Logic & Functionality

- [ ] Logic is clear, easy to understand, not duplicated, and correctly implements requirements (spec / design / API contract)
- [ ] No unused files or code fragments
- [ ] Follows the project’s coding conventions (ESLint, Prettier, etc.)

#### 🔒 Security

- [ ] No sensitive information displayed in the UI or logs
- [ ] No exposure of confidential data (API keys, tokens)
- [ ] User input sanitized: use DOMPurify for dangerouslySetInnerHTML
- [ ] XSS prevention: no raw HTML insertion, escape user content
- [ ] Auth tokens in httpOnly cookies, NOT localStorage or sessionStorage

#### 🧪 Testing

- [ ] Feature tested on major browsers (Chrome, Firefox, Edge) with no basic bugs
- [ ] No critical or high severity issues from SonarQube
- [ ] No warnings or errors in the console during runtime

#### 🔍 Code Review

- [ ] Pull request includes a clear description of changes and task link
- [ ] Code merge passes static code analysis & security scan

---

### Should (Highly recommended for quality and scalability)

These items improve code quality, performance, and maintainability but may not be strictly required in all cases.

#### ⚙️ Logic & Functionality

- [ ] Variable, function, and component names are meaningful and follow naming conventions (camelCase, PascalCase, etc.). Comments are clear and appropriate
- [ ] No hardcoded values

#### 🔒 Security

- [ ] No unnecessary library imports
- [ ] CORS configured: allow only specific origins, not \*
- [ ] Rate limiting for forms: max 5 submissions per minute

#### 🧪 Testing

- [ ] Unit tests / e2e tests are implemented (if required), with coverage > 80%
- [ ] Bug rate / KLOC does not exceed allowed threshold

#### 🔍 Code Review

- [ ] Level 1: Review conventions and patterns → using tools such as code scanners or AI
- [ ] Level 2: Review logic and base design (ensure proper flow and reasoning)

#### Optimization

- [ ] React.memo for components re-rendering without prop changes
- [ ] useMemo for expensive calculations (> 5ms execution)
- [ ] useCallback for functions passed as props to memoized components
- [ ] useEffect dependencies complete: no ESLint warnings, all dependencies listed
- [ ] Cleanup in useEffect: clear timers, abort API calls, remove listeners

#### Assets & Loading

- [ ] Images: WebP with PNG/JPG fallback, lazy loading (loading="lazy"), max 500KB per image
- [ ] Code splitting: dynamic imports for routes > 100KB
- [ ] Bundle size increase < 50KB (check npm run build output)

---

### Could (Nice-to-have enhancements)

These items are beneficial but depend on project scope, time, or resources.

#### Optimization

- [ ] Debounce user input (300ms) for search/autocomplete
- [ ] Throttle scroll/resize handlers (100ms)
- [ ] Local state (useState) for UI-only: modals, dropdowns, form inputs
- [ ] Global state (Redux/Zustand/Context) for shared: user, theme, cart
- [ ] Server state (React Query/SWR) for API data: caching, refetching, optimistic updates

#### Assets & Loading

- [ ] Lists > 50 items: use virtualization (react-window or react-virtualized)

---
