# Agent Operating Manual — DOL IELTS LMS

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
