# 🤖 Autonomous AI Agent Operating Manual & Engineering Constitution

> **Universal Production Standard for Modern Web Applications**  
> _Stack: React 18+, Vite, TypeScript (Strict), Tailwind CSS, TanStack Query, Zustand, Axios._  
> This document is the **single operational source of truth** for all autonomous AI agents and engineers working in this repository.

---

## ⚡ Non-Negotiable Agent Workflow

### The Reusable Asset Registration Protocol

Whenever you create, enhance, or refactor anything designed to be **reusable** across the project (UI components, CSS micro-interactions, animation utilities, design tokens, hooks, layouts, or service utilities):

1. **You MUST register it in the Architecture Reference Documentation (`docs/ARCHITECTURE.md`) before concluding your turn.**
2. Never leave a reusable pattern undocumented. Other agents and engineers rely on this registry to reuse existing assets instead of reinventing the wheel or introducing architectural drift.
3. **Required Fields**:
   - **Asset Name & File Path**: Exact import path or class name.
   - **Purpose & UX Intent**: Where, why, and when to use it.
   - **Usage Example**: Self-contained copy-pasteable code snippet.
   - **Constraints & Invariants**: e.g., 0px layout shift rules, 150–250ms animation budget, semantic token usage.

---

## 🏗️ Architectural Core Principles

### 1. The Strict 3-Tier Layering Architecture

All features must strictly follow the unidirectional data flow:

```
Service (Data & HTTP) ──► Hook / State (TanStack Query / Zustand) ──► Component (Pure Presentation)
```

- **Service Layer (`src/services/*.ts`)**:
  - The **ONLY** place allowed to import `apiClient` or make HTTP requests.
  - Encapsulates API endpoints, query params, request payloads, and response data transformation.
  - **Never** import or call `apiClient` directly inside UI components or feature hooks.
- **Hook & State Layer (`src/features/*/hooks/`, `src/store/`)**:
  - Encapsulates data fetching via TanStack Query (`useQuery`, `useMutation`) or client state via Zustand.
  - Must provide instant fallback defaults (mock data) so components render immediately without white screens during offline or partial-backend phases.
- **Component Layer (`src/features/*/components/`, `src/shared/components/`)**:
  - Focuses strictly on layout, UX interactions, accessibility, and presentation.
  - Receives data and callbacks via props or feature hooks.

---

### 2. Clean Component Organization & Barrel Exports (Anti-Overnesting)

- **The Anti-Overnesting Invariant**:
  - **Tuyệt đối KHÔNG tạo thư mục riêng chỉ để chứa duy nhất 1 tệp `index.tsx` hoặc `index.ts` bên trong** (Ví dụ: `Button/index.tsx`, `Sidebar/index.tsx` là anti-pattern nghiêm trọng).
  - _Lý do_: Làm sâu cây thư mục vô ích và gây nghẽn tab khi mở code trên IDE (mở nhiều file đều thấy tên `index.tsx`).
- **Quy tắc tổ chức chuẩn**:
  - **Shared Components (`src/shared/components/`)**: Các component đơn lẻ phải được đặt trực tiếp dưới dạng tệp phẳng mang đúng tên component (ví dụ `EmptyState.tsx`, `ProgressBar.tsx`, `Sidebar.tsx`) và re-export tập trung qua duy nhất một file barrel `src/shared/components/index.ts`.
  - **Chỉ tạo thư mục con** khi component đó là một **sub-module thực sự** chứa từ 2-3 file con trở lên (ví dụ `Toast/` chứa `ToastContainer.tsx`, `ToastItem.tsx`, `toastStore.ts`, `index.tsx`).
  - **Feature Modules (`src/features/<name>/`)**:
    - `index.tsx` là Page Entrypoint (cửa ngõ định tuyến của feature phục vụ lazy loading).
    - Các component con của feature đặt phẳng trong `src/features/<name>/components/<ComponentName>.tsx` và export qua `components/index.ts`.

---

### 3. TanStack Query Standard: The Query Key Factory Pattern

Never use hardcoded, ad-hoc string arrays for query keys (e.g. `queryKey: ['users', id]`). Always use a centralized **Query Key Factory** (`src/lib/queryKeys.ts`):

```ts
// src/lib/queryKeys.ts
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.all, 'list', filters ?? {}] as const,
    detail: (id?: string) => [...queryKeys.users.all, 'detail', id ?? 'default'] as const,
  },
  courses: {
    all: ['courses'] as const,
    active: () => [...queryKeys.courses.all, 'active'] as const,
    detail: (id?: string) => [...queryKeys.courses.all, 'detail', id ?? 'default'] as const,
  },
} as const
```

- **Lợi ích**:
  - **Type Safety & Autocomplete**: Không sợ gõ sai chính tả chuỗi key.
  - **Hierarchical Invalidation**: Khi gọi `queryClient.invalidateQueries({ queryKey: queryKeys.users.all })`, TanStack Query sẽ tự động làm mới tất cả các truy vấn con (`list`, `detail`) một cách đồng bộ.
  - Bắt buộc dùng `queryKeys.*` trong cả `useQuery` và `queryClient.invalidateQueries`.

---

### 4. The 4 Layers of Error Defense & Toast Protocol

The application implements an automated, multi-tier system-wide error handling architecture:

1. **Network & HTTP Layer (`src/lib/axios.ts`)**:
   - Axios response interceptor automatically catches HTTP errors (`400`, `401`, `403`, `404`, `429`, `500+`, network disconnects, timeouts).
   - Automatically converts each into an animated top-right toast with friendly, localized explanations.
   - **CRITICAL**: **Do NOT manually call `toast.error()` inside `catch` blocks for standard Axios calls** — the interceptor already triggers it. Writing manual toasts leads to duplicate toast popups.
2. **Server State Layer (`src/lib/queryClient.ts`)**:
   - `QueryCache` and `MutationCache` automatically catch query and mutation errors, showing a "Thử lại (Retry)" action button.
3. **Window Runtime Layer (`src/shared/providers/GlobalErrorHandler.tsx`)**:
   - Catches unhandled runtime exceptions and promise rejections with a "Tải lại trang (Reload)" action.
4. **React Rendering Layer (`src/shared/components/ErrorBoundary.tsx`)**:
   - `FeatureErrorBoundary` wraps individual feature routes/widgets inside the main layout so a crash in one widget does not bring down the entire application.
   - `GlobalErrorBoundary` wraps the root application.

#### Silent Mode (Suppressing Toasts for Inline Validation):

If a feature requires **inline error display** (e.g. form field errors) without a top-right popup toast:

- **Axios**: Pass `{ skipErrorToast: true }`:
  ```ts
  const { data } = await apiClient.post('/api/endpoint', payload, { skipErrorToast: true })
  ```
- **TanStack Query**: Pass `meta: { suppressToast: true }`:
  ```ts
  const { data } = useQuery({
    queryKey: queryKeys.custom.check(),
    queryFn: fetchCheck,
    meta: { suppressToast: true },
  })
  ```

#### Toast Container Mounting Rule:

- `<ToastContainer />` must be mounted **once globally** in the root layout (e.g. `src/shared/layouts/AppLayout.tsx`).
- **NEVER** mount `<ToastContainer />` inside individual feature pages or components to prevent ghost/duplicate notifications.

---

### 5. UI/UX, Design Tokens & Styling Invariants

1. **Zero Pixel Shift (0px Shift)**:
   - When switching states (active/inactive tabs, pills, menu items, dropdowns), keep identical border widths and paddings across all states (e.g., `border border-l-4 border-transparent` on inactive vs `border border-slate-200 border-l-4 border-l-slate-900` on active) to eliminate any text or layout jumping.
2. **Semantic Design Tokens Only**:
   - **Never use raw hex colors** in JSX or Tailwind classes (e.g. `text-[#123456]`, `bg-[#fff]`).
   - Always use semantic tokens defined in `tokens.css` / Tailwind theme (e.g. `bg-primary`, `text-on-surface`, `border-outline-variant`, `bg-surface-container-lowest`).
3. **Subtle & Academic Motion Budget**:
   - Keep micro-interactions and transitions between **150ms and 250ms** (`ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Avoid heavy JS animation libraries for standard interactions; use hardware-accelerated CSS classes (`.card-interactive`, `.btn-interactive`, `.animate-fade-in-up`, `.animate-pop-in`).
4. **Vector Icon Standard**:
   - Always import vector SVG components from modern vector libraries (e.g. `lucide-react`) with standard stroke widths:
     - `strokeWidth={1.75}` for idle states.
     - `strokeWidth={2.2}` for active/selected states.
   - Never use Google Material Symbols font tags (`<span className="material-symbols-outlined">`) or messy inline SVGs.
5. **Anti-Overdecoration & Scalable Data Modeling**:
   - When rendering lists based on dynamic data (categories, tags, topics, statuses), **do NOT hardcode individual static SVG icons or distinct colors for each category item**.
   - _Rationale_: Real backend APIs only store raw strings (e.g. `category_name`). Hardcoding icons/colors in frontend breaks whenever an admin creates a new category. Design neutral, scalable, academic UI elements.

---

## 🔌 Frontend ↔ Backend Wiring Protocol (FE ↔ BE)

When connecting the frontend to a live backend API, strictly follow these steps:

### 1. Environment Configuration

Toggle out of mock mode via environment variables:

```env
# Point to live backend API gateway
VITE_API_URL=https://api.yourdomain.com/api

# Disable mock fallback to hit live endpoints
VITE_USE_MOCK=false
```

### 2. Service Layer Implementation

- Every API call must be encapsulated in `src/services/<domain>Service.ts`.
- Mark each endpoint integration clearly with `// 🔌 WIRE: <HTTP_METHOD> <URL>`.
- Always provide a clean mock fallback so the UI never white-screens if the backend endpoint is not yet deployed:
  ```ts
  export const userService = {
    async getUserProfile(userId: string): Promise<UserProfile> {
      if (import.meta.env.VITE_USE_MOCK === 'true') {
        return userMock
      }
      try {
        // 🔌 WIRE: GET /api/users/:userId
        const { data } = await apiClient.get<UserProfile>(`/users/${userId}`)
        return data
      } catch (err) {
        console.warn('[userService] Failed to fetch live profile, falling back to mock:', err)
        return userMock
      }
    },
  }
  ```

### 3. Authentication & JWT Interceptors (`src/lib/axios.ts`)

- **Request Interceptor**: Injects `Authorization: Bearer <token>` from secure storage.
- **Response Interceptor (401 Handling)**:
  - On `401 Unauthorized`, clear expired tokens and trigger an automatic redirect to `/login`.
  - If a refresh token mechanism exists, attempt silent token refresh before failing.

### 4. Mutation Cache Invalidation

Whenever executing a POST, PUT, PATCH, or DELETE mutation:

- Always call `queryClient.invalidateQueries({ queryKey: queryKeys.<domain>.<scope>() })` in `onSuccess` so the UI cache synchronizes immediately without manual page reloads.

---

## 🛠️ Verification & Quality Gate (Windows PowerShell)

Before concluding any turn or creating a commit, you **MUST** run and pass the full verification suite.

In Windows PowerShell, **always chain commands with `;` (do NOT use `&&`)**:

```powershell
# Run unit and integration tests
pnpm vitest run

# Strict TypeScript type check (must pass with 0 errors)
pnpm type-check

# ESLint check (must pass with 0 warnings)
pnpm lint

# Production build check (must emit clean bundle)
pnpm build
```

---

## 📋 Agent Completion Checklist

Before reporting completion to the user, verify:

- [ ] No direct `axios` / `apiClient` calls in components or hooks.
- [ ] No folder containing only a single `index.tsx` or `index.ts` file (anti-overnesting checked).
- [ ] All `useQuery` and `invalidateQueries` calls use `queryKeys.*` factory methods.
- [ ] No hardcoded raw hex colors (`#...`) in JSX / Tailwind classes.
- [ ] No manual `toast.error()` in standard Axios try/catch blocks.
- [ ] `<ToastContainer />` mounted exactly once globally.
- [ ] Reusable assets registered in `docs/ARCHITECTURE.md`.
- [ ] `pnpm type-check; pnpm lint; pnpm build` passed with 0 errors and 0 warnings.
