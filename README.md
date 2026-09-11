# DOL IELTS LMS — Student Portal

> React TypeScript student portal for DOL English IELTS Learning Management System. Rebuilt from scratch using modern stack with 16 Stitch design screens as the visual source of truth.

---

## Documentation

| Doc | Description |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements — user stories, functional & non-functional requirements, success metrics |
| [`docs/SPEC.md`](docs/SPEC.md) | Technical Spec — five-field kernel (Why, Capabilities, Constraints, Non-goals, Success Signal) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Architecture Reference — stack decisions, patterns, file structure, naming conventions |

---

## Stack

| | |
|---|---|
| Framework | React 18 + TypeScript (`strict: true`) |
| Build | Vite 5 + pnpm |
| Routing | React Router v6 (nested routes) |
| Server state | TanStack Query v5 |
| UI state | Zustand v5 |
| HTTP | Axios (service layer with mock flag) |
| Styling | Tailwind CSS v3 + `src/styles/tokens.css` |
| Components | shadcn/ui (Radix primitives) |
| Forms | React Hook Form + Zod + use-debounce |
| Quality | ESLint + Prettier + Husky pre-commit |
| Tests | Vitest (configured) |

---

## Design Source

All 16 screens are in [`stitch-assets/`](../stitch-assets/) — these are the single visual source of truth.

| Screen | Route |
|---|---|
| Course Info & Class Rules | `/` (root) |
| LMS Dashboard | `/dashboard` |
| Course Roadmap | `/roadmap` |
| Personal Roadmap | `/roadmap/personal` |
| Exercises | `/exercises` |
| Vocabulary | `/vocabulary` |
| Learning Materials | `/materials` |
| Book Unit Explorer | `/materials/books` |
| Homework / Syllabus | `/homework` |
| Final Test | `/final-test` |
| Online Tests | `/tests` |
| Classroom Hub | `/classroom` |
| Attendance Summary | `/attendance` |
| Practice Player | `/practice` |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Run with mock data (no backend needed)
VITE_USE_MOCK=true pnpm dev

# Run against real API
VITE_API_URL=http://localhost:3000/api VITE_USE_MOCK=false pnpm dev

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Test
pnpm test
```

---

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=true
```

---

## Repository

**GitHub**: https://github.com/rifujin123/ielts-lms
**Status**: 🏗️ Scaffold in progress
