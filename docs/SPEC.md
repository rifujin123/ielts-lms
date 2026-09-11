---
title: 'IELTS Hồ Thành LMS — Student Portal'
slug: ielts-lms
status: draft
created: 2026-09-11
updated: 2026-09-11
version: '0.1'
companions:
  - ARCHITECTURE.md
sources:
  - PRD.md
capabilities:
  - CAP-01
  - CAP-02
  - CAP-03
  - CAP-04
  - CAP-05
  - CAP-06
  - CAP-07
  - CAP-08
  - CAP-09
  - CAP-10
  - CAP-11
---

# SPEC — IELTS Hồ Thành LMS Student Portal

## Why

The IELTS Hồ Thành center's existing student portal has a broken UI/UX that cannot be maintained or extended. 500–1000 active students need a functional, modern portal to access their course materials, exercises, vocabulary, attendance, and progress — all currently inaccessible or unusable. A full rebuild from the stitch design assets is required, with the frontend decoupled from the backend (which is being rebuilt in parallel) via a typed API service layer.

---

## Capabilities

### CAP-01 — Course Information Hub

**Intent**: Students can view all course metadata (name, level, schedule, instructor, objectives, class rules, dates) from a single root page.
**Success**: Root route `/` renders Course Info page (screen 16) with real mock data; all 5 cards (CourseInfoCard, InstructorCard, ScheduleGrid, ObjectivesCard, ClassRulesCard) are present and populated.

### CAP-02 — Active Course Dashboard

**Intent**: Students can see all enrolled courses, session progress, and enter their Zoom classroom.
**Success**: `/dashboard` renders course card with progress bar, schedule chips, and "Enter classroom" CTA; search bar accepts input with 300ms debounce.

### CAP-03 — Course Roadmap & Phase Navigation

**Intent**: Students can view the multi-phase course roadmap and their personalized learning path.
**Success**: `/roadmap` renders phase overview; `/roadmap/personal` renders personalized roadmap list with filter and sort controls.

### CAP-04 — Exercises Practice

**Intent**: Students can see, filter, sort, and start assigned exercises.
**Success**: `/exercises` renders exercise list; status, skill, and sort filters work with `useDebounce`; empty state displays when no exercises assigned.

### CAP-05 — Vocabulary Practice

**Intent**: Students can see all vocabulary sets and start studying any set.
**Success**: `/vocabulary` renders vocabulary set list; "Học ngay" CTA is present on each set; empty state renders when no sets started.

### CAP-06 — Learning Materials & Book Units

**Intent**: Students can browse course books and navigate interactively through book units.
**Success**: `/materials` renders book list with phase filter; `/materials/books` renders unit explorer with expand/collapse and bookmark.

### CAP-07 — Homework & Syllabus

**Intent**: Students can see their homework assignments alongside the course syllabus.
**Success**: `/homework` renders homework list with practice item count; syllabus toggle is functional; "Làm bài" CTA present per item.

### CAP-08 — Online Tests & Final Test

**Intent**: Students can see, filter, and start online tests; view final test status and past submissions.
**Success**: `/tests` renders test list with type/skill/status filters; `/final-test` renders final test status with "Xem bài làm" action.

### CAP-09 — Classroom Hub & Attendance Tracking

**Intent**: Students can see attendance records, session status, download session materials, and export attendance reports.
**Success**: `/classroom` renders attendance streak card and session list with status tabs; `/attendance` renders session summary table with export and refresh actions.

### CAP-10 — Interactive Practice Player

**Intent**: Students can read a passage and answer questions in a split-view with highlight, audio, and font controls.
**Success**: `/practice` renders split-view layout; highlight tool, audio playback controls (pause, speed, volume), and font size controls (A-/A+) are interactive.

### CAP-11 — Responsive Navigation Shell

**Intent**: The app shell (header, sidebar, routing) works on desktop and mobile; a hamburger drawer replaces the sidebar on mobile.
**Success**: At 375px viewport, sidebar is hidden and hamburger icon opens a shadcn Sheet drawer with full navigation; desktop shows persistent 256px sidebar; all 14 routes are registered and reachable.

---

## Constraints

1. **16 stitch HTML screens are the visual source of truth** — no UI component may deviate from the stitch designs without explicit approval; pixel-level fidelity is expected for the root Course Info page.
2. **Single CSS token file** — all design tokens (colors, spacing, radius, typography) must live in `src/styles/tokens.css` as CSS custom properties and be referenced in `tailwind.config.ts`; no raw hex values or hardcoded sizes in JSX.
3. **Page entry point size** — every `features/{name}/index.tsx` must remain between 200–300 lines; logic exceeding this budget must be extracted to feature components or hooks.
4. **API decoupling** — no feature may directly import `axios` or make HTTP calls; all calls go through a service function; every mock branch has a `// 🔌 WIRE:` comment.
5. **TypeScript strict mode** — `strict: true` in `tsconfig.json`; no `any` types permitted.
6. **pnpm only** — npm and yarn must not be used; lockfile is `pnpm-lock.yaml`.
7. **Barrel pattern** — all reusable components must be exported via `ComponentName/index.tsx`; flat file components are not permitted in `shared/components/`.
8. **Vietnamese hardcoded** — i18n library is not used; all UI text is hardcoded Vietnamese.
9. **shadcn/ui only for primitives** — Radix-based interactivity (dropdowns, dialogs, sheets, tabs) must use shadcn/ui components; no custom re-implementation of these primitives.
10. **Backend team is building API in parallel** — the frontend must not block on API availability; `VITE_USE_MOCK=true` must make every screen fully functional with typed mock data.

---

## Non-Goals

- Teacher or admin portal UI (out of scope permanently for this repo)
- Authentication/login flow (handled by existing auth system; `[ASSUMPTION]`)
- Dark mode support
- Multi-language / i18n (Vietnamese is the only language)
- Real-time messaging, Zoom embed, or push notifications
- Enrollment, payment, or onboarding flows
- Offline / PWA capability
- IE11 or legacy browser support
- The Kỷ yếu (yearbook) and Certification screens (stubs only, no real data)
- Backend API development (separate repository and team)

---

## Success Signal

The scaffold is complete and correct when:

1. `pnpm tsc --noEmit` exits with **0 errors**
2. `pnpm lint` exits with **0 ESLint errors**
3. With `VITE_USE_MOCK=true`, navigating to every one of the 14 registered routes renders a populated page (no blank or error screens)
4. The root route `/` renders the Course Info page with all 5 section cards matching the stitch design (screen 16)
5. At 375px viewport width, the sidebar is hidden and the hamburger Sheet drawer opens with full navigation
6. Every service file contains at least one `// 🔌 WIRE:` comment per data-fetching function
7. Running `grep -r "any" src/` returns no TypeScript `any` usages (excluding comments)
8. The Gatekeeper review agent approves the build with no critical or high findings unresolved

---

## Open Questions

| ID    | Question                                                                 | Blocks                       |
| ----- | ------------------------------------------------------------------------ | ---------------------------- |
| OQ-01 | Can a student be enrolled in more than one active course simultaneously? | CAP-02, mock data shape      |
| OQ-02 | API base URL + auth mechanism (JWT header? cookie?)                      | CAP-01 through CAP-11 wiring |
| OQ-03 | Phase selector pill: clickable on all screens or read-only on some?      | CAP-11 header behavior       |
| OQ-04 | Are Kỷ yếu and Certification permanently out of scope or later sprint?   | CAP-08 sidebar links         |
| OQ-05 | Practice Player audio: streaming URL or local file?                      | CAP-10                       |
