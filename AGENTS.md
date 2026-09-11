# Agent Operating Manual — IELTS Hồ Thành LMS

This document is the **single operational source of truth** for all autonomous AI agents and engineers working in this repository.

---

## ⚡ Non-Negotiable Agent Workflow

### The Reusable Asset Registration Protocol

> **MANDATORY RULE:**
> Whenever you add, enhance, or refactor anything designed to be **reusable** across the project (UI components, CSS micro-interactions, animation utilities, design tokens, hooks, layouts, or service utilities):
>
> **You MUST update the documentation before concluding your turn.**
>
> Never leave a reusable pattern undocumented. Other onboarding agents and developers rely on these docs to reuse existing assets instead of reinventing the wheel or introducing visual and architectural drift.

#### Required Documentation Updates:

1. **Target File**: `docs/ARCHITECTURE.md` (under Section _Reusable Asset Registry & Protocol_).
2. **Required Fields**:
   - **Asset Name & File Path**: Exact import path or class name.
   - **Purpose & UX Intent**: Where, why, and when to use it.
   - **Usage Example**: Self-contained copy-pasteable code snippet.
   - **Constraints & Invariants**: e.g., 0px layout shift rules, 150–250ms animation budget, semantic token usage.

---

## 🏗️ Architecture Quick Pointers

| Concept                   | Authoritative Reference                        | Rule Summary                                                                                          |
| ------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Architecture & Stack**  | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Service → Hook → Component pattern, barrel exports, strict typing.                                    |
| **Product Requirements**  | [`docs/PRD.md`](docs/PRD.md)                   | 16 screens, user stories, non-functional criteria.                                                    |
| **Design Tokens**         | `src/styles/tokens.css`                        | Never use raw hex colors in JSX. Use semantic tokens (`text-primary`, `bg-surface-container-lowest`). |
| **UX Micro-Interactions** | `src/styles/globals.css`                       | Use `.card-interactive`, `.btn-interactive`, `.animate-fade-in-up`, `.animate-pop-in`.                |

---

## 🛠️ Verification Commands (Windows PowerShell)

Always verify your changes before committing. In PowerShell, chain commands with `;` (do **NOT** use `&&`):

```powershell
# Type check (must pass with 0 errors)
pnpm type-check

# Lint check (must pass with 0 warnings)
pnpm lint

# Production build check
pnpm build
```

---

## 🎨 Design & Code Invariants

1. **Zero Pixel Shift (0px Shift)**:
   - When switching states (active/inactive tabs, pills, menu items), keep identical border widths on all states (e.g. `border border-l-4 border-transparent` on inactive vs `border border-slate-200 border-l-4 border-l-slate-900` on active) to eliminate any text or layout jumping.
2. **Subtle & Academic Motion Budget**:
   - Keep transitions between **150ms and 250ms** (`ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Standard interactions must use pure CSS utilities from `src/styles/globals.css` without importing heavy runtime JS animation libraries.
3. **Mock Data Fallbacks**:
   - All feature hooks must provide instant fallback data defaults so pages render immediately without spinner hangs during offline/mock modes.
4. **Barrel Exports**:
   - Every shared component and feature component must export via `index.tsx`.
5. **SVG Icon Standard (`lucide-react`)**:
   - Never use `<span className="material-symbols-outlined">`. Always import vector SVG components from `lucide-react` with `strokeWidth={1.75}` (idle) and `strokeWidth={2.2}` (active).

---

## 🔌 Frontend ↔ Backend Wiring Protocol (FE ↔ BE)

When an agent or engineer is tasked with connecting this frontend to the real backend API, follow this strict protocol:

### 1. Environment Configuration

Toggle out of mock mode in `.env`:

```env
# Point to the live backend API
VITE_API_URL=https://api.yourdomain.com/api

# Disable mock fallback to hit live endpoints
VITE_USE_MOCK=false
```

_When `VITE_USE_MOCK=false`, every service in `src/services/` bypasses the `getMock()` branch and calls `apiClient`._

### 2. Service Layer & `// 🔌 WIRE:` Endpoints

All API calls are strictly encapsulated in `src/services/*.ts`. Never call `apiClient` directly from UI components or hooks. Search the codebase for `// 🔌 WIRE:` to inspect all 11 integration points:

| Service                | Method                     | Backend Target                | Contract Type                          |
| ---------------------- | -------------------------- | ----------------------------- | -------------------------------------- |
| `courseService.ts`     | `getCourseInfo(courseId)`  | `GET /courses/:courseId/info` | `CourseInfo`                           |
| `courseService.ts`     | `getActiveCourses()`       | `GET /courses/active`         | `CourseCard[]`                         |
| `exerciseService.ts`   | `getExercises(filters)`    | `GET /exercises`              | `Exercise[]`                           |
| `exerciseService.ts`   | `submitExercise(id, data)` | `POST /exercises/:id/submit`  | `{ success: boolean; score?: number }` |
| `attendanceService.ts` | `getAttendanceRecords()`   | `GET /attendance`             | `AttendanceRecord[]`                   |
| `homeworkService.ts`   | `getHomeworkList()`        | `GET /homework`               | `HomeworkItem[]`                       |
| `homeworkService.ts`   | `getFinalTestOverview()`   | `GET /final-test`             | `FinalTestOverview`                    |
| `materialService.ts`   | `getBooks()`               | `GET /materials/books`        | `CourseBook[]`                         |
| `roadmapService.ts`    | `getRoadmapPhases()`       | `GET /roadmap`                | `RoadmapPhase[]`                       |
| `testService.ts`       | `getTests()`               | `GET /tests`                  | `TestItem[]`                           |
| `vocabularyService.ts` | `getVocabularyLists()`     | `GET /vocabulary`             | `VocabTopic[]`                         |

### 3. Authentication Interceptor (`src/lib/axios.ts`)

Inject the session token in the request interceptor:

```ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') // or your cookie/token store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

On `401 Unauthorized`, clear expired credentials and handle redirect/refresh:

```ts
if (error.response?.status === 401) {
  localStorage.removeItem('auth_token')
  window.location.href = '/login'
}
```

### 4. Error Handling & Toast Integration

- The global Axios interceptor in `src/lib/axios.ts` automatically converts HTTP errors (`400`, `401`, `403`, `404`, `429`, `500+`, network disconnects) into animated top-right toasts.
- **Silent/Custom Handling**: If an endpoint requires custom inline error display without triggering a toast notification, pass `skipErrorToast: true`:
  ```ts
  const { data } = await apiClient.post('/api/endpoint', payload, { skipErrorToast: true })
  ```

### 5. TanStack Query Cache Invalidation

Whenever you wire a POST/PUT/DELETE mutation:
Always invalidate the relevant query keys using `queryClient.invalidateQueries({ queryKey: [...] })` so the UI cache synchronizes immediately without page refreshes.

### 6. Verification Checklist

Before completing a wiring task, run:

```powershell
pnpm type-check; pnpm lint; pnpm build
```

Verify that all backend response data conform 1:1 to `src/types/api.types.ts`.
