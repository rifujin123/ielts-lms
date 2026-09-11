---
title: 'PRD — Teacher Vocabulary Sets & Word List Module'
status: approved
created: 2026-09-11
updated: 2026-09-11
author: 'Antigravity AI (Lead Product & System Architect)'
stakeholders: IELTS Hồ Thành Academic Board & Engineering Team
version: '1.0'
scope: 'Pure Frontend UI/UX (Zero Backend Implementation, Mock + LocalStorage Persistence)'
---

# PRD — Teacher Vocabulary Sets & Word List Module

## 1. Executive Summary & Problem Statement

### 1.1 The Problem

In the current IELTS Hồ Thành LMS portal, the Vocabulary feature (`/vocabulary`) only displays high-level topic headers (e.g., _Climate Change & Environmental Conservation_, _AI & Workplace_). When a student clicks "Học ngay" (Study Now), there is **no screen to view the actual vocabulary words, pronunciations, definitions, and IELTS collocations** curated and assigned by the teacher.

Students are left with no way to:

1. Inspect the specific academic vocabulary list assigned for their current unit.
2. Listen to accurate native pronunciation of challenging IELTS words.
3. Review contextual collocations and IELTS exam-oriented example sentences.
4. Track which words they have mastered vs. words that still require memorization.

### 1.2 The Solution

Deliver a **clean, academic, and highly focused Vocabulary Learning Module**:

- **Dedicated Set View (`/vocabulary/:setId`)**: A distraction-free study page showing the curated word list assigned by the teacher.
- **Academic IELTS Word Cards**: Each card displays the headword, Band target tag, IPA phonetic transcription, native audio pronunciation (via native browser Web Speech API), Vietnamese definition, IELTS contextual example sentence with keyword highlight, and high-scoring collocations/synonyms.
- **Tactile Mastery Tracking**: Instant toggles for "Đã thuộc" (Mastered) and "Lưu ý" (Starred/Bookmarked) that dynamically update set progress and persist across browser sessions via `localStorage`.
- **Search & Quick Filters**: Instant search by English word or Vietnamese meaning, with quick-filter pills (_Tất cả_, _Chưa thuộc_, _Đã thuộc_, _Đã lưu ý_).
- **Interactive Flashcard Mode**: A toggleable flip-card review mode with keyboard shortcuts (Space to flip, $\leftarrow$/$\rightarrow$ to navigate) for fast recall drilling.

### 1.3 🚨 Hard Constraints & Architectural Invariants

- **Zero Backend Dependency**: Fully functional immediately using rich mock data (`vocabulary.mock.ts`) and browser `localStorage`.
- **Backend API Wiring Ready**: Strictly decoupled through `vocabularyService.ts` with explicit `// 🔌 WIRE:` markers conforming to [`AGENTS.md`](file:///D:/GITHUB/IeltsLMS/AGENTS.md).
- **Zero Pixel Shift (0px Shift)**: State changes (mastered, starred, tab switching) preserve identical box-model dimensions.
- **Motion Budget**: Transitions strictly between 150ms and 250ms using semantic CSS tokens (`tokens.css`, `globals.css`).
- **Standard Vector Icons**: SVG icons from `lucide-react` with `strokeWidth={1.75}` (idle) and `strokeWidth={2.2}` (active).

---

## 2. Personas & User Journeys

| Persona                                   | Role & Demographics                                  | Core Need & Pain Point                                                                                                                                                                                                                 |
| :---------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hải Nam (IELTS Student - Aiming 7.0+)** | 20 years old, prepares for Writing Task 2 & Reading. | _"Em cần học đúng những từ vựng giáo viên chọn lọc cho bài học tuần này, có phiên âm chuẩn để phát âm đúng trong Speaking và collocation để viết Writing không bị gượng gạo. Em muốn đánh dấu những từ khó để ôn lại trước buổi học."_ |
| **Thầy Hồ Thành (Academic Director)**     | Head Instructor & Curriculum Designer.               | _"Mỗi bài học cần một bộ từ vựng trọng tâm từ 25–40 từ kèm ví dụ học thuật chuẩn Cambridge/IELTS. Giao diện phải sạch sẽ, tinh giản, không được màu mè gây phân tâm, học sinh tập trung tối đa vào mặt chữ, phiên âm và ngữ cảnh."_    |
| **Trợ giảng Thảo (Teaching Assistant)**   | Manages student progress & questions.                | _"Học viên thường hỏi lại danh sách từ của từng bài. Có màn hình hiển thị danh sách rõ ràng và thanh tiến độ hoàn thành giúp các em tự giác học từ vựng trước khi đến lớp."_                                                           |

---

## 3. Information Architecture & Navigation

```
[Khóa học (Root)] ──> [/vocabulary] (Catalogue các bộ từ vựng theo chủ đề)
                             │
                             ▼  (Click "Học ngay" hoặc Thẻ bộ từ)
                      [/vocabulary/:setId] (Trang chi tiết bộ từ)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Chế độ Danh sách thẻ (Mặc định)]    [Chế độ Lật Flashcard (Ôn nhanh)]
   - Header tiến độ & Thống kê         - Mặt trước: Từ, IPA, Loa
   - Ô tìm kiếm + Filter pills         - Mặt sau: Nghĩa, Ví dụ, Collocation
   - Danh sách thẻ từ vựng             - Phím tắt điều hướng Space, ←, →
```

- **URL Pattern**:
  - Catalogue: `/vocabulary`
  - Detail & Study: `/vocabulary/:setId` (ví dụ: `/vocabulary/VOCAB-01`)
- **Breadcrumb Navigation**:
  - `Khóa học` > `Từ vựng` > `Topic: Climate Change & Environmental Conservation`

---

## 4. Detailed Feature Specifications

### 4.1 Header & Mastery Overview (`/vocabulary/:setId`)

- **Back Button & Breadcrumbs**: One-click back to `/vocabulary`.
- **Topic Meta**: Set title, assigned tags (e.g. `Academic Reading`, `Band 7.0+`).
- **Progress Counter**:
  - Text summary: `Đã thuộc 28 / 35 từ`
  - Visual circular badge or bar: `80% hoàn thành`
- **Action Toolbar**:
  - Search input: Live search filtering against `word`, `vietnameseMeaning`, and `collocations`.
  - Filter pills:
    - `Tất cả (35)`
    - `Chưa thuộc (7)`
    - `Đã thuộc (28)`
    - `Đã lưu ý ⭐ (5)`
  - Switcher button: **"Chế độ Flashcard"** (với icon `Layers` hoặc `Repeat`).

---

### 4.2 IELTS Academic Vocabulary Card Design

Mỗi thẻ từ vựng trong danh sách thẻ được trình bày khoa học với các trường thông tin:

1. **Top Bar**:
   - **Headword**: Cỡ chữ `text-headline-sm` font đậm (`font-bold text-on-surface`).
   - **Word Type Badge**: Tag loại từ tinh gọn (`noun`, `verb`, `adjective`, `adverb`).
   - **Band Target Badge**: Tag chỉ mức độ từ vựng (ví dụ: `Band 7.5+`, `Band 8.0+`).
   - **Quick Actions**:
     - Nút Ngôi sao `Lưu ý` (toggle `starred`: icon vàng khi active).
     - Nút Checkmark `Đã thuộc` (toggle `isMastered`: viền và nền xanh lá nhẹ khi active).

2. **Phonetics & Audio**:
   - **IPA Transcription**: e.g., `[ˈklaɪ.mət tʃeɪndʒ]`.
   - **Pronunciation Audio Button**: Nút loa phát âm giọng bản xứ chuẩn Anh/Mỹ thông qua Web Speech API:
     ```ts
     const speak = (text: string) => {
       const utterance = new SpeechSynthesisUtterance(text)
       utterance.lang = 'en-GB'
       utterance.rate = 0.9
       window.speechSynthesis.speak(utterance)
     }
     ```

3. **Definitions**:
   - **Vietnamese Meaning**: Tiếng Việt nổi bật, dễ hiểu (`text-body-md font-semibold text-primary`).
   - **English Definition**: Định nghĩa ngắn gọn bằng tiếng Anh giúp học sinh tư duy bằng Anh ngữ.

4. **Contextual IELTS Example**:
   - Câu ví dụ trích xuất từ đề thi IELTS Writing/Reading thật.
   - Từ vựng mục tiêu trong câu được highlight nổi bật (`font-bold text-primary underline decoration-primary/40`).

5. **Collocations & Academic Synonyms**:
   - Khối chip nhỏ hiển thị 2–3 cụm collocations thông dụng nhất (e.g., `mitigate climate change`, `drastic measures`).

---

### 4.3 Flashcard Interactive Review Mode

Khi học sinh chọn nút **"Chế độ Flashcard"**:

- Giao diện chuyển sang thẻ Flashcard trung tâm với nền tập trung cao độ (minimalistic study mode).
- **Mặt trước (Front)**:
  - Từ vựng cỡ lớn `text-display-sm`
  - Phiên âm IPA + Nút nghe phát âm
  - Loại từ
  - Gợi ý: _"Nhấn phím Space hoặc bấm vào thẻ để lật"_
- **Mặt sau (Back)**:
  - Nghĩa tiếng Việt & giải nghĩa tiếng Anh
  - Câu ví dụ có highlight
  - Collocations
- **Điều khiển & Phím tắt**:
  - `←` (Mũi tên trái): Quay lại từ trước
  - `→` (Mũi tên phải): Sang từ tiếp theo
  - `Space` (Phím cách): Lật thẻ
  - `M` (Key M): Đánh dấu đã thuộc / chưa thuộc
  - Nút **"Thoát chế độ Flashcard"** (trở lại danh sách thẻ).

---

## 5. Data Models & TypeScript Schema

```ts
// src/types/api.types.ts

export interface VocabularyWord {
  id: string
  setId: string
  word: string
  phonetic: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase' | 'idiom'
  vietnameseMeaning: string
  englishDefinition?: string
  exampleSentence: string
  highlightWord?: string
  collocations: string[]
  bandTarget?: string // e.g., 'Band 7.0+', 'Band 8.0+'
  isMastered: boolean
  isStarred: boolean
}

export interface VocabularySetDetail extends VocabularySet {
  description?: string
  words: VocabularyWord[]
}
```

---

## 6. Frontend ↔ Backend Wiring Protocol (`// 🔌 WIRE:`)

Tuân thủ nghiêm ngặt quy định tại [`AGENTS.md`](file:///D:/GITHUB/IeltsLMS/AGENTS.md):

| Service                | Method                              | Backend Target                                     | Contract Type             | Mock Fallback                 |
| :--------------------- | :---------------------------------- | :------------------------------------------------- | :------------------------ | :---------------------------- |
| `vocabularyService.ts` | `getVocabularySets()`               | `GET /api/vocabulary`                              | `VocabularySet[]`         | `vocabularyMock`              |
| `vocabularyService.ts` | `getVocabularySetDetail(setId)`     | `GET /api/vocabulary/:setId`                       | `VocabularySetDetail`     | `vocabularyDetailMock[setId]` |
| `vocabularyService.ts` | `toggleWordMastered(setId, wordId)` | `POST /api/vocabulary/:setId/words/:wordId/master` | `{ isMastered: boolean }` | `localStorage` sync           |
| `vocabularyService.ts` | `toggleWordStarred(setId, wordId)`  | `POST /api/vocabulary/:setId/words/:wordId/star`   | `{ isStarred: boolean }`  | `localStorage` sync           |

---

## 7. Verification Checklist & Success Criteria

1. **Compilation & Quality**:
   - `pnpm type-check` $\implies$ 0 errors.
   - `pnpm lint` $\implies$ 0 warnings.
   - `pnpm build` $\implies$ Production bundle builds cleanly.
2. **State & Persistence**:
   - Học sinh bấm đánh dấu "Đã thuộc" hoặc "Lưu ý" $\to$ Tiến độ % trên header nhảy lập tức.
   - F5 tải lại trang $\to$ Trạng thái đánh dấu và tiến độ được giữ nguyên từ `localStorage`.
3. **Audio Speech**:
   - Bấm vào nút loa ở bất kỳ thẻ từ nào $\to$ Trình duyệt phát âm chuẩn từ vựng tiếng Anh.
4. **Layout Invariance**:
   - Không giật pixel (0px layout shift) khi chuyển đổi trạng thái card hoặc chuyển tab filter.
