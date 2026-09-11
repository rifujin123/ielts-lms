---
title: 'PRD — IELTS 4-Skills Mobile Exam Runner'
status: approved
created: 2026-09-11
updated: 2026-09-11
author: 'Antigravity AI (Lead Architect & Product Manager)'
research_citation: 'IELTS Mobile UX & Market Researcher Report (2026-09-11)'
stakeholders: IELTS Hồ Thành Academic Board & Engineering Team
version: '1.0'
scope: 'Pure Frontend Mobile Responsive & Adaptive Exam Experience (< 768px Viewports)'
---

# PRD — IELTS 4-Skills Mobile Exam Runner

> **Authoritative Source & Research Citation:**
> This document formalizes and executes the market analysis, competitor benchmark, and mobile ergonomic recommendations established by the **IELTS Mobile UX & Market Researcher Report** (September 2026). It serves as the primary implementation blueprint for autonomous dev agents and software engineers.

---

## 1. Executive Summary & Problem Statement

### 1.1 The Market & User Problem

Currently, over **65% of students** access the IELTS Hồ Thành LMS portal on mobile devices (smartphones, mini tablets with viewports 360px–430px). While desktop computer-delivered IELTS (CBT) follows a standard dual-pane split-screen layout (Reading passage on the left, Questions on the right), this layout breaks down catastrophically on mobile:

1. **Virtual Keyboard Intrusion**: Opening the virtual keyboard to type in a _Fill-in-the-Blanks_ or _Writing essay_ input consumes **50%–60% of the screen height**, forcibly pushing the web layout upwards, obscuring the surrounding text context, and disorienting the student.
2. **Reading Split-Pane Collapse**: On mobile viewports (< 768px), horizontal split-pane libraries compress panels into unreadable 180px slits or stack them vertically into a 15-scroll-page monstrosity, causing severe cognitive overload and short-term memory loss.
3. **Touch vs. Text Selection Conflicts**: Long-pressing to highlight text triggers native iOS Safari / Android Chrome context menus (_Copy, Share, Look Up_), corrupting the exam highlighting flow.
4. **Mobile Browser Audio & Mic Policy Quirks**: Safari iOS aggressively suspends background `AudioContext` and permanently locks out microphone permissions if an unannounced system prompt is declined.

### 1.2 The Solution

Deliver a **Mobile-First Adaptive Exam Runner** within `src/features/exam-runner/` that detects mobile viewports and seamlessly shifts into a high-ergonomics, distraction-free testing environment:

- **Reading**: An ergonomic **Resizable Bottom Sheet** holding the question cluster over a continuous, scrollable reading passage background.
- **Listening**: A persistent **Top Sticky Audio Player** paired with automated safe-zone scrolling (`scrollIntoView` centered) when focusing fill-in-the-blank inputs.
- **Writing**: A **Fullscreen Focus Writing Mode** with an accordion Task 1 prompt viewer, 3-second debounced auto-save, and floating word count pinned to `window.visualViewport`.
- **Speaking**: A **2-Stage Pre-permission Mic Onboarding** flow, large circular countdown timers for Part 2, and real-time audio waveform visualizers.
- **Navigation**: A **Compact Bottom Question Slider** (Questions 1–40) with color-coded status badges and single-tap smooth scrolling.

---

## 2. Competitor Benchmark & Research Insights

_(Extracted from Researcher Subagent Evaluation)_

| Platform                  | Current Mobile UX Architecture                           | Critical Strength                                  | Critical Weakness                                          | Key Takeaway for IELTS Hồ Thành                              |
| :------------------------ | :------------------------------------------------------- | :------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- |
| **Prep.vn**               | Tab Switcher (`[Đọc bài]` $\leftrightarrow$ `[Câu hỏi]`) | Has "Clue Jump" highlighting answers in passage.   | Constant tab flipping breaks reading comprehension flow.   | Avoid binary tab switches; keep passage context visible.     |
| **Study4.com**            | Single vertical scroll column + Question Jump Pills      | Fast horizontal question palette at bottom.        | Extreme page length; virtual keyboard blocks fill-in text. | Adopt the bottom question palette; fix keyboard obstruction. |
| **DOL English**           | Linearthinking layout + Touch Pop-up Dictionary          | Clean academic aesthetic; quick word lookup.       | Writing section on mobile lacks fullscreen focus mode.     | Build dedicated Fullscreen Focus Mode for Writing essays.    |
| **Duolingo English Test** | Card-based "One-Thing-Per-Page"                          | Perfect mobile thumb zone; zero keyboard clipping. | Incompatible with IELTS 13-question reading passages.      | Adapt card ergonomics inside an expandable bottom sheet.     |

---

## 3. Detailed Specifications by Skill

### 3.1 📖 IELTS Reading Mobile Runner

#### Architecture: The Resizable Bottom Sheet (Drawer)

- **Background Layer (Reading Passage)**:
  - Displays the 800–1000 word academic text in full width with comfortable typography (`text-[15px] leading-relaxed`, 16px horizontal padding).
  - Independent smooth vertical scrolling.
- **Foreground Layer (Question Bottom Sheet)**:
  - Anchored at the bottom of the screen with a tactile pull handle (`w-12 h-1.5 rounded-full bg-slate-300`).
  - **3 Snap States**:
    1. **Collapsed (Peek)**: 15% height — shows active question number and quick answer pills.
    2. **Default (Split)**: 45% height — student can read the top half while answering the bottom half.
    3. **Expanded (Full)**: 90% height — student can review all questions in the passage without background distraction.
  - Smooth 250ms CSS transform transition (`transition-transform ease-out`).
- **Touch-Friendly Highlighter (FAB Mode)**:
  - A floating pencil button (`Highlighter FAB`) at the bottom-right corner.
  - When active: Touch-drag selects and underlines text with academic yellow tint (`bg-amber-200/80`) without triggering native browser Copy/Paste dialogs.

```text
┌──────────────────────────────────────────────┐
│ [← Exit]        00:54:12 (Red <5m)  [Submit] │  <-- Sticky Top Bar
├──────────────────────────────────────────────┤
│ Passage 1: The Secret Life of Whales         │
│ Marine biologists have recently discovered...│  <-- Independent Passage Scroll
│ [Highlight: ON 🖍️]                          │
│                                              │
├──────────────────────────────────────────────┤
│ ══════════ [ Pull Handle ] ═════════════════ │  <-- Resizable Bottom Sheet
│ Question 4: True / False / Not Given         │
│ ( ) TRUE   (●) FALSE   ( ) NOT GIVEN         │
│ Question 5: Whales migrate in [__________]   │
├──────────────────────────────────────────────┤
│ [1] [2] [3] [4] [5*] [6] ... [13] (Swipe →)  │  <-- Mobile Question Slider
└──────────────────────────────────────────────┘
```

---

### 3.2 🎧 IELTS Listening Mobile Runner

#### Architecture: Top Sticky Audio Bar + Safe-Zone Auto-Scroll

- **Top Sticky Audio Player**:
  - Pinned directly under the header at `top-14 z-30`.
  - Displays play status, locked scrubber (non-seekable during mock exam mode), elapsed vs. total time (`12:30 / 32:00`), and volume indicator.
  - **Reason**: Bottom audio bars get obscured or displaced when the virtual keyboard pops up.
- **Safe-Zone Auto-Scroll for Fill-in-the-Blanks**:
  - When a student taps into any `<input>` field, listen to `focus` and invoke:
    ```ts
    targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ```
  - Keeps the question prompt and input field safely visible in the top 40% of the screen above the virtual keyboard.
- **Section Switcher**:
  - Horizontal pill selector for Sections 1, 2, 3, and 4 with instant badge counters (`10/10`, `8/10`).

---

### 3.3 ✍️ IELTS Writing Mobile Runner

#### Architecture: Focus Mode + Visual Viewport Word Count

- **Task 1 Accordion Prompt**:
  - On mobile, Task 1 charts and prompts collapse into an expandable accordion drawer (`[📊 Xem biểu đồ & Đề bài]`). Tapping expands the image with pinch-to-zoom capabilities.
- **Focus Fullscreen Mode**:
  - A single tap on the expand icon enters Fullscreen Writing Mode, hiding all navigation bars and maximizing vertical textarea real estate.
- **Pinned Word Counter (Visual Viewport Aware)**:
  - Standard `fixed bottom-0` elements get hidden behind the virtual keyboard on mobile browsers.
  - Use `window.visualViewport` resize listener to position the Word Counter bar dynamically right on top of the virtual keyboard:
    ```ts
    const viewport = window.visualViewport
    const bottomOffset = viewport ? window.innerHeight - (viewport.offsetTop + viewport.height) : 0
    ```
  - Displays: `168 words (Task 2: Min 250)` with dynamic color badge (amber when below minimum, emerald when sufficient).
- **Resilient Auto-Save**:
  - Saves draft text to `localStorage` (`ielts_writing_draft_${examId}`) every 3 seconds and on `blur`.

---

### 3.4 🎙️ IELTS Speaking Mobile Runner

#### Architecture: 2-Stage Permission Onboarding + Voice Waveform

- **Pre-Permission Gate (Zero-Surprise Prompting)**:
  - Never trigger `navigator.mediaDevices.getUserMedia` automatically on load.
  - Render an onboarding modal:
    > _"IELTS Hồ Thành cần kết nối Micro của bạn để ghi âm câu trả lời Speaking."_
    > `[Kiểm tra & Cấp quyền Micro]`
  - Clicking explicitly initiates the native browser permission dialog, preventing accidental permanent rejection on Safari iOS.
- **Part 2 Cue Card & Preparation Timer**:
  - Displays the Cue Card in high-contrast card layout.
  - Visual circular progress ring for the **60-second preparation phase**.
  - Automatically sounds a soft chime and starts recording for the **2-minute response phase**.
- **Live Waveform Visualizer**:
  - Real-time canvas audio visualizer (`Web Audio API AnalyserNode`) confirming to the student that their voice is actively being captured.

---

### 3.5 🧭 Unified Mobile Bottom Question Palette (`MobileBottomPalette`)

- **Placement**: Fixed at the bottom (`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200`).
- **Interaction**:
  - Horizontal swipeable list of square buttons (`h-10 w-10 shrink-0 font-bold text-xs rounded-xl`).
  - **Visual States (0px Layout Shift)**:
    - _Unanswered_: `bg-slate-100 text-slate-600 border border-slate-200`
    - _Answered_: `bg-emerald-50 text-emerald-700 border border-emerald-400 font-bold`
    - _Flagged / Review_: `bg-amber-50 text-amber-800 border-2 border-amber-500`
    - _Active_: `ring-2 ring-red-600 ring-offset-1`
  - Tapping any question number smoothly scrolls the view directly to that question.

---

## 4. Safety & Resiliency Protocol (Mobile Fail-Safe)

1. **Background Visibility Handling**:
   - Listen to `document.visibilityState`:
     ```ts
     document.addEventListener('visibilitychange', () => {
       if (document.visibilityState === 'hidden') {
         // Auto-pause audio if in practice mode; record timestamp
         saveCurrentExamProgress()
       }
     })
     ```
2. **Accidental Exit Prevention**:
   - Implement `beforeunload` listener while exam is in progress:
     ```ts
     window.addEventListener('beforeunload', (e) => {
       if (hasUnsavedAnswers) {
         e.preventDefault()
         e.returnValue = ''
       }
     })
     ```
3. **Instant Crash Recovery**:
   - Store all answers, flags, and elapsed time in `localStorage` under `ielts_active_session_${examId}` on every mutation.
   - If the browser closes or crashes, reopening the URL immediately restores exact question state and answers.

---

## 5. Developer Implementation Tasks for Dev Agent

| Task ID    | Component / Target File                                     | Description & Scope                                                                                                     | Acceptance Criteria                                                                               |
| :--------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| **MOB-01** | `src/features/exam-runner/components/ReadingRunner.tsx`     | Implement viewport detection (`useWindowSize` or CSS media query) and render mobile Bottom Sheet layout when `< 768px`. | Reading passage scrolls independently; Bottom Sheet has 3 snap points (15%, 45%, 90%); 0px shift. |
| **MOB-02** | `src/features/exam-runner/components/ExamBottomPalette.tsx` | Make question palette horizontally swipeable (`flex overflow-x-auto no-scrollbar`) on mobile viewports.                 | Questions 1–40 scroll smoothly with touch drag; tapping jumps directly to question.               |
| **MOB-03** | `src/features/exam-runner/components/ListeningRunner.tsx`   | Relocate audio player to sticky top on mobile; add auto-scroll centering on input focus.                                | Audio controls remain accessible; keyboard does not cover input fields.                           |
| **MOB-04** | `src/features/exam-runner/components/WritingRunner.tsx`     | Implement accordion Task 1 image viewer, fullscreen editor toggle, and `visualViewport`-aware word count.               | Word count stays visible above mobile keyboard; text auto-saves to `localStorage`.                |
| **MOB-05** | `src/features/exam-runner/components/SpeakingRunner.tsx`    | Add 2-stage microphone permission check and responsive cue card countdown layout.                                       | No auto-prompting for mic; waveform displays active speech signal.                                |
| **MOB-06** | `docs/ARCHITECTURE.md`                                      | Register mobile exam runner components and layout utilities in Reusable Asset Registry.                                 | Full documentation updated with constraints and usage examples.                                   |

---

## 6. Non-Functional Requirements & Invariants

- **Performance**: 60 FPS touch dragging on Bottom Sheet (`transform: translateY(...)` via CSS).
- **Bundle Size**: Zero heavy external drag-and-drop or modal libraries; use standard CSS touch events and Tailwind utilities.
- **Verification Commands (PowerShell)**:
  ```powershell
  pnpm type-check; pnpm lint; pnpm build
  ```
  Must compile with 0 errors and 0 warnings.
