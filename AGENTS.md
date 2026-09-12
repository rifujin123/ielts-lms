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

| Concept                     | Authoritative Reference                                      | Rule Summary                                                                                          |
| --------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Architecture & Stack**    | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)               | Service → Hook → Component pattern, barrel exports, strict typing.                                    |
| **Product Requirements**    | [`docs/PRD.md`](docs/PRD.md)                                 | 16 screens, user stories, non-functional criteria.                                                    |
| **Design Tokens**           | `src/styles/tokens.css`                                      | Never use raw hex colors in JSX. Use semantic tokens (`text-primary`, `bg-surface-container-lowest`). |
| **UX Micro-Interactions**   | `src/styles/globals.css`                                     | Use `.card-interactive`, `.btn-interactive`, `.animate-fade-in-up`, `.animate-pop-in`.                |
| **Error Handling & Toasts** | [`src/shared/components/Toast`](src/shared/components/Toast) | 4-tier error defense, animated top-right toasts, `toast.error()`, `skipErrorToast`.                   |

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
6. **Anti-Overdecoration & Scalable UI (Tránh lạm dụng Icon & Status Badge gắn chặt vào dữ liệu động)**:
   - **Tư duy hướng Backend & Khả năng mở rộng (Scalable Data Modeling)**: Khi dựng giao diện dựa trên mock data (ví dụ danh mục/categories, tags, topics, stages...), tuyệt đối **KHÔNG hardcode hoặc sinh ra icon SVG / badge màu mè riêng cho từng phân loại tĩnh**.
   - _Lý do_: Backend API thực tế chỉ lưu và trả về dữ liệu văn bản thuần (ví dụ `category_name`, `topic_name`), backend không lưu SVG icon hay màu sắc riêng cho từng danh mục. Nếu người dùng tạo thêm một danh mục mới từ trang quản trị (Admin/CMS), frontend sẽ bị gãy cấu trúc hiển thị hoặc lập trình viên phải sửa code thủ công để bổ sung icon mới.
   - **Quy tắc hiển thị**:
     - Áp dụng phong cách tối giản (academic & minimalist), dùng thiết kế trung tính (neutral semantic token) thống nhất cho mọi item trong danh sách phân loại.
     - **Không spam badge vô nghĩa**: Hạn chế tối đa việc gắn các status badge nhỏ lẻ (như đếm số lượng video/bài học ngay bên cạnh tiêu đề, badge trạng thái thừa thãi) làm rối mắt người học, trừ khi người dùng yêu cầu rõ ràng hoặc thực sự cần cho luồng hành động chính.

---

## 🚨 Error Handling & Toast Notification Protocol for Agents

The application implements an automated, multi-tier system-wide error handling architecture. Whenever you build or modify features, you MUST follow these instructions:

### 1. The 4 Layers of Error Defense

1. **Network & HTTP Layer (`src/lib/axios.ts`)**:
   - The global response interceptor automatically catches all HTTP error statuses (`400`, `401`, `403`, `404`, `429`, `500+`, network disconnects, timeouts).
   - Converts each into an animated top-right toast with user-friendly Vietnamese explanations.
   - **Do NOT manually write `toast.error` inside try/catch blocks for standard Axios calls** — the interceptor already displays it.
2. **Server State Layer (`src/lib/queryClient.ts`)**:
   - `QueryCache` and `MutationCache` automatically catch query and mutation errors.
   - For queries, an automated toast with a **"Thử lại"** action button calls `query.fetch()` to retry immediately.
3. **Window Runtime Layer (`src/shared/providers/GlobalErrorHandler.tsx`)**:
   - Catches unhandled exceptions and unhandled promise rejections, offering a **"Tải lại trang"** reload action button.
4. **React Rendering Layer (`src/shared/components/ErrorBoundary/index.tsx`)**:
   - `FeatureErrorBoundary` wraps each route inside `AppLayout`. If a component crashes during render, only that feature is replaced with a recovery card, while alerting the student via an error toast.
   - `GlobalErrorBoundary` wraps the entire root in `src/App.tsx`.

### 2. How to Trigger Toasts in Feature Code

When you need to trigger a toast programmatically (e.g. form validation, manual user feedback):

```tsx
import { toast } from '@/shared/components/Toast/toastStore'

// Error notification with description and action:
toast.error('Không thể nộp bài', {
  description: 'Vui lòng điền đầy đủ các câu hỏi bắt buộc trước khi nộp.',
  action: {
    label: 'Kiểm tra lại',
    onClick: () => scrollToFirstUnanswered(),
  },
  duration: 5500, // optional, defaults to 5500ms for errors
})

// Success notification:
toast.success('Đã nộp bài tập thành công!')

// Warning notification:
toast.warning('Thời gian làm bài sắp hết', {
  description: 'Còn 5 phút trước khi hệ thống tự động thu bài.',
})

// Info notification:
toast.info('Tài liệu đã được lưu vào danh sách đọc sau')
```

### 3. How to Suppress or Customize Errors (Silent Mode)

If a feature requires **inline error display** (e.g., inline field validation under an input) without triggering a top-right popup toast:

- **Axios**: Pass `skipErrorToast: true`:
  ```ts
  const { data } = await apiClient.post('/api/endpoint', payload, { skipErrorToast: true })
  ```
- **TanStack Query**: Pass `meta: { suppressToast: true }`:
  ```ts
  const { data } = useQuery({
    queryKey: ['custom-check'],
    queryFn: fetchCheck,
    meta: { suppressToast: true },
  })
  ```

### 4. Toast Container Placement Rule

- The `<ToastContainer />` is mounted **once globally** in `src/shared/layouts/AppLayout/index.tsx` at `fixed top-5 right-5 z-50`.
- **CRITICAL**: Never mount `<ToastContainer />` inside individual feature pages or components. This prevents duplicate toast stacks and ghost notifications.

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
