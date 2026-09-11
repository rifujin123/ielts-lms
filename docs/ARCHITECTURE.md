---
title: 'Architecture Reference — DOL IELTS LMS'
created: 2026-09-11
updated: 2026-09-11
adopted_by: SPEC.md
---

# Architecture Reference — DOL IELTS LMS Student Portal

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

Sidebar active items are designed as **full pills** (`rounded-full`) with active state transitions:

- **Active state**: `bg-red-50 text-primary font-bold rounded-full shadow-xs ring-1 ring-primary/20 scale-[1.01]` + crimson indicator dot (`animate-pop-in`) + icon micro-scale (`scale-110`).
- **Inactive state**: `rounded-full text-secondary hover:bg-surface-container-low hover:text-on-surface hover:translate-x-0.5 transition-all duration-200 ease-out`.

### 3. Rules for Agents Building New Features

1. **Never import heavy JS animation libraries** for standard hover/entrance interactions — use the pre-built CSS utilities in `src/styles/globals.css`.
2. **Always add `.card-interactive`** to clickable or interactive card components.
3. **Always add `.btn-interactive`** to custom action buttons.
4. **Always add `.animate-pop-in`** to dynamically rendered badges and completion chips.
5. **Keep timing within 150–250ms** for hover/active feedback to maintain snappy, professional academic responsiveness.

---

## Gatekeeper — Post-Build Review Process

After the scaffold build is complete, a **Gatekeeper review agent** runs automatically and checks:

1. **Pattern consistency** — does every feature follow the service → hook → page pattern?
2. **TypeScript** — does `pnpm tsc --noEmit` pass with 0 errors?
3. **Wire comments** — does every mock branch have a `// 🔌 WIRE:` comment?
4. **Line budget** — is every `features/{name}/index.tsx` within 200–300 lines?
5. **Naming conventions** — do all files follow the agreed convention table?
6. **Token usage** — are there any raw color values in JSX?
7. **Barrel exports** — does every shared component use `ComponentName/index.tsx`?

**Decision**: Auto-fix minor issues; escalate critical findings to the developer with a clear action list.

---

## Environment Variables

```env
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

`VITE_USE_MOCK=true` → all service calls return mock data (development default)
`VITE_USE_MOCK=false` → all service calls hit `VITE_API_URL` (production / integration)
