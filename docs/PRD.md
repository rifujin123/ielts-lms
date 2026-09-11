---
title: 'IELTS Hồ Thành LMS — Student Portal'
status: draft
created: 2026-09-11
updated: 2026-09-11
author: John (BMad Product Manager)
stakeholders: IELTS Hồ Thành development team
version: '0.1'
---

# PRD — IELTS Hồ Thành LMS Student Portal

## 1. Background & Problem Statement

IELTS Hồ Thành is a Vietnamese IELTS preparation center serving **500–1000 active students** at any given time. The existing student-facing LMS portal has a **broken UI/UX** that is no longer maintainable or extendable. Students struggle to navigate between course materials, track their progress, complete exercises, and understand their schedule — core workflows for any language learning platform.

This project is a **full UI/UX rebuild** of the student portal, starting from zero with a modern React TypeScript codebase, while the backend (API) is being rebuilt in parallel by a separate team member. The new frontend will connect to the new API via a structured service layer once the backend is ready.

The source of truth for every screen's visual design is a set of **16 Stitch design assets** (`stitch-assets/`) already created by the design team. This PRD governs what gets built, in what priority, and to what standard.

---

## 2. Product Vision

> A fast, clean, and intuitive student portal that makes the IELTS Hồ Thành learning journey feel effortless — from checking course info on day one to tracking progress through exercises, vocabulary, and attendance across the entire course lifecycle.

---

## 3. Users

### Primary User: IELTS Student

- Vietnamese, age 18–30, moderate tech proficiency
- Accesses the portal on both **desktop** (study sessions) and **mobile** (quick checks between classes)
- Has one active course at a time (`[ASSUMPTION]`)
- Speaks Vietnamese; UI is entirely in Vietnamese with IELTS domain terms in English

### Secondary User: Course Admin / Teacher _(out of scope for this build)_

- Teachers and admins are not part of this portal rebuild

---

## 4. User Stories

### 4.1 Course Info (Root Page — Screen 16)

| ID    | Story                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------- |
| CI-01 | As a student, I want to see my course details (name, level, schedule, dates) at a glance so I know what I enrolled in |
| CI-02 | As a student, I want to see my instructor's profile and contact actions so I can reach out when needed                |
| CI-03 | As a student, I want to see a 7-day schedule grid so I know which days I have class                                   |
| CI-04 | As a student, I want to understand the course objectives so I know what I'm expected to achieve                       |
| CI-05 | As a student, I want to read the class rules so I know my responsibilities                                            |
| CI-06 | As a student, I want to download the course PDF and print materials                                                   |
| CI-07 | As a student, I want to message my instructor or book a 1-on-1 session                                                |

### 4.2 Dashboard (Screen 02)

| ID    | Story                                                                                         |
| ----- | --------------------------------------------------------------------------------------------- |
| DA-01 | As a student, I want to see all my active courses in one place                                |
| DA-02 | As a student, I want to see my session progress bar so I know how far through the course I am |
| DA-03 | As a student, I want to enter my active classroom with one click                              |
| DA-04 | As a student, I want to search across courses and materials                                   |
| DA-05 | As a student, I want to see my notification count                                             |

### 4.3 Course Roadmap (Screens 03, 08)

| ID    | Story                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------ |
| RD-01 | As a student, I want to see my multi-phase course roadmap so I understand the full learning path |
| RD-02 | As a student, I want to switch between course phases                                             |
| RD-03 | As a student, I want to access my personalized roadmap with filter and sort options              |
| RD-04 | As a student, I want to start a roadmap learning path                                            |

### 4.4 Exercises (Screens 01, 09)

| ID    | Story                                                                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------------- |
| EX-01 | As a student, I want to see all my assigned exercises with their status                                              |
| EX-02 | As a student, I want to filter exercises by status (all/pending/done) and skill (Reading/Writing/Listening/Speaking) |
| EX-03 | As a student, I want to sort exercises (newest/oldest)                                                               |
| EX-04 | As a student, I want to start an exercise with one click                                                             |
| EX-05 | As a student, I want to see a message when I have no exercises yet                                                   |

### 4.5 Vocabulary (Screens 04, 11) — See detailed [PRD_TEACHER_VOCABULARY.md](PRD_TEACHER_VOCABULARY.md)

| ID    | Story                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| VO-01 | As a student, I want to see all vocabulary sets assigned in my course with topic tags and progress overview     |
| VO-02 | As a student, I want to open a vocabulary set to view the full curated word list assigned by the teacher        |
| VO-03 | As a student, I want to see IPA phonetics, word type, Band level, Vietnamese definition, and IELTS collocations |
| VO-04 | As a student, I want to listen to native audio pronunciation for each word via Web Speech API                   |
| VO-05 | As a student, I want to read IELTS contextual example sentences with the target vocabulary highlighted          |
| VO-06 | As a student, I want to mark words as "Đã thuộc" (Mastered) or "Lưu ý" (Starred) to track my progress           |
| VO-07 | As a student, I want to switch to Flashcard flip mode with keyboard shortcuts for rapid memory drilling         |

### 4.6 Learning Materials (Screens 05, 15)

| ID    | Story                                                                                     |
| ----- | ----------------------------------------------------------------------------------------- |
| MA-01 | As a student, I want to browse all books and materials in my course                       |
| MA-02 | As a student, I want to filter materials by phase                                         |
| MA-03 | As a student, I want to browse my course's book units interactively                       |
| MA-04 | As a student, I want to expand/collapse book units and bookmark content                   |
| MA-05 | As a student, I want to see which units I have completed, am studying, or haven't started |

### 4.7 Homework / Syllabus (Screen 07)

| ID    | Story                                                                                 |
| ----- | ------------------------------------------------------------------------------------- |
| HW-01 | As a student, I want to see my homework assignments with the number of practice items |
| HW-02 | As a student, I want to view the course syllabus alongside homework                   |
| HW-03 | As a student, I want to submit homework with one click                                |

### 4.8 Final Test (Screen 06)

| ID    | Story                                                            |
| ----- | ---------------------------------------------------------------- |
| FT-01 | As a student, I want to see my final test information and status |
| FT-02 | As a student, I want to view my previous final test submission   |

### 4.9 Online Tests (Screen 12)

| ID    | Story                                                               |
| ----- | ------------------------------------------------------------------- |
| OT-01 | As a student, I want to see all online tests available in my course |
| OT-02 | As a student, I want to filter tests by type, skill, and status     |
| OT-03 | As a student, I want to start a test with one click                 |

### 4.10 Classroom & Attendance (Screens 13, 14)

| ID    | Story                                                                             |
| ----- | --------------------------------------------------------------------------------- |
| AT-01 | As a student, I want to see my attendance record across all sessions              |
| AT-02 | As a student, I want to see the status of each session (attended/upcoming/missed) |
| AT-03 | As a student, I want to download session materials                                |
| AT-04 | As a student, I want to see my learning streak                                    |
| AT-05 | As a student, I want to export my attendance report                               |

### 4.11 Interactive Practice Player (Screen 10)

| ID    | Story                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| PP-01 | As a student, I want to read a passage and answer questions in a split-view layout |
| PP-02 | As a student, I want to highlight text while reading                               |
| PP-03 | As a student, I want to control audio playback speed and volume                    |
| PP-04 | As a student, I want to adjust font size for readability                           |

---

## 5. Functional Requirements

### 5.1 Navigation & Layout

- **FR-NAV-01**: App uses a persistent left sidebar (desktop) and hamburger Sheet drawer (mobile)
- **FR-NAV-02**: Sidebar has two modes: Dashboard-level (global nav) and Course-level (per-course nav)
- **FR-NAV-03**: Header shows IELTS Hồ Thành logo, phase selector pill, and student profile on course pages; adds global search on the dashboard
- **FR-NAV-04**: Active navigation item is highlighted with `bg-red-50 text-primary border-l-4 border-primary`
- **FR-NAV-05**: React Router v6 nested routes; `AppLayout` renders once as the shell

### 5.2 API & Data Layer

- **FR-API-01**: All API calls go through a typed Axios instance at `src/lib/axios.ts`
- **FR-API-02**: Every mock data branch has a `// 🔌 WIRE: METHOD /api/endpoint` comment
- **FR-API-03**: `VITE_USE_MOCK=true` env flag switches all calls to mock data; `false` calls real API
- **FR-API-04**: Each feature has its own service file under `src/services/` or `src/features/{name}/services/`
- **FR-API-05**: TanStack Query wraps all data fetching; `staleTime` default is 5 minutes

### 5.3 State Management

- **FR-STATE-01**: Zustand manages UI-only state: sidebar open/closed, active phase, current user session
- **FR-STATE-02**: Server state (courses, exercises, etc.) lives in TanStack Query cache only

### 5.4 Forms & Filters

- **FR-FORM-01**: All filter inputs (status, skill, sort) use React Hook Form + Zod validation
- **FR-FORM-02**: All search inputs debounce at 300ms using `useDebounce` from `use-debounce`

### 5.5 Error Handling

- **FR-ERR-01**: Each feature has its own `ErrorBoundary`; a feature crash does not take down the whole app
- **FR-ERR-02**: Loading states use the shared `PageLoader` component with Suspense

### 5.6 Code Standards

- **FR-CODE-01**: Every page entry point (`features/{name}/index.tsx`) is 200–300 lines
- **FR-CODE-02**: Barrel pattern: all components exported from `ComponentName/index.tsx`
- **FR-CODE-03**: Path alias `@/` maps to `src/`
- **FR-CODE-04**: Tailwind semantic class names only (e.g. `text-primary`, `bg-surface-container-lowest`) — no raw hex colors in JSX

---

## 6. Non-Functional Requirements

| Category            | Requirement                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Performance**     | React.lazy + Suspense per feature route; initial bundle ≤ 200KB gzipped `[ASSUMPTION]`           |
| **Accessibility**   | shadcn/ui Radix primitives ensure keyboard navigation and ARIA roles on all interactive elements |
| **Type Safety**     | TypeScript `strict: true`; no `any` types; all props explicitly typed                            |
| **Code Quality**    | ESLint + Prettier enforced via Husky pre-commit hooks; no lint errors merged                     |
| **Browser Support** | Modern evergreen browsers; no IE support `[ASSUMPTION]`                                          |
| **Mobile**          | Responsive down to 375px; sidebar collapses to Sheet drawer on mobile                            |
| **Scalability**     | Architecture supports 500–1000 concurrent student sessions                                       |
| **Testability**     | Vitest configured; service layer is mockable via `VITE_USE_MOCK` flag                            |

---

## 7. Design System

The single source of truth for all visual design is:

- **Stitch assets**: `D:/GITHUB/IeltsLMS/stitch-assets/*.html` (16 screens)
- **Token file**: `src/styles/tokens.css` — CSS custom properties fed into `tailwind.config.ts`
- **Fonts**: Plus Jakarta Sans (display/headings) + Inter (body/labels) via Google Fonts
- **Icons**: Material Symbols Outlined via Google CDN
- **Primary color**: `#dc2626` (IELTS Hồ Thành crimson red)
- **Component library**: shadcn/ui (Button, Badge, Card, Sheet, Tabs, Select, DropdownMenu, Separator, Avatar, Progress, Table, Dialog, Tooltip, ScrollArea)

---

## 8. Out of Scope (v1 Scaffold)

- Teacher / admin portal
- Real-time messaging or Zoom integration (links only, no embed)
- Payment / enrollment flow
- Notifications system (bell icon only, no notification panel logic)
- Dark mode
- Multi-language support (Vietnamese hardcoded)
- Authentication / login flow (`[ASSUMPTION]` — auth handled by existing system)
- Push notifications
- Offline mode

---

## 9. Success Metrics

| Metric                                             | Target   |
| -------------------------------------------------- | -------- |
| All 16 screens scaffolded and navigable            | 100%     |
| No TypeScript errors (`pnpm tsc --noEmit`)         | 0 errors |
| No ESLint errors (`pnpm lint`)                     | 0 errors |
| Every service call has a `🔌 WIRE` comment         | 100%     |
| Page entry points within 200–300 line budget       | 100%     |
| Barrel pattern followed in all components          | 100%     |
| Mobile sidebar works on 375px viewport             | Pass     |
| `VITE_USE_MOCK=true` renders all screens with data | Pass     |

---

## 10. Open Questions

| #     | Question                                                                                               | Owner        | Priority |
| ----- | ------------------------------------------------------------------------------------------------------ | ------------ | -------- |
| OQ-01 | Does each student have exactly one active course, or can they be enrolled in multiple simultaneously?  | Product      | High     |
| OQ-02 | What is the API base URL and authentication mechanism (JWT, cookie, OAuth)?                            | Backend team | High     |
| OQ-03 | Should the Phase Selector pill be clickable across all screens, or read-only on some?                  | UX           | Medium   |
| OQ-04 | Is the "Kỷ yếu" (yearbook) and "Certification" feature in scope for a later sprint or permanently out? | Product      | Medium   |
| OQ-05 | Should the Interactive Practice Player (screen 10) support audio streaming or local file playback?     | Backend team | Medium   |
| OQ-06 | What is the notification system's data shape — are notifications fetched per-session or real-time?     | Backend team | Low      |

---

## 11. Repository

- **GitHub**: https://github.com/rifujin123/ielts-lms
- **Branch strategy**: `main` is stable; features developed on `feature/*` branches
- **Tech stack decision log**: `docs/SPEC.md`
- **Architecture reference**: `docs/ARCHITECTURE.md`
- **IELTS CBT Exam Runner PRD**: [`docs/PRD_IELTS_CBT_EXAM.md`](PRD_IELTS_CBT_EXAM.md)
- **IELTS Mobile Exam Runner PRD**: [`docs/PRD_MOBILE_EXAM_RUNNER.md`](PRD_MOBILE_EXAM_RUNNER.md)
