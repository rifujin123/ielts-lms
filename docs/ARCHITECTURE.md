---
title: 'Architecture Reference — IELTS Hồ Thành LMS'
created: 2026-09-11
updated: 2026-09-11
adopted_by: SPEC.md
---

# Architecture Reference — IELTS Hồ Thành LMS Student Portal

> This document is an **adopted companion** to `SPEC.md`. It captures every technology and pattern decision made during the architecture grilling session (Rounds 1–3). It is the single source of truth for **how** the system is built. `SPEC.md` and `PRD.md` govern **what** is built.

---

## Stack

| Layer           | Technology                                     | Decision Rationale                                              |
| --------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| Framework       | React 18                                       | Team standard                                                   |
| Language        | TypeScript `strict: true`                      | Production app; catches bugs early                              |
| Build tool      | Vite 5                                         | Fast HMR, native ESM                                            |
| Package manager | pnpm                                           | Faster, disk-efficient, workspace-ready                         |
| Routing         | React Router v6 nested routes                  | Single `AppLayout` shell; no role-based routing needed          |
| Server state    | TanStack Query v5                              | Declarative async data, cache, stale-while-revalidate           |
| UI state        | Zustand v5                                     | Lightweight, minimal boilerplate for sidebar/phase/user         |
| HTTP            | Axios instance                                 | Interceptors for auth tokens + error handling; familiar to team |
| Styling         | Tailwind CSS v3                                | Matches stitch assets (already Tailwind-based)                  |
| Design tokens   | `src/styles/tokens.css` → `tailwind.config.ts` | Single CSS file; semantic class generation                      |
| UI components   | shadcn/ui (Radix primitives)                   | Accessible, Tailwind-native, copy-owned (no runtime dep)        |
| Forms           | React Hook Form + Zod                          | Schema reuse across form validation and API typing              |
| Debounce        | use-debounce                                   | `useDebounce(value, 300)` on all search/filter inputs           |
| Code splitting  | React.lazy + Suspense per feature route        | Lean bundles; one boundary per feature                          |
| Error handling  | react-error-boundary per feature               | Feature crash does not kill the app                             |
| Linting         | ESLint v9 + eslint-config-prettier             | Consistent rules                                                |
| Formatting      | Prettier                                       | Auto-format                                                     |
| Pre-commit      | Husky + lint-staged                            | No broken code lands in git                                     |
| Testing         | Vitest (configured, no test files)             | Runner ready; tests written when features stabilize             |
| Icons           | Material Symbols Outlined (Google CDN)         | Matches stitch assets exactly                                   |
| Fonts           | Plus Jakarta Sans + Inter (Google CDN)         | Matches stitch design system                                    |

---

## Project Structure

```
ielts-lms/
├── docs/
│   ├── PRD.md               ← Product requirements
│   ├── SPEC.md              ← Five-field spec kernel
│   └── ARCHITECTURE.md      ← This file
├── public/
│   └── logo.png
├── src/
│   ├── main.tsx             ← React root + QueryClientProvider + BrowserRouter
│   ├── App.tsx              ← Route tree (all 14 routes)
│   ├── styles/
│   │   ├── tokens.css       ← SINGLE SOURCE OF TRUTH: CSS custom properties
│   │   └── globals.css      ← Base resets; @import tokens.css
│   ├── lib/
│   │   ├── axios.ts         ← Axios instance; baseURL from VITE_API_URL
│   │   ├── queryClient.ts   ← TanStack Query client; defaultOptions
│   │   └── utils.ts         ← cn() (clsx + tailwind-merge); misc helpers
│   ├── store/
│   │   └── uiStore.ts       ← Zustand: sidebarOpen, activePhase, currentUser
│   ├── types/
│   │   └── api.types.ts     ← Shared API interfaces (Course, Student, Exercise…)
│   ├── mocks/
│   │   ├── index.ts         ← getMock() reads VITE_USE_MOCK
│   │   ├── course.mock.ts
│   │   ├── exercises.mock.ts
│   │   ├── vocabulary.mock.ts
│   │   ├── roadmap.mock.ts
│   │   ├── attendance.mock.ts
│   │   └── tests.mock.ts
│   ├── services/
│   │   ├── courseService.ts
│   │   ├── exerciseService.ts
│   │   ├── vocabularyService.ts
│   │   ├── roadmapService.ts
│   │   ├── attendanceService.ts
│   │   └── testService.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Header/index.tsx
│   │   │   ├── Sidebar/index.tsx
│   │   │   ├── MobileSidebar/index.tsx
│   │   │   ├── ErrorBoundary/index.tsx
│   │   │   └── PageLoader/index.tsx
│   │   └── layouts/
│   │       └── AppLayout/index.tsx
│   └── features/
│       ├── course-info/     ← ROOT PAGE — fully built from screen 16
│       │   ├── index.tsx
│       │   ├── types.ts
│       │   ├── hooks/useCourseInfo.ts
│       │   ├── services/courseInfoService.ts
│       │   └── components/
│       │       ├── CourseInfoCard/index.tsx
│       │       ├── InstructorCard/index.tsx
│       │       ├── ScheduleGrid/index.tsx
│       │       ├── ObjectivesCard/index.tsx
│       │       └── ClassRulesCard/index.tsx
│       ├── dashboard/       ← screen 02
│       ├── roadmap/         ← screens 03, 08
│       ├── exercises/       ← screens 01, 09
│       ├── vocabulary/      ← screens 04, 11
│       ├── materials/       ← screens 05, 15
│       ├── homework/        ← screen 07
│       ├── final-test/      ← screen 06
│       ├── tests/           ← screen 12
│       ├── classroom/       ← screens 13, 14
│       └── practice/        ← screen 10
```

---

## Routing Map

| Route               | Component             | Stitch Screen(s) |
| ------------------- | --------------------- | ---------------- |
| `/`                 | `CourseInfoPage`      | 16 — ROOT        |
| `/dashboard`        | `DashboardPage`       | 02               |
| `/roadmap`          | `RoadmapPage`         | 03               |
| `/roadmap/personal` | `PersonalRoadmapPage` | 08               |
| `/exercises`        | `ExercisesPage`       | 01, 09           |
| `/vocabulary`       | `VocabularyPage`      | 04, 11           |
| `/materials`        | `MaterialsPage`       | 05               |
| `/materials/books`  | `BooksPage`           | 15               |
| `/homework`         | `HomeworkPage`        | 07               |
| `/final-test`       | `FinalTestPage`       | 06               |
| `/tests`            | `TestsPage`           | 12               |
| `/classroom`        | `ClassroomPage`       | 13               |
| `/attendance`       | `AttendancePage`      | 14               |
| `/practice`         | `PracticePage`        | 10               |

All routes are children of the `AppLayout` route, which renders `<Header>`, `<Sidebar>` (or `<MobileSidebar>`), and `<Outlet>`.

---

## Naming Conventions

| Type               | Convention                      | Example                            |
| ------------------ | ------------------------------- | ---------------------------------- |
| Components         | PascalCase, barrel              | `CourseInfoCard/index.tsx`         |
| Hooks              | `use` prefix, camelCase         | `useCourseInfo.ts`                 |
| Services           | `Service` suffix, camelCase     | `courseInfoService.ts`             |
| Types / Interfaces | PascalCase, no `I` prefix       | `CourseInfo`, `Exercise`           |
| Zod schemas        | `Schema` suffix                 | `courseInfoSchema`                 |
| Constants          | SCREAMING_SNAKE_CASE            | `DEFAULT_STALE_TIME`               |
| CSS variables      | `--category-name` kebab-case    | `--color-primary`, `--space-md`    |
| Route paths        | kebab-case                      | `/final-test`, `/personal-roadmap` |
| Feature folders    | kebab-case                      | `course-info/`, `final-test/`      |
| Env variables      | `VITE_` prefix, SCREAMING_SNAKE | `VITE_USE_MOCK`, `VITE_API_URL`    |

---

## Patterns

### API Service Pattern

```ts
// src/features/course-info/services/courseInfoService.ts
import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { courseInfoMock } from '@/mocks/course.mock'
import type { CourseInfo } from '../types'

export const courseInfoService = {
  getCourseInfo: async (courseId: string): Promise<CourseInfo> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/courses/:courseId/info
      return courseInfoMock
    }
    const { data } = await apiClient.get<CourseInfo>(`/courses/${courseId}/info`)
    return data
  },
}
```

### TanStack Query Hook Pattern

```ts
// src/features/course-info/hooks/useCourseInfo.ts
import { useQuery } from '@tanstack/react-query'
import { courseInfoService } from '../services/courseInfoService'
import type { CourseInfo } from '../types'

export const useCourseInfo = (courseId: string) => {
  return useQuery<CourseInfo>({
    queryKey: ['course-info', courseId],
    queryFn: () => courseInfoService.getCourseInfo(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Debounce Pattern (search/filter inputs)

```ts
import { useDebounce } from 'use-debounce'

const [search, setSearch] = useState('')
const [debouncedSearch] = useDebounce(search, 300)
// debouncedSearch → queryFn; search → input value
```

### Page Entry Point Pattern (~200–300 lines)

```tsx
// src/features/course-info/index.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PageLoader } from '@/shared/components/PageLoader'
import { useCourseInfo } from './hooks/useCourseInfo'
import { CourseInfoCard } from './components/CourseInfoCard'
// ... other imports

const CourseInfoPage: React.FC = () => {
  const { data, isLoading, error } = useCourseInfo('IELTS-6.5-2026')
  // JSX: breadcrumb + page header + bento grid of cards
  // Each card is a separate component; this file orchestrates
}
export default CourseInfoPage
```

### Component Pattern (barrel export)

```tsx
// src/features/course-info/components/CourseInfoCard/index.tsx
import type { CourseInfo } from '../../types'
import { cn } from '@/lib/utils'

interface CourseInfoCardProps {
  data: CourseInfo
  className?: string
}

export const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ data, className }) => {
  return (
    <section
      className={cn(
        'bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm',
        className,
      )}
    >
      {/* content */}
    </section>
  )
}
```

---

## Design Token Architecture

```
src/styles/tokens.css          ← Human-readable CSS custom properties
        ↓ (fed via CSS var references)
tailwind.config.ts             ← Maps tokens to Tailwind semantic class names
        ↓ (generates utility classes)
JSX                            ← Uses semantic classes: text-primary, bg-surface-container-lowest
```

**Rule**: Never use `text-[#dc2626]` or raw colors in JSX. Always use `text-primary`.

---

## shadcn/ui Components

| Component      | Used In                             |
| -------------- | ----------------------------------- |
| `Button`       | Every screen                        |
| `Badge`        | Course status tags, exercise states |
| `Card`         | All info/data cards                 |
| `Sheet`        | Mobile sidebar drawer               |
| `Tabs`         | Exercise/test filters               |
| `Select`       | Phase selector, sort dropdowns      |
| `DropdownMenu` | User profile menu                   |
| `Separator`    | Sidebar group dividers              |
| `Avatar`       | Student + instructor profiles       |
| `Progress`     | Session progress bars               |
| `Table`        | Attendance & session summary        |
| `Dialog`       | Confirmation modals                 |
| `Tooltip`      | Icon labels                         |
| `ScrollArea`   | Sidebar, vocabulary lists           |

---

## Icon System Architecture — `lucide-react`

> **MANDATORY RULE:**
> DO NOT use web font icons (such as `<span className="material-symbols-outlined">`).
> All icons MUST be imported directly as SVG components from **`lucide-react`**.

### UX & Engineering Rationale:

1. **Zero FOUT & Zero Layout Shift (0px)**: Font icons momentarily flash raw text (e.g. `dashboard`, `menu_book`) before web fonts load. Lucide SVGs render instantaneously and synchronously without layout or baseline jitter.
2. **Subtle & Academic Weighting**: Default idle icons use `strokeWidth={1.75}`; active or emphasized states use `strokeWidth={2.2}` for crisp visual hierarchy without chunkiness.
3. **Tree-Shakeable & Offline-Safe**: Zero external CDN requests; Vite compiles only used SVGs into the production chunk.

```tsx
// Usage Example:
import { LayoutDashboard, BookOpen, ChevronRight, type LucideIcon } from 'lucide-react'

// Standard icon:
<LayoutDashboard className="h-[18px] w-[18px] text-secondary" strokeWidth={1.75} />

// Dynamic active state with subtle stroke emphasis:
<Icon
  className={cn('h-[18px] w-[18px] transition-transform duration-200', isActive ? 'text-slate-900 scale-110' : 'text-secondary')}
  strokeWidth={isActive ? 2.2 : 1.75}
/>
```

---

## UX & Micro-Interaction Animation System

The portal adheres to a **Subtle & Academic** motion philosophy (150–250ms, GPU-accelerated CSS, 0 KB JS bundle penalty). All agents building or refactoring UI features MUST reuse the standard micro-interaction utilities defined in `src/styles/globals.css`.

### 1. Reusable Utility Classes

| Utility Class                | Purpose & Effect                                                                                                            | Where to Apply                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `.card-interactive`          | Lifts card by 3px (`translateY(-3px)`), softens shadow, and glows with subtle crimson border (`border-primary/45`) on hover | Bento grid cards, stat summary boxes, course cards, test cards |
| `.btn-interactive`           | Tactile click feedback (`active:scale-[0.97]`) with smooth color transition (150ms)                                         | All primary, secondary, and ghost action buttons               |
| `.animate-fade-in-up`        | Smooth staggered entrance animation (opacity 0 → 1, translateY 12px → 0 in 400ms)                                           | Page hero banners, main section containers on initial mount    |
| `.stagger-1` to `.stagger-5` | Progressive animation delay (50ms increments: 50ms, 100ms, 150ms, 200ms, 250ms)                                             | Paired with `.animate-fade-in-up` across sibling cards         |
| `.animate-pop-in`            | Subtle scale bounce (`scale(0.85)` → `scale(1.08)` → `scale(1.0)`) in 350ms                                                 | Badges, status tags, online dots, active checkmarks            |

### 2. Sidebar Navigation Pill Pattern

Sidebar active items are designed as **full pills** (`rounded-full`) with **Deep Slate / Ink** active state transitions (inspired by Linear and Notion UI):

- **Active state**: `bg-slate-100 text-slate-900 font-bold rounded-full shadow-xs border border-slate-200 border-l-4 border-l-slate-900 scale-[1.01]` + icon micro-scale (`text-slate-900 scale-110`).
- **Inactive state**: `rounded-full border border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface hover:translate-x-0.5 transition-all duration-200 ease-out`.
- **Zero Pixel Shift (0px)**: The container maintains `border border-l-4` across both active and inactive states (`border-transparent` vs `border-slate-200 border-l-slate-900`) to guarantee zero layout shift during navigation transitions.

### 3. Rules for Agents Building New Features

1. **Never import heavy JS animation libraries** for standard hover/entrance interactions — use the pre-built CSS utilities in `src/styles/globals.css`.
2. **Always add `.card-interactive`** to clickable or interactive card components.
3. **Always add `.btn-interactive`** to custom action buttons.
4. **Always add `.animate-pop-in`** to dynamically rendered badges and completion chips.
5. **Keep timing within 150–250ms** for hover/active feedback to maintain snappy, professional academic responsiveness.

---

## Reusable Asset Registry & Documentation Protocol

### 📜 Mandatory Agent Workflow Protocol

Whenever any agent adds, modifies, or extracts a **reusable asset** (UI component, CSS utility, animation, custom hook, design token, or service pattern):

1. **Implement the asset cleanly** following strict TypeScript (`strict: true`) and zero ESLint warnings.
2. **Document the asset in this section** before completing the turn:
   - Provide the file location and export signature.
   - Describe the UX purpose and when to use it.
   - Provide a copy-pasteable usage example.
   - State design invariants (e.g. 0px layout shift, timing budget, accessibility).
3. **Verify**: Ensure `pnpm type-check`, `pnpm lint`, and `pnpm build` pass with 0 errors.

### 📦 Current Reusable Asset Registry

| Asset Name                     | Location                                                            | Type      | Description & Purpose                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `.card-interactive`            | `src/styles/globals.css`                                            | CSS Class | Lifts card by 3px (`translateY(-3px)`), softens shadow, and adds subtle crimson hover ring. Apply to all clickable / interactive cards. |
| `.btn-interactive`             | `src/styles/globals.css`                                            | CSS Class | Tactile click micro-compression (`scale(0.97)`) on `:active`. Apply to all interactive buttons.                                         |
| `.animate-fade-in-up`          | `src/styles/globals.css`                                            | CSS Class | GPU-accelerated entrance animation (opacity 0 → 1, translateY 12px → 0 in 400ms).                                                       |
| `.stagger-1`..`5`              | `src/styles/globals.css`                                            | CSS Class | Progressive 50ms delay steps (50ms–250ms) to stagger entrance across grid / list children.                                              |
| `.animate-pop-in`              | `src/styles/globals.css`                                            | CSS Class | Micro-bounce scale animation for status badges, tags, and active checkmarks.                                                            |
| `.badge-minimal`               | `src/styles/globals.css`                                            | CSS Class | Minimal Modern status badge (Linear/Notion style). Slate-100 base, slate-200 border, and semantic micro-dot (emerald/red/amber/slate).  |
| `.badge-tag`                   | `src/styles/globals.css`                                            | CSS Class | Clean desaturated metadata/skill tag for Reading, Writing, and course modules.                                                          |
| `.badge-score`                 | `src/styles/globals.css`                                            | CSS Class | High-contrast deep slate (slate-900) score badge for IELTS band scores and primary counters.                                            |
| `.animate-toast-in`            | `src/styles/globals.css`                                            | CSS Class | Toast entrance animation (slide left + spring scale in 220ms with cubic-bezier(0.16, 1, 0.3, 1)).                                       |
| `.animate-toast-out`           | `src/styles/globals.css`                                            | CSS Class | Toast exit animation (slide right + fade out in 180ms ease-out).                                                                        |
| `.nav-item-active`             | `src/styles/globals.css`                                            | CSS Class | Deep Slate / Ink pill active styling with 4px slate-900 indicator and 0px shift border.                                                 |
| `<ToastContainer />`           | `src/shared/components/Toast`                                       | Component | Top-right fixed viewport container rendering active toasts with hover-pause countdown and accessible live region.                       |
| `toast`                        | `src/shared/components/Toast/toastStore`                            | Utility   | Imperative toast dispatcher: `toast.error()`, `toast.warning()`, `toast.success()`, `toast.info()`, `toast.dismiss()`.                  |
| `<GlobalErrorHandler />`       | `src/shared/providers/GlobalErrorHandler`                           | Component | Window lifecycle listener catching uncaught exceptions and unhandled promise rejections, triggering actionable toasts.                  |
| `<Sidebar />`                  | `src/shared/components/Sidebar`                                     | Component | Slim 224px navigation sidebar with categorized groups and Deep Slate active pills.                                                      |
| `<Header />`                   | `src/shared/components/Header`                                      | Component | Standard top navbar with branding logo, left-chevron back button, user profile, and notifications.                                      |
| `<MobileSidebar />`            | `src/shared/components/MobileSidebar`                               | Component | Mobile responsive drawer wrapper with backdrop blur and route-change auto-close.                                                        |
| `<ErrorBoundary />`            | `src/shared/components/ErrorBoundary`                               | Component | Dual-layer error boundary (`FeatureErrorBoundary` + `GlobalErrorBoundary`) catching render exceptions with toast alerts & retry UI.     |
| `<PageLoader />`               | `src/shared/components/PageLoader`                                  | Component | Centered brand loading skeleton indicator.                                                                                              |
| `<TeacherRubricModal />`       | `src/features/exam-runner/components/TeacherRubricModal`            | Component | Modal displaying Cambridge 4-criteria evaluation (TA/TR, CC, LR, GRA) for Writing & Speaking with examiner commentary & 0px shift.      |
| `<QuestionExplanationModal />` | `src/features/exercises/runner/components/QuestionExplanationModal` | Component | Pop-up modal displaying question prompt, context, correct answer banner, and Linearthinking grammatical explanation.                    |
| `roundToIeltsBand`             | `src/features/exam-runner/utils/ieltsScoring`                       | Utility   | Official IDP / British Council IELTS overall band rounding algorithm (.125, .25, .625, .75).                                            |

### 4. Toast & System-Wide Error Handling Specification

```tsx
// Usage Example — Triggering Toasts from Anywhere:
import { toast } from '@/shared/components/Toast/toastStore'

// Error with description and action button:
toast.error('Không thể nộp bài tập', {
  description: 'Kết nối mạng bị gián đoạn trong khi tải tệp tin lên máy chủ.',
  action: {
    label: 'Thử lại',
    onClick: () => handleRetrySubmission(),
  },
  duration: 5500,
})

// Success notification:
toast.success('Đã lưu bài học vào danh sách yêu thích')

// Warning notification:
toast.warning('Phiên học sắp kết thúc', {
  description: 'Vui lòng kiểm tra lại câu trả lời trước khi hệ thống tự động thu bài.',
})
```

- **Motion Invariants**:
  - `toastSlideIn`: 220ms `cubic-bezier(0.16, 1, 0.3, 1)` (respects 150–250ms motion budget).
  - `toastSlideOut`: 180ms `ease-out`.
  - Countdown progress bar pauses automatically on `:hover`.
- **System Integration Points**:
  - **Axios (`src/lib/axios.ts`)**: Automatically translates HTTP status codes (400, 401, 403, 404, 429, 500+) and network disconnects into contextual error toasts.
  - **TanStack Query (`src/lib/queryClient.ts`)**: Global `QueryCache` and `MutationCache` emit error toasts with a "Thử lại" retry action upon failure.
  - **Global Window (`src/shared/providers/GlobalErrorHandler.tsx`)**: Listens to unhandled runtime errors and promise rejections.
  - **React Boundaries (`src/shared/components/ErrorBoundary`)**: Emits toast alerts and displays resilient recovery fallbacks.

- **Silent / Inline Error Suppression**:
  - In Axios: pass `{ skipErrorToast: true }` when writing inline validation or silent background sync.
  - In TanStack Query: pass `meta: { suppressToast: true }`.

- **Container Mounting Rule**:
  - `<ToastContainer />` is mounted **once globally** in `src/shared/layouts/AppLayout/index.tsx` at `fixed top-5 right-5 z-50`.
  - **DO NOT** mount `<ToastContainer />` inside individual sub-pages or feature components.

---

## Gatekeeper — Post-Build Review Process

After each feature or enhancement is implemented, a **Gatekeeper review agent** runs automatically and checks:

1. **Pattern consistency** — does every feature follow the service → hook → page pattern?
2. **Reusable Asset Documentation** — did the agent register any new reusable component/utility in `docs/ARCHITECTURE.md`?
3. **TypeScript** — does `pnpm tsc --noEmit` pass with 0 errors?
4. **Wire comments** — does every mock branch have a `// 🔌 WIRE:` comment?
5. **Line budget** — is every `features/{name}/index.tsx` within 200–300 lines?
6. **Naming conventions** — do all files follow the agreed convention table?
7. **Token usage** — are there any raw color values in JSX?
8. **Barrel exports** — does every shared component use `ComponentName/index.tsx`?

**Decision**: Auto-fix minor issues; escalate critical findings to the developer with a clear action list.

---

## Environment Variables

```env
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

- `VITE_USE_MOCK=true` → all service calls return mock data (development default)
- `VITE_USE_MOCK=false` → all service calls hit `VITE_API_URL` (production / integration)

---

## 🔌 Frontend ↔ Backend (FE ↔ BE) Integration Guide

This section is the authoritative specification for any AI agent or backend engineer connecting the frontend to live microservices.

### 1. The Service → Hook → Component Architecture

The application adheres strictly to a three-tier data flow:

1. **Components (`src/features/*/index.tsx`)**: Pure presentation, user interaction, and layout. Never call `axios` or `fetch` directly.
2. **Hooks (`useQuery` / `useMutation`)**: Declarative server state management, caching (`5m staleTime`), retry strategies, and optimistic updates.
3. **Services (`src/services/*.ts`)**: Strongly typed data access layer with dynamic mock-to-live branching (`if (getMock()) return ...Mock`).

### 2. Complete Integration Endpoint Catalog

| Feature               | Service Function                           | Live HTTP Target                  | TypeScript Contract                    |
| --------------------- | ------------------------------------------ | --------------------------------- | -------------------------------------- |
| **Course Info**       | `courseService.getCourseInfo(id)`          | `GET /api/courses/:courseId/info` | `CourseInfo`                           |
| **Dashboard**         | `courseService.getActiveCourses()`         | `GET /api/courses/active`         | `CourseCard[]`                         |
| **Exercises**         | `exerciseService.getExercises(filters)`    | `GET /api/exercises`              | `Exercise[]`                           |
| **Exercise Submit**   | `exerciseService.submitExercise(id, data)` | `POST /api/exercises/:id/submit`  | `{ success: boolean; score?: number }` |
| **Attendance**        | `attendanceService.getAttendanceRecords()` | `GET /api/attendance`             | `AttendanceRecord[]`                   |
| **Homework**          | `homeworkService.getHomeworkList()`        | `GET /api/homework`               | `HomeworkItem[]`                       |
| **Final Test**        | `homeworkService.getFinalTestOverview()`   | `GET /api/final-test`             | `FinalTestOverview`                    |
| **Materials / Books** | `materialService.getBooks()`               | `GET /api/materials/books`        | `CourseBook[]`                         |
| **Roadmap**           | `roadmapService.getRoadmapPhases()`        | `GET /api/roadmap`                | `RoadmapPhase[]`                       |
| **Tests**             | `testService.getTests()`                   | `GET /api/tests`                  | `TestItem[]`                           |
| **Vocabulary**        | `vocabularyService.getVocabularyLists()`   | `GET /api/vocabulary`             | `VocabTopic[]`                         |

### 3. Session & Auth Injection

In `src/lib/axios.ts`:

```ts
// Request Interceptor:
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response Interceptor (401 Handling):
if (error.response?.status === 401) {
  localStorage.removeItem('auth_token')
  window.location.href = '/login'
}
```

### 4. Toast Notifications & Error Suppression

All HTTP errors automatically trigger animated top-right toasts via `src/lib/axios.ts`. To suppress the toast for custom error flows (e.g. inline field validation), pass:

```ts
await apiClient.post('/api/endpoint', payload, { skipErrorToast: true })
```

### 5. Mutation Cache Invalidation Pattern

When writing mutation hooks, invalidate matching query keys:

```ts
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: (data: SubmissionPayload) => exerciseService.submitExercise(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['course-exercises'] })
    toast.success('Nộp bài tập thành công!')
  },
})
```

---

## 📦 Reusable Asset Registry & Protocol

Whenever an engineer or AI agent introduces a reusable component, hook, or layout, it MUST be registered here to prevent redundant implementations.

### 1. IELTS CBT Computer-Based Testing Runner

- **Asset Name & File Path**: `ExamRunnerPage` (`src/features/exam-runner/index.tsx`)
- **Purpose & UX Intent**: Standard Cambridge/IDP computer-based exam testing environment. Provides a 0px-shift dual-pane resizable layout (reading passage on left, questions on right), question palette matrix at bottom, real-time timer countdown, text highlighting popover, auto-save to `localStorage`, and automated Band Score evaluation with review explanations.
- **Usage Example**:
  ```tsx
  import { ExamRunnerPage } from '@/features/exam-runner'
  ;<Route path="exam/:testId" element={<ExamRunnerPage />} />
  ```
- **Constraints & Invariants**: Full-viewport layout without LMS sidebar/header; handles touch & desktop resize via `react-resizable-panels`; persists answers across reloads.

### 2. Reading Passage Viewer with Unified Minimalist Slate Highlighting & Vocab Collector

- **Asset Name & File Path**: `ReadingPassageView` (`src/features/exam-runner/components/ReadingPassageView.tsx`)
- **Purpose & UX Intent**: Renders IELTS reading passages with font scaling (`sm`, `base`, `lg`) and unified minimalist academic text selection / highlighting (`.vocab-highlight` with `bg-slate-200 text-slate-900 border-b border-slate-400`). Integrated with `VocabFloatingTooltip` in Practice/Review mode, and provides seamless note-taking highlight in Strict mode without colorful green/red distractions.
- **Usage Example**:
  ```tsx
  import { ReadingPassageView } from '@/features/exam-runner/components/ReadingPassageView'
  ;<ReadingPassageView />
  ```
- **Constraints & Invariants**:
  - Global `::selection` in `src/styles/globals.css` is strictly unified to `@apply bg-slate-200 text-slate-900;`.
  - All highlights use `.vocab-highlight` (`bg-slate-200/90 text-slate-900 border-b border-slate-400`).
  - No random green/red/yellow selection colors across the platform.

### 3. Universal IELTS Question Card Renderer

- **Asset Name & File Path**: `QuestionCard` (`src/features/exam-runner/components/QuestionCard.tsx`)
- **Purpose & UX Intent**: Polymorphic renderer supporting `TRUE_FALSE_NOT_GIVEN`, `YES_NO_NOT_GIVEN`, `MULTIPLE_CHOICE`, `SENTENCE_COMPLETION`, `SUMMARY_COMPLETION`, and `MATCHING_HEADINGS`. Shows answer state, active highlight, flag toggle, and post-submission explanations.
- **Constraints & Invariants**: 0px layout shift on selection; identical border widths on active/inactive states.

### 4. CBT Question Palette Navigation Matrix

- **Asset Name & File Path**: `ExamBottomPalette` (`src/features/exam-runner/components/ExamBottomPalette.tsx`)
- **Purpose & UX Intent**: Sticky bottom matrix showing questions 1–40 grouped by passage with state indicators (Unanswered, Answered, Review/Flagged) and previous/next navigation.
- **Usage Example**:
  ```tsx
  import { ExamBottomPalette } from '@/features/exam-runner/components/ExamBottomPalette'
  ;<ExamBottomPalette />
  ```

### 5. IELTS Exam Session Store

- **Asset Name & File Path**: `useIeltsExamStore` (`src/features/exam-runner/store/ieltsExamStore.ts`)
- **Purpose & UX Intent**: Zustand store with auto-save persistence for answers, flags, elapsed timer, text highlights, and automated Cambridge IELTS Academic Reading Band Score calculation (0.0–9.0).
- **Usage Example**:
  ```tsx
  import { useIeltsExamStore } from '@/features/exam-runner/store/ieltsExamStore'
  const { answers, setAnswer, submitExam, scoreResult } = useIeltsExamStore()
  ```

### 6. IELTS Listening 4-Section Runner

- **Asset Name & File Path**: `ListeningRunner` (`src/features/exam-runner/components/ListeningRunner.tsx`)
- **Purpose & UX Intent**: Standard 4-section IELTS listening exam player with locked audio playback (no seek/pause during real exam), section switcher tabs, and real-time response capture across form completion, note completion, map labeling, and multiple choice questions.
- **Usage Example**:
  ```tsx
  import { ListeningRunner } from '@/features/exam-runner/components/ListeningRunner'
  ;<ListeningRunner skillData={manifest.skills.listening!} />
  ```

### 7. IELTS Writing Dual-Pane Task Runner

- **Asset Name & File Path**: `WritingRunner` (`src/features/exam-runner/components/WritingRunner.tsx`)
- **Purpose & UX Intent**: Resizable split-pane layout for Task 1 (visual chart + 150 words) and Task 2 (discursive essay + 250 words). Features real-time word counting with status badge (amber when below minimum, emerald when sufficient) and auto-save.
- **Usage Example**:
  ```tsx
  import { WritingRunner } from '@/features/exam-runner/components/WritingRunner'
  ;<WritingRunner skillData={manifest.skills.writing!} />
  ```

### 8. IELTS Speaking 3-Part Voice Recorder

- **Asset Name & File Path**: `SpeakingRunner` (`src/features/exam-runner/components/SpeakingRunner.tsx`)
- **Purpose & UX Intent**: Complete 3-part speaking test room. Part 1 interview Q&A; Part 2 Cue card with automated 60-second prep countdown, scratchpad notes, and 2-minute speech timer; Part 3 in-depth discussion. Uses native browser `MediaRecorder` API to capture and playback student speech.
- **Usage Example**:
  ```tsx
  import { SpeakingRunner } from '@/features/exam-runner/components/SpeakingRunner'
  ;<SpeakingRunner skillData={manifest.skills.speaking!} />
  ```

### 9. Unified 4-Skill Exam Store

- **Asset Name & File Path**: `useFullExamStore` (`src/features/exam-runner/store/fullExamStore.ts`)
- **Purpose & UX Intent**: Central state coordinator across all 4 IELTS skills. Maintains individual skill timers, question answers, writing texts, audio recording blobs, and full session persistence in `localStorage`.
- **Usage Example**:
  ```tsx
  import { useFullExamStore } from '@/features/exam-runner/store/fullExamStore'
  const { activeSkill, setActiveSkill, setListeningAnswer, setWritingTaskAnswer } =
    useFullExamStore()
  ```

### 10. Schema-Driven Universal Exam Service

- **Asset Name & File Path**: `ieltsExamService` (`src/features/exam-runner/services/ieltsExamService.ts`)
- **Purpose & UX Intent**: Strongly typed data access layer connecting Frontend to Backend via `GET /api/exams/:examId` and `POST /api/exams/:examId/submit`. Any exam JSON sent by the BE conforming to `FullIeltsExamManifest` (`src/features/exam-runner/types/fullExam.types.ts`) automatically renders on the UI without frontend code alterations.
- **Usage Example**:
  ```tsx
  import { ieltsExamService } from '@/features/exam-runner/services/ieltsExamService'
  const manifest = await ieltsExamService.getExamManifest(examId)
  ```

### 11. IELTS Listening Runner (Bottom Red-Line Audio & DOL CBT Layout)

- **Asset Name & File Path**: `ListeningRunner` (`src/features/exam-runner/components/ListeningRunner.tsx`)
- **Purpose & UX Intent**: 1:1 replica of the DOL IELTS CBT listening test interface. All audio controls and indicators are integrated into the bottom navigation bar, leaving the top questions area clean and unencumbered. Features **immediate audio auto-play** upon test or section access with no manual start button required. Audio progress is displayed as a **thin red progress line across the top edge of the footer** with a **sliding red capsule pill** showing the exact live timestamp (e.g. `07:27`, `08:53`). Audio volume control is positioned compactly in the bottom bar alongside section controls.
  - Footer Top Edge: Full-width red audio progress line with a floating timestamp pill.
  - Row 1: Centered question jump pills `(1) (2) ... (10)` for rapid question scrolling (collapsible).
  - Row 2: Collapse chevron (`^` / `v`), section counter (`Section 1 | Đã làm 0 / 10`), integrated volume control, 4 Section pills with mini progress bars (active section in red/pink), and red primary button (`Section 2 →` or `Nộp bài`).
- **Usage Example**:
  ```tsx
  import { ListeningRunner } from '@/features/exam-runner/components/ListeningRunner'
  ;<ListeningRunner
    skillData={manifest.skills.listening!}
    onSubmit={() => setIsSubmitModalOpen(true)}
  />
  ```
- **Constraints & Invariants**:
  - Root container: `flex h-full flex-col overflow-hidden bg-slate-100`.
  - Top header audio bar is removed; the questions workspace occupies full viewport height above the footer.
  - Audio plays automatically via HTML5 `<audio autoPlay>` with silent autoplay fallback and continuous real-time progress simulation.
  - Bottom bar is pinned via `sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white shadow-lg`.
  - Timestamp is rendered solely within the floating red pill on the red progress line (0px layout shift).
  - Final section displays a prominent red "Nộp bài" button wired to `onSubmit` (or `submitFullExam`).
  - Multiple choice questions display each answer option on its own dedicated row with a circular radio button indicator (`role="radio"`), eliminating heavy pill wrappers.
  - Question jump pills scroll directly into view via `document.getElementById('listening-question-${id}').scrollIntoView({ behavior: 'smooth', block: 'center' })`.

### 12. Modular Skill Runners & Dynamic Question Components

- **Asset Name & File Path**:
  - `ReadingRunner` (`src/features/exam-runner/components/ReadingRunner.tsx`)
  - `ListeningSectionView` (`src/features/exam-runner/components/ListeningSectionView.tsx`)
  - `UniversalQuestionRenderer` & Question Type Renderers (`src/features/exam-runner/components/question-renderers/index.ts`)
- **Purpose & UX Intent**:
  - **Skill-level Decoupling**: Breaks down the monolithic exam workspace into independent, standalone skill runners (`ListeningRunner`, `ReadingRunner`, `WritingRunner`, `SpeakingRunner`).
  - **Dynamic Mock Test Configuration**: Supports any arbitrary combination of skills configured by teachers (e.g., a single skill test, a 2-skill test with only Listening and Reading, or a 4-skill full test). Top header switcher tabs dynamically adjust to show only the active skills in `manifest.skills`.
  - **Reading Passage Switcher Tabs**: `ReadingRunner` includes a dedicated top tab bar (`Passage 1 | Passage 2 | Passage 3`) styled identically to the main skill switcher with completion pill counts (`0/13`, `13/13`) and auto-reset scroll on passage change. Bottom palette (`ExamBottomPalette`) focuses cleanly on the active passage questions rather than cramming all 40 questions at once.
  - **Section & Question-level Modularization**: Inside each section (e.g. Listening Section 1–4), teachers can mix and match any question format without layout breakages:
    - `MultipleChoiceQuestion`: 1-row-per-option radio buttons with `text-blue-600 font-mono text-sm` numbering.
    - `CompletionQuestion`: Inline form, note, and sentence completion with auto-sized inputs.
    - `TableCompletionQuestion`: Academic IELTS table completion with multi-column support (`Column 1 | Column 2 | Blank _____`) and responsive table cells.
    - `MatchingQuestion`: Dropdown select matching for headings, features, and map labeling.
- **Usage Example**:
  ```tsx
  import { UniversalQuestionRenderer } from '@/features/exam-runner/components/question-renderers'

  ;<UniversalQuestionRenderer
    question={q}
    value={currentAns}
    onChange={(val) => setAnswer(q.id, val)}
    isSubmitted={isSubmitted}
    sectionInstruction={sectionInstruction}
  />
  ```
- **Constraints & Invariants**:
  - Zero pixel shift when switching active/inactive radio states.
  - All question numberings adhere to `<span className="font-bold text-blue-600 font-mono text-sm">{q.id}.</span>`.
  - Question renderers are pure presentation components decoupled from global store dependencies; they receive `value`, `onChange`, and `isSubmitted` via props.

### 13. Video Listening Topics & YouTube Dictation Studio

- **Asset Name & File Path**:
  - `TopicsPage` (`src/features/topics/index.tsx`)
  - `DictationPage` (`src/features/dictation/index.tsx`)
  - `DictationHeader` (`src/features/dictation/components/DictationHeader.tsx`)
  - `VideoPlayerColumn` (`src/features/dictation/components/VideoPlayerColumn.tsx`)
  - `DictationPracticeColumn` (`src/features/dictation/components/DictationPracticeColumn.tsx`)
  - `TranscriptColumn` (`src/features/dictation/components/TranscriptColumn.tsx`)
  - `DictionaryModal` (`src/features/dictation/components/DictionaryModal.tsx`)
  - `VocabNotebookModal` (`src/features/dictation/components/VocabNotebookModal.tsx`)
- **Purpose & UX Intent**:
  - **Topics Discovery Hub (`/topics`)**: Multi-row catalog for video listening practice structured into distinct category rows (4 categories × 3 cards = 12 lessons: `Movie Short Clip`, `Daily Conversation`, `IPA & Phát âm`, `US-UK Songs`). Each video features a 16:9 YouTube thumbnail, hover play overlay, duration/sentence/level badges, and instant CTA `[ 🎧 Luyện Dictation ]`. Provides dynamic category pill filters and full-text keyword search across titles and descriptions.
  - **Parroto-Style 3-Column Adaptive Dictation (`/topics/dictation/:lessonId`)**: Replicates interactive YouTube dictation with 3 distinct columns: Media (YouTube video sync), Dictation Practice (Type what you hear), and Transcript list with progress tracking.
  - **Streamlined Unified Header (`DictationHeader`)**: Focuses cleanly on lesson context with back navigation to `/topics`, current lesson title/category, and a dedicated high-contrast **Sổ từ vựng** (Vocabulary notebook) button pushed to the far right. Redundant lesson selector dropdown and custom video import controls are eliminated.
  - **Centered Difficulty Tabs (`DictationPracticeColumn`)**: Features centered `Easy`, `Normal`, `Hard` difficulty switcher tabs aligned in the middle of the practice column without colored circle emojis, maintaining consistent design tokens and 0px layout shift.
  - **Column Visibility Toggles**: Provides top-level `Hide media` and `Hide transcript` toggle buttons that dynamically resize the remaining columns without breaking layout (expanding to 2 columns or 100% centered Focus Mode).
  - **3 Difficulty Levels**:
    - `Easy`: Hides ~30% of content words, keeps grammatical stop words, provides tokenized input blanks with length hints and auto-advancing cursor upon correct spelling.
    - `Normal`: Hides ~65% of words in the sentence with realtime validation and hint support.
    - `Hard`: 100% hidden transcript with freeform `textarea` dictation.
  - **Instant Dictionary & Vocabulary Notebook**: Students can click on any word in the transcript or dictation area to open a dictionary popover featuring IPA phonetics, parts of speech, English & Vietnamese definitions, Web Speech API audio pronunciation, and one-click saving to `localStorage` vocabulary flashcards notebook.
- **Usage Example**:
  ```tsx
  import { TopicsPage } from '@/features/topics'
  import { DictationPage } from '@/features/dictation'

  // Route registration in router:
  <Route path="topics" element={<TopicsPage />} />
  <Route path="topics/dictation/:lessonId" element={<DictationPage />} />
  ```
- **Constraints & Invariants**:
  - Semantic design tokens only (`bg-surface-container-lowest`, `border-outline-variant`, `text-primary`, `bg-tertiary`).
  - Zero layout shift during play/pause or column collapse/expand.
  - Keyboard shortcuts: <kbd>Tab</kbd> for play/pause segment, <kbd>R</kbd> for replay, <kbd>Enter</kbd> for answer submission.
  - YouTube player synchronization strictly constrained to segment `start` and `end` times with optional auto-looping.

### 14. Gamified Bite-Sized Exercise Runner (Duolingo-Inspired)

- **Asset Name & File Path**:
  - `ExerciseGamifiedRunner` (`src/features/exercises/runner/ExerciseGamifiedRunner.tsx`)
  - `SingleChoiceQuestion` (`src/features/exercises/runner/components/SingleChoiceQuestion.tsx`)
  - `MultipleChoiceQuestion` (`src/features/exercises/runner/components/MultipleChoiceQuestion.tsx`)
  - `WordBankGapFillQuestion` (`src/features/exercises/runner/components/WordBankGapFillQuestion.tsx`)
  - `ExerciseTopBar` (`src/features/exercises/runner/components/ExerciseTopBar.tsx`)
  - `ExerciseBottomFeedbackDrawer` (`src/features/exercises/runner/components/ExerciseBottomFeedbackDrawer.tsx`)
  - `ExerciseCompleteScreen` (`src/features/exercises/runner/components/ExerciseCompleteScreen.tsx`)
  - `soundEffects` (`src/features/exercises/runner/utils/soundEffects.ts`)
  - `.btn-duo-3d`, `.card-duo-choice`, `.card-duo-choice-selected` (`src/styles/globals.css`)
- **Purpose & UX Intent**:
  - **Bite-sized Gamified Learning Loop**: Transforms short drill exercises into an interactive, encouraging game experience inspired by Duolingo.
  - **3 Core Question Mechanics**:
    1. `single_choice`: 3D tactile cards with numbered shortcut keys (1–4), instant single-selection toggle, and check evaluation.
    2. `multiple_choice`: Multi-select card list with real-time selection counter (`Đã chọn: X/Y`) and atomic toggling.
    3. `word_bank_gap_fill`: Interactive sentence blanks and bank of word chips. Tapping chips moves them into the first available blank slot; tapping filled slots returns chips to the pool. When a chip is slotted, its original pool spot shows an outlined placeholder ensuring a strict **0px layout shift**.
  - **Sticky Bottom Feedback Drawer**:
    - `Idle`: Disabled/neutral "Kiểm tra" button until valid input is given.
    - `Correct`: Slides up with vibrant emerald theme (`bg-emerald-100/90 text-emerald-950`), pleasant chime tone, and "Tiếp tục" CTA.
    - `Incorrect`: Slides up with soft rose theme (`bg-rose-100/95 text-rose-950`), soft buzzer sound, correct answer summary, and IELTS Linearthinking rule explanation. Supports <kbd>Enter</kbd> key for instant Check / Continue.
  - **Native Web Audio API (`soundEffects`)**: Zero-asset audio engine using browser `AudioContext` oscillators (chime, buzz, tap, victory chord) with no external network latency or audio file dependencies.
  - **Celebration End Screen (`ExerciseCompleteScreen`)**: Victory fanfare, accuracy rate, and max combo streak bonus.
- **Usage Example**:
  ```tsx
  import { ExerciseGamifiedRunner } from '@/features/exercises/runner'

  ;<ExerciseGamifiedRunner
    exerciseId="EX-01"
    onExit={() => setActiveExerciseId(null)}
    onComplete={({ accuracyPct }) => {
      toast.success(`Chúc mừng! Bạn đã hoàn thành bài tập (Chính xác: ${accuracyPct}%)`)
    }}
  />
  ```
- **Constraints & Invariants**:
  - Zero pixel layout shift when moving words between bank and blank slots.
  - 3D tactile button motion budget: `border-b-4 active:border-b-0 active:translate-y-1` (150ms `ease-out`).
  - Native Web Audio oscillators safely muted/unmuted with global toggle state persisted.
  - Keyboard listeners (<kbd>1–4</kbd> and <kbd>Enter</kbd>) must automatically detach upon unmount.

### 15. Teacher Vocabulary Sets & Word List Study Module

- **Asset Name & File Path**:
  - `VocabularyDetailPage` (`src/features/vocabulary/VocabularyDetailPage.tsx`)
  - `VocabularyWordCard` (`src/features/vocabulary/components/VocabularyWordCard.tsx`)
  - `FlashcardModal` (`src/features/vocabulary/components/FlashcardModal.tsx`)
  - `vocabularyService` (`src/services/vocabularyService.ts`)
- **Purpose & UX Intent**:
  - **Curated Teacher Word Lists**: Enables students to view and interact with the exact academic IELTS vocabulary words assigned for each course unit/topic.
  - **IELTS Academic Card Display**: Displays headword, IPA phonetics, native British pronunciation via Web Speech API, Vietnamese definition, concise English definition, real exam example sentence with underlined target keyword (`underline underline-offset-4 decoration-primary decoration-2`), and academic collocations/synonyms.
  - **Tactile Mastery & Starred Tracking**: Direct 1-tap toggles for "Đã thuộc" via Brain icon button (`<Brain />` in green when mastered, outline when unmastered) and "Lưu ý" (Starred) that update progress counters in real time and persist to browser `localStorage` (`ielts_vocab_progress_${setId}`).
  - **Fast Recall 3D Flip Flashcard Drilling**: Modal study view with hardware-accelerated 3D flip card animation (`perspective: 1200px`, `transform-style: preserve-3d`, `rotateY(180deg)`), ergonomic floating side chevrons, auto-play audio toggle, and keyboard controls (<kbd>Space</kbd> to flip, <kbd>←</kbd> / <kbd>→</kbd> to navigate, <kbd>M</kbd> to toggle mastered, <kbd>S</kbd> to toggle note, <kbd>Esc</kbd> to close).
- **Usage Example**:
  ```tsx
  import { VocabularyWordCard } from '@/features/vocabulary/components/VocabularyWordCard'
  import { FlashcardModal } from '@/features/vocabulary/components/FlashcardModal'

  <VocabularyWordCard
    word={word}
    onToggleMaster={(id) => handleToggleMaster(id)}
    onToggleStar={(id) => handleToggleStar(id)}
  />

  <FlashcardModal
    words={words}
    isOpen={isFlashcardOpen}
    onClose={() => setIsFlashcardOpen(false)}
    onToggleMaster={handleToggleMaster}
    onToggleStar={handleToggleStar}
  />
  ```
- **Constraints & Invariants**:
  - Strict 0px layout shift between front and back 3D card faces with equal `min-h-[360px]` and matching padding.
  - Web Speech API synthesizes audio without external third-party network dependencies; audio button clicks suppress flip event via `e.stopPropagation()`.
  - Smooth 450ms cubic-bezier transition budget (`cubic-bezier(0.4, 0, 0.2, 1)`) for 3D flip without layout jumping.
  - Keyboard listeners automatically clean up on modal dismiss.
  - Ready for backend API handoff via explicit `// 🔌 WIRE:` tags in `vocabularyService.ts`.

### 16. Mobile Responsive Navigation Drawer (MobileSidebar)

- **Asset Name & File Path**: `MobileSidebar` (`src/shared/components/MobileSidebar/index.tsx`)
- **Purpose & UX Intent**:
  - Full-featured mobile navigation drawer with hardware-accelerated slide-over motion.
  - Features a smooth backdrop fade (`transition-opacity duration-300 ease-out`), GPU-accelerated panel slide (`transition-transform duration-300 ease-out`), body scroll locking (`document.body.style.overflow = 'hidden'`), route-change auto-dismissal, and <kbd>Escape</kbd> keyboard listener.
- **Usage Example**:
  ```tsx
  import { MobileSidebar } from '@/shared/components/MobileSidebar'

  // Mounted globally in AppLayout:
  ;<MobileSidebar />
  ```
- **Constraints & Invariants**:
  - Motion Budget: 300ms `ease-out` slide and fade.
  - Uses `invisible delay-300` on exit to allow exit transitions to play completely before removing pointer/focus visibility.
  - Body overflow restored on unmount/close to eliminate sticky body scroll bugs.

### 17. IELTS 4-Skills Mobile Exam Runner (< 768px Viewports)

- **Asset Name & File Path**:
  - `ReadingRunner` (`src/features/exam-runner/components/ReadingRunner.tsx`)
  - `ListeningRunner` (`src/features/exam-runner/components/ListeningRunner.tsx`)
  - `WritingRunner` (`src/features/exam-runner/components/WritingRunner.tsx`)
  - `SpeakingRunner` (`src/features/exam-runner/components/SpeakingRunner.tsx`)
  - `ExamBottomPalette` (`src/features/exam-runner/components/ExamBottomPalette.tsx`)
- **Purpose & UX Intent**:
  - Delivers a dedicated mobile-first, distraction-free IELTS exam runner on viewports `< 768px` that resolves split-pane failure, virtual keyboard intrusions, touch highlighting collisions, and Safari iOS microphone lockouts.
  - **Reading**: Resizable Question Bottom Sheet with 3 ergonomic snap states (15% Peek, 45% Split, 90% Full), touch drag handle, and quick snap buttons over an independent full-width passage layer.
  - **Listening**: Mobile sticky top audio player keeping track time and controls visible above the keyboard, combined with safe-zone `scrollIntoView({ behavior: 'smooth', block: 'center' })` auto-centering on input focus.
  - **Writing**: Expandable Task 1 accordion prompt/chart drawer, full-screen focus writing mode, debounced 3-second auto-save to localStorage, and dynamic floating word counter pinned above the mobile virtual keyboard via `window.visualViewport`.
  - **Speaking**: 2-stage pre-permission microphone onboarding modal preventing Safari iOS permanent lockout, responsive SVG circular countdown timer for Part 2 prep, and real-time audio waveform visualizers.
  - **Navigation**:
    - **Header & Bottom Steppers**: On mobile `< 768px`, displays a single active pill (`Reading (0/40)`, `Passage 1`, `Section 1`, `Task 1`, `Part 1`) flanked by two 50% half-inset circular chevron buttons (`h-7 w-7`, `-left-3.5` / `-right-3.5`), saving valuable horizontal screen real estate while maintaining 0px shift.
    - **Desktop**: Retains full horizontal tab bars inside centered `rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs` containers with absolute mathematical centering (`md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2`).
    - **Audio Volume**: Hidden on mobile (`hidden sm:flex`), allowing users to rely naturally on their device's physical volume rocker buttons.
  - Universal horizontal swipe ribbon with color status badges (emerald answered, amber flagged, slate unanswered) preserving strict 0px layout shift.
- **Usage Example**:
  ```tsx
  import { ReadingRunner } from '@/features/exam-runner/components/ReadingRunner'
  import { ListeningRunner } from '@/features/exam-runner/components/ListeningRunner'
  import { WritingRunner } from '@/features/exam-runner/components/WritingRunner'
  import { SpeakingRunner } from '@/features/exam-runner/components/SpeakingRunner'
  ```
- **Constraints & Invariants**:
  - Strict 0px layout shift across bottom sheet snaps, keyboard intrusions, and question ribbon navigation.
  - Desktop view (`>= 768px`) remains 100% untouched and pixel-perfect with dual-pane `react-resizable-panels`.
  - Hardware-accelerated CSS transitions (`transition-[height] duration-200 ease-out`).
  - No external drag or modal libraries; built with native touch events, `window.visualViewport`, and semantic Tailwind tokens.

### 18. Header User Dropdown (UserDropdown)

- **Asset Name & File Path**: `UserDropdown` (`src/shared/components/Header/UserDropdown.tsx`)
- **Purpose & UX Intent**:
  - Replaces static avatar display with an accessible, interactive user settings menu in the application header.
  - Displays student summary (Name, initials, student ID, email, active validity badge with remaining days countdown).
  - Provides instant navigation to "Sổ từ vựng" (`/vocabulary?tab=personal`), "Tài khoản" (`/profile`), and "Đăng xuất" (with toast feedback).
  - Handles outside clicks and <kbd>Escape</kbd> keyboard dismissals automatically.
- **Usage Example**:
  ```tsx
  import { UserDropdown } from '@/shared/components/Header/UserDropdown'

  // Inside AppHeader component:
  ;<div className="pl-2 border-l border-outline-variant">
    <UserDropdown />
  </div>
  ```
- **Constraints & Invariants**:
  - Motion Budget: 150ms-200ms `animate-pop-in` animation.
  - Zero Layout Shift: `absolute right-0 top-full mt-2 z-50` positioning eliminates shift in the sticky header.
  - Design tokens strictly respected: `bg-surface-container-lowest`, `border-outline-variant`, `text-primary`.

### 19. Personal Vocabulary Notebook (PersonalWordBank) & Student Profile Feature

- **Asset Name & File Path**:
  - `PersonalWordBank` (`src/features/vocabulary/components/PersonalWordBank.tsx`)
  - `PersonalWordCard` (`src/features/vocabulary/components/PersonalWordCard.tsx`)
  - `AddPersonalWordModal` (`src/features/vocabulary/components/AddPersonalWordModal.tsx`)
  - `PersonalFlashcardModal` (`src/features/vocabulary/components/PersonalFlashcardModal.tsx`)
  - `ProfilePage` (`src/features/profile/index.tsx`)
  - Services: `studentProfileService.ts`, `personalVocabService.ts`
- **Purpose & UX Intent**:
  - **Student Profile (`/profile`)**:
    - Complete 3-section tabbed account dashboard: Account Information (editable phone number with Vietnam mobile regex validation, read-only email, countdown progress), Security (current password, new password with dynamic strength meter, confirmation match check), and Enrolled Course & Class (schedule, instructors, progress bar, quick actions).
  - **Personal Vocabulary Notebook (`/vocabulary?tab=personal`)**:
    - Seamlessly integrated as Tab 2 on `/vocabulary` alongside teacher curriculum topic sets.
    - Word cards feature Web Speech API pronunciation, IPA transcription, context sentence highlighting, skill source tag, collocations, personal notes, and mastery level toggling (`needs_review`, `learning`, `mastered`).
    - Includes interactive Flashcard study mode with keyboard shortcuts (<kbd>Space</kbd> to flip, <kbd>←</kbd> / <kbd>→</kbd> to navigate) and instant word addition modal.
- **Usage Example**:
  ```tsx
  import { PersonalWordBank } from '@/features/vocabulary/components/PersonalWordBank'

  // Rendered in VocabularyPage based on active tab:
  {
    activeTab === 'personal' ? <PersonalWordBank /> : <CurriculumTopicSets />
  }
  ```
- **Constraints & Invariants**:
  - Strict 0px layout shift between tab transitions and filter pills (`border` width maintained on active/inactive states).
  - Offline-first persistence via `localStorage` with fallback initial IELTS academic mock seed.
  - Ready for real backend API connection via explicit `// 🔌 WIRE:` points in `studentProfileService.ts` and `personalVocabService.ts`.

### 20. Syllabus & Homework Card Grid Pattern (HomeworkPage)

- **Asset Name & File Path**: `HomeworkPage` (`src/features/homework/index.tsx`)
- **Purpose & UX Intent**:
  - Replaces basic vertical table row strips with the signature **Vocabulary-style 2-column card grid** (`grid grid-cols-1 md:grid-cols-2 gap-6`).
  - Standardizes learning item visualization across LMS:
    - **Header**: Skill category badges (`badge-tag`) + live completion status dot (`badge-minimal`).
    - **Body**: Bold academic headline (`text-headline-sm font-bold text-on-surface hover:text-primary transition-colors`), skill description, and animated progress percentage bar.
    - **Footer**: Due date / instructor metadata + contextual action buttons (`Nộp bài ngay`, `Xem bài đã nộp`, `Xem bài tập buổi`).
  - Features real-time search filtering and a portal-based Submission Detail modal (`selectedSubmittedHw`).
- **Usage Example**:
  ```tsx
  import { HomeworkPage } from '@/features/homework'
  ;<Route path="homework" element={<HomeworkPage />} />
  ```
- **Constraints & Invariants**:

### 21. Standardized Reusable Shared Components Registry

- **Asset Names & File Paths**:
  - `EmptyState` (`src/shared/components/EmptyState/index.tsx`)
  - `SearchInput` (`src/shared/components/FilterBar/SearchInput.tsx`)
  - `FilterDropdown` (`src/shared/components/FilterBar/FilterDropdown.tsx`)
  - `NavigationTabs` (`src/shared/components/NavigationTabs/index.tsx`)
  - `ProgressBar` (`src/shared/components/ProgressBar/index.tsx`)
  - `PageLoader` (`src/shared/components/PageLoader/index.tsx`)
  - Aggregated barrel export: `src/shared/components/index.ts`
- **Purpose & UX Intent**:
  - **`EmptyState`**: Universal fallback view when search, filter, or list queries return 0 items. Displays centered Lucide icon, bold academic title, supportive description, and an optional call-to-action button.
  - **`SearchInput`**: Standardized search field with embedded search icon, clear button, and semantic token hover/focus styles.
  - **`FilterDropdown`**: Reusable select popover with built-in outside-click detection (`useRef` + `mousedown`), animated chevron rotation, and active item checkmarks.
  - **`NavigationTabs`**: Enforces strict **0px layout shift** across all tabbed navigation bars (underline indicator `-mb-px` with `border-b-2`), academic motion (150ms), badge count pill, and semantic focus tokens.
  - **`ProgressBar`**: Configurable linear percentage progress bar supporting `primary`, `emerald`, `amber`, and `secondary` color variants with smooth CSS transitions (`duration-500 ease-out`).
  - **`PageLoader`**: Academic minimalist spinning indicator with optional Vietnamese progress message.
- **Usage Example**:
  ```tsx
  import { EmptyState, FilterDropdown, SearchInput, NavigationTabs, ProgressBar, PageLoader } from '@/shared/components'

  // NavigationTabs (0px shift):
  <NavigationTabs
    tabs={[
      { id: 'homework', label: 'Bài tập về nhà', count: 12 },
      { id: 'syllabus', label: 'Khung giáo trình', count: '8 Module' },
    ]}
    activeTab={activeTab}
    onChange={setActiveTab}
  />

  // FilterBar:
  <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm..." />
  <FilterDropdown label="Trạng thái" value={status} options={statusOptions} onChange={setStatus} />

  // ProgressBar:
  <ProgressBar value={75} variant="primary" size="md" />

  // EmptyState:
  <EmptyState
    title="Không tìm thấy bài tập nào"
    description="Vui lòng thử tìm kiếm bằng từ khóa khác."
    action={{ label: 'Xóa bộ lọc', onClick: handleResetFilters }}
  />
  ```
- **Constraints & Invariants**:
  - Strict 0px layout shift guaranteed on tabs and dropdown triggers.
  - Motion budget: 150ms-200ms `animate-pop-in` and `duration-150`.
  - Design tokens strictly respected (`bg-surface-container-lowest`, `border-outline-variant`, `text-primary`).
  - Zero raw hex codes and zero duplicate outside-click listeners across feature pages.

### 22. Personal Error Log & Exam Trap Analytics (Epic 4)

- **Asset Name & File Path**:
  - `ErrorLogWidget` (`src/features/dashboard/components/ErrorLogWidget.tsx`)
  - `useErrorLogStore` (`src/store/errorLogStore.ts`)
  - Barrel export: `src/features/dashboard/components/index.ts`
- **Purpose & UX Intent**:
  - **Diagnostic Trap Analytics (`ErrorLogWidget`)**: Diagnostic dashboard widget analyzing student mistake patterns across 5 core IELTS trap archetypes (`TRAP_NOT_GIVEN`, `VOCAB_UNKNOWN`, `TIME_PRESSURE`, `AUDIO_DISTRACTION`, `SPELLING_ERROR`).
  - **Dynamic Multi-Segment Progress Bar**: Visualizes trap proportions with color-coded segments and interactive category filter pills.
  - **Pedagogical Advice Callout**: Evaluates the student's highest frequency trap category and provides actionable academic strategies.
  - **Flashcard Review Modal**: Interactive self-testing modal enabling students to step through missed questions one-by-one, reveal Cambridge solutions and teacher reflections, and mark mastered questions to purge them from the review queue.
  - **Persistent Local Store (`useErrorLogStore`)**: Lightweight Zustand v5 store backed by `localStorage` (`error_log_storage_v1`) pre-seeded with 6 realistic Reading and Listening Cambridge mistakes for instant presentation.
- **Usage Example**:
  ```tsx
  import { ErrorLogWidget } from '@/features/dashboard/components'
  import { useErrorLogStore } from '@/store/errorLogStore'

  // Mounting the widget on Dashboard:
  ;<ErrorLogWidget />

  // Programmatically logging a missed question from exam review:
  const logError = useErrorLogStore((s) => s.logError)
  logError({
    questionId: 'Q14',
    testTitle: 'Cambridge 18 Academic Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt: 'The scientists anticipated the negative environmental impact...',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    notes: 'Text never states whether researchers anticipated impact before trials.',
  })
  ```
- **Constraints & Invariants**:
  - Zero pixel shift across filter pill toggles with identical 1px borders.
  - Strict adherence to semantic tokens (`bg-surface-container-lowest`, `border-outline-variant`, `text-on-surface`, `bg-primary`).
  - GPU-accelerated micro-animations (`animate-fade-in-up`, `card-interactive`).

### 23. 1-Click Contextual Vocabulary Collector (Epic 2)

- **Asset Name & File Path**:
  - `useTextSelection` (`src/shared/hooks/useTextSelection.ts`, `src/shared/hooks/index.ts`)
  - `VocabFloatingTooltip` (`src/shared/components/VocabCollector/VocabFloatingTooltip.tsx`)
  - `VocabCollector` (`src/shared/components/VocabCollector/VocabFloatingTooltip.tsx`)
  - Barrel export: `src/shared/components/VocabCollector/index.ts`, `src/shared/components/index.ts`
- **Purpose & UX Intent**:
  - **`useTextSelection`**: Custom hook that monitors text selection within the document or a designated container element (`containerRef`). Automatically computes client viewport coordinates `(x, y)` and bounding rect, sanitizes selections, and extracts the full surrounding context sentence containing the highlighted term using DOM range boundary inspection.
  - **`VocabFloatingTooltip`**: Floating micro-card positioned dynamically near the selected text (above with arrow or flipped below near viewport bounds). Features pre-curated academic IELTS dictionary lookup, phonetic IPA, speech synthesis via Web Speech API (`window.speechSynthesis`), context sentence with selected term highlighted, and 1-click persistence to student's Personal Vocabulary Notebook (`/vocabulary?tab=personal`).
  - **`VocabCollector`**: Plug-and-play compound component combining `useTextSelection` and `VocabFloatingTooltip`. Drop into any reading, listening transcript, or homework view with zero boilerplate.
- **Usage Example**:
  ```tsx
  import { VocabCollector, VocabFloatingTooltip, useTextSelection } from '@/shared/components'

  // Option 1: Drop-in auto collector across reading passage:
  <article ref={passageRef} className="prose">
    <p>The indiscriminate use of chemical fertilizers has led to severe soil degradation...</p>
    <VocabCollector containerRef={passageRef} sourceTitle="Cambridge 18 Reading Passage 1" />
  </article>

  // Option 2: Programmatic hook usage:
  const { selectedText, contextSentence, rect, isOpen, clearSelection } = useTextSelection()
  <VocabFloatingTooltip
    selectedText={selectedText}
    contextSentence={contextSentence}
    rect={rect}
    isOpen={isOpen}
    onClose={clearSelection}
    sourceTitle="Cambridge 18 Academic Reading"
  />
  ```
- **Constraints & Invariants**:
  - Strict **0px layout shift** with constant 1px borders and fixed paddings.
  - Smooth entrance via `.animate-pop-in` (under 250ms).
  - Web Speech API speech synthesis with fallback handling and cleanup on unmount.
  - Viewport-clamped positioning (`12px` padding from edges) with bidirectional arrow orientation (`top` vs `bottom`).
  - Strict **`font-sans antialiased`** styling to prevent inheriting `font-serif` from academic reading passages, preserving crisp Vietnamese diacritics.
  - Minimalist academic white dual-action floating toolbar:
    - Button 1: **"Lưu vào sổ từ vựng của tôi"** (`BookmarkPlus`, clean white with subtle hover).
    - Button 2: **"Highlight"** (`Highlighter`, clean white, applying authentic IELTS yellow highlight `bg-yellow-200/90 text-yellow-950 border-b border-yellow-400/80`).
  - Seamless persistence to `personalVocabService` and `/vocabulary?tab=personal`.

### 24. Student Graded Review & Detailed Essay Feedback (Epic 3)

- **Asset Names & File Paths**:
  - `ExamResultView` (`src/features/exam-runner/components/ExamResultView/index.tsx`)
  - `AnnotatedEssayReview` (`src/features/exam-runner/components/ExamResultView/AnnotatedEssayReview.tsx`)
  - `ModelAnswerTab` (`src/features/exam-runner/components/ExamResultView/ModelAnswerTab.tsx`)
  - `SpeakingFeedbackReview` (`src/features/exam-runner/components/ExamResultView/SpeakingFeedbackReview.tsx`)
  - Extended rubric models: `src/features/exam-runner/data/mockTeacherRubric.ts`
  - Barrel exports: `src/features/exam-runner/components/ExamResultView/index.tsx`, `src/features/exam-runner/components/index.ts`
- **Purpose & UX Intent**:
  - **`ExamResultView`**: Central master results screen providing seamless 4-mode navigation (Score Overview, 4-Color Annotated Essay Review, Cambridge Band 8.5+ Model Answers, and Speaking Audio Feedback).
  - **`AnnotatedEssayReview`**: Academic pedagogical essay grading view displaying student's Task 1 & Task 2 submissions with color-coded inline highlights:
    - 🔴 **Grammar**: `bg-rose-100 text-rose-900 border-b-2 border-rose-500`
    - 🟡 **Lexical Resource / Collocations**: `bg-amber-100 text-amber-900 border-b-2 border-amber-500`
    - 🔵 **Coherence & Cohesion**: `bg-sky-100 text-sky-900 border-b-2 border-sky-500`
    - 🟢 **Teacher Kudos**: `bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500`
    - Includes interactive Click-to-Inspect popover panel with teacher commentary, Band 8.0+ rewrite suggestions, 1-click clipboard copy, and category filter pills.
  - **`ModelAnswerTab`**: Official Cambridge Band 8.5+ model essay viewer featuring collapsible structural breakdown accordions (Introduction, Overview, Body 1, Body 2, Conclusion), high-scoring collocation cards with Vietnamese translations, and examiner rationale analysis.
  - **`SpeakingFeedbackReview`**: Multi-part Speaking assessment hub with custom HTML5 audio playback, simulated reactive sound visualizer waveforms, 5s skip/replay controls, variable playback speeds (`0.75x`, `1.0x`, `1.25x`), candidate transcript snippets, and 4 Cambridge criteria scores (Fluency, Lexical, Grammar, Pronunciation).
- **Usage Example**:
  ```tsx
  import {
    ExamResultView,
    AnnotatedEssayReview,
    ModelAnswerTab,
    SpeakingFeedbackReview,
  } from '@/features/exam-runner/components'

  // Master result screen with tab switcher:
  <ExamResultView
    onReviewExam={() => handleOpenReview()}
    onExit={() => navigate('/tests')}
    initialTab="WRITING_ESSAY"
  />

  // Or modular standalone embedding:
  <AnnotatedEssayReview initialTask={1} />
  <ModelAnswerTab initialTask={2} />
  <SpeakingFeedbackReview initialPart={1} />
  ```
- **Constraints & Invariants**:
  - **Zero Pixel Shift (0px Shift)**: Identical border widths (`border border-slate-900` vs `border border-transparent` / `border border-slate-200`) across all tab states, category filter pills, and navigation triggers.
  - **Academic Motion Budget**: Transitions strictly between 150ms and 200ms (`transition-all duration-150`, `.animate-fade-in-up`).
  - **Semantic Tokens**: Styled exclusively using standard design tokens (`bg-surface-container-lowest`, `border-slate-200`, `text-slate-900`).
  - **SVG Standard**: All icons imported from `lucide-react` with `strokeWidth={1.75}` (idle) and `strokeWidth={2.2}` (active).

### 25. High-Performance Academic PDF Material Viewer

- **Asset Names & File Paths**:
  - `PdfMaterialViewer` (`src/features/materials/components/PdfMaterialViewer.tsx`)
  - Barrel export: `src/features/materials/components/index.ts`
  - Standalone reader route: `PdfReaderPage` (`src/features/materials/PdfReaderPage.tsx`)
  - Mock material data & worker: `public/sample-ielts-material.pdf`, `public/pdf.worker.min.mjs`
- **Purpose & UX Intent**:
  - Academic PDF viewer engine built on `react-pdf@9.2.1` + Mozilla `pdfjs-dist@4.8.69` tailored for IELTS coursebooks.
  - **Neutral Standard Reader Aesthetics (Non-system branded)**: Uses neutral grey and dark palettes (`bg-neutral-200`, `bg-neutral-900/90 text-white`) inspired by native PDF viewers (like Chrome / PDF.js) without system branding or LMS badges.
  - **Neutral Bottom Page Switcher Bar**: Floating dark bar at the bottom (`fixed bottom-5 left-1/2 -translate-x-1/2`) with prev/next buttons and live page input. Synchronized with an `IntersectionObserver` scroll spy.
  - **Collapsible Right-Side Table of Contents (Mục lục)**: Clean right drawer (`w-64 border-l border-neutral-300 bg-white`) toggled via the `Mục lục` button on the top right, displaying thumbnail previews that smoothly scroll to any page.
  - **Continuous Vertical Reading**: Pages render in a natural vertical scroll flow, responsive to viewport width (`Math.min(containerWidth - 48, 900)`).
  - **Vite 5 Web Worker Integration**: Uses local `/pdf.worker.min.mjs` for high-performance, offline-ready background PDF rendering without MIME type or CORS conflicts.
  - **VocabCollector Integration**: Native DOM TextLayer (`renderTextLayer={true}`) directly enables the 1-click Vocabulary Collector (`Lưu vào sổ từ vựng của tôi` & `Highlight`). Students can select any vocabulary in the PDF to immediately open the pronunciation/definition tooltip and save to their personal notebook.
- **Usage Example**:
  ```tsx
  import { PdfMaterialViewer } from '@/features/materials/components'

  // Embedded or standalone reader:
  ;<PdfMaterialViewer
    url="/sample-ielts-material.pdf"
    title="IELTS Hồ Thành Reading 6.5+ Master Method"
    subtitle="Giáo trình cốt lõi kỹ năng Đọc hiểu tuyến tính"
    onClose={() => navigate(-1)}
  />
  ```
- **Constraints & Invariants**:
  - Strict `font-sans antialiased` container.
  - Responsive canvas scaling via container resize listener (`width={Math.min(containerWidth - 48, 900)}`).
  - Zero pixel layout shift.

### 26. Personal Mistake Log & Exam Trap Analytics

- **Asset Names & File Paths**:
  - Store: `useMistakeLogStore` (`src/store/mistakeLogStore.ts`, with `src/store/errorLogStore.ts` alias)
  - Dashboard Widget: `MistakeLogWidget` (`src/features/dashboard/components/MistakeLogWidget.tsx`)
  - Dedicated Page: `MistakeLogPage` (`src/features/mistake-log/index.tsx`, route `/mistake-log`, `/error-log`)
- **Purpose & UX Intent**:
  - Pedagogical mistake tracking engine (Sổ tay lỗi sai & Bẫy đề thi) capturing student exam mistakes during mock tests.
  - Renamed from "Error Log" to **Mistake Log** to align with academic IELTS learning terminology (IELTS Mistake Journal) and clearly distinguish pedagogical learning mistakes from software system/HTTP errors.
  - Categorizes mistakes into 5 high-frequency IELTS trap archetypes (`TRAP_NOT_GIVEN`, `VOCAB_UNKNOWN`, `TIME_PRESSURE`, `AUDIO_DISTRACTION`, `SPELLING_ERROR`).
  - Visual stacked distribution bar with live percentage calculation and actionable advice.
  - Interactive flashcard-style review modal allowing students to self-test, reveal answers, inspect diagnostic notes, and mark questions as mastered.
- **Usage Example**:
  ```tsx
  import { MistakeLogWidget } from '@/features/dashboard/components'
  import { useMistakeLogStore } from '@/store/mistakeLogStore'

  // Log a mistake when student fails a question
  const { logMistake } = useMistakeLogStore.getState()
  logMistake({
    questionId: 'Q14',
    testTitle: 'Cambridge 18 Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt: 'The research team anticipated...',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    notes: 'Đoạn văn không đề cập đến việc dự đoán trước tác động.',
  })

  // Render widget on Dashboard
  ;<MistakeLogWidget />
  ```
- **Constraints & Invariants**:
  - Persisted in `localStorage` under `mistake_log_storage_v1`.
  - Zero layout shift with robust empty states and instant academic seed data.
