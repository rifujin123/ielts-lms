# PRD & Technical Scope — IELTS Hồ Thành LMS Next-Gen UX Upgrades

> **Document Version:** 1.0.0  
> **Status:** Approved for Implementation  
> **Author:** Mary (Lead Business Analyst)  
> **Target Audience:** Autonomous AI Agents & Core Engineers  
> **Core Architectural Invariant:** **Strict Decoupling & Zero Conflict (Zero Merge Collisions).** Each Epic operates within strictly defined, isolated directories and self-contained state boundaries so multiple agents can implement and test concurrently without overlapping file edits.

---

## 🧭 1. Executive Summary & Decoupling Strategy

Dựa trên phân tích sư phạm thực tế từ **Giám đốc học thuật** và phản hồi thực chiến từ **Học viên Band 8.0+**, hệ thống IELTS Hồ Thành LMS cần nâng cấp 4 tính năng chiến lược nhằm nâng cao vượt bậc trải nghiệm học viên trên **Cổng Học Viên (Student Portal)**.

### Quy tắc bất biến chống xung đột Code (Agent Isolation Principles):

1. **Sở hữu tệp tin độc quyền (Exclusive File Ownership)**: Mỗi Epic chỉ được phép tạo mới hoặc chỉnh sửa các tệp tin trong thư mục được phân định rõ ràng. Không có 2 Epic nào chỉnh sửa chung 1 tệp tin.
2. **Không phụ thuộc chéo vào State của nhau (State Decoupling)**: Mỗi Epic sử dụng Zustand store hoặc React state cục bộ của riêng mình. Giao tiếp giữa các module nếu có chỉ thông qua LocalStorage hoặc Shared Event/Callback.
3. **Tuân thủ Design Tokens & Asset Registry**: Mọi UI component mới phải tuân thủ tokens tại `src/styles/tokens.css`, micro-interactions từ `src/styles/globals.css` và cập nhật vào `docs/ARCHITECTURE.md`.

---

## 🗺️ 2. Bản đồ phân chia Epic & Phạm vi cách ly (Agent Matrix)

| Epic       | Tên Epic                                   | Thư mục sở hữu độc quyền                                                                                      | Phụ thuộc bên ngoài                  | Tác động Merge                                      |
| :--------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :----------------------------------- | :-------------------------------------------------- |
| **Epic 1** | **Ergonomic Dictation Hotkeys**            | `src/features/topics/`                                                                                        | `lucide-react`, standard HTML5 Audio | **0% Xung đột** (Chỉ sửa trong feature Topics)      |
| **Epic 2** | **1-Click Contextual Vocab Collector**     | `src/shared/components/VocabCollector/`<br>`src/shared/hooks/useTextSelection.ts`                             | `vocabularyService.ts`               | **0% Xung đột** (Tạo mới component & hook độc lập)  |
| **Epic 3** | **Student Graded Review & Essay Feedback** | `src/features/exam-runner/components/ExamResultView/`<br>`src/features/exam-runner/data/mockTeacherRubric.ts` | `ieltsExamStore.ts`                  | **0% Xung đột** (Tách module mới trong exam-runner) |
| **Epic 4** | **Personal Error Log & Trap Analytics**    | `src/features/dashboard/components/ErrorLogWidget.tsx`<br>`src/store/errorLogStore.ts`                        | `testsMock.ts`                       | **0% Xung đột** (Module widget mới cho Dashboard)   |

---

## 📋 3. Chi tiết từng Epic & Tiêu chí kỹ thuật

---

### 🎧 EPIC 1: Ergonomic Keyboard-Centric Dictation Engine

- **Mục tiêu**: Loại bỏ 100% việc phải dùng chuột khi làm bài nghe chép chính tả (Dictation). Giúp học viên giữ nguyên 10 ngón tay trên bàn phím để đạt trạng thái tập trung cao độ (Flow State).
- **Thư mục làm việc độc quyền**: `src/features/topics/`
- **Tệp tin tác động**:
  - `src/features/topics/hooks/useDictationHotkeys.ts` _(Tạo mới)_
  - `src/features/topics/components/DictationPlayer.tsx` _(Chỉnh sửa hoặc tách mới)_
  - `src/features/topics/components/DictationDiffView.tsx` _(Tạo mới)_
  - `src/features/topics/index.tsx` _(Chỉnh sửa nhẹ nội bộ)_

#### Yêu cầu tính năng chi tiết:

1. **Bộ phím tắt toàn cục (Global Hotkeys Listener)**:
   - `Tab` (hoặc `Escape`): Chuyển đổi trạng thái Play / Pause audio mà **không làm mất con trỏ (focus)** trong ô nhập liệu văn bản (`<textarea>` / `<input>`).
   - `Ctrl + ArrowLeft` (hoặc `Shift + Tab`): Lùi audio lại đúng `3.0s`.
   - `Ctrl + ArrowRight`: Tua audio tới `3.0s`.
   - `Alt + 1`: Chỉnh tốc độ audio về `0.75x` (chế độ nghe rõ âm nối).
   - `Alt + 2`: Chỉnh tốc độ audio về `1.0x` (chuẩn tốc độ người bản xứ).
   - `Alt + 3`: Chỉnh tốc độ audio về `1.25x` (thử thách tăng tốc).
2. **Auto-Ducking / Smart Auto-Pause**:
   - Khi học viên bắt đầu gõ chữ liên tục (typing cadence > 120 cpm), audio tự động hạ nhỏ âm lượng (ducking 30%) hoặc tạm dừng ở cuối cụm từ để học viên kịp gõ xong.
3. **Visual Keyboard Shortcut Cheatsheet**:
   - Đặt một thanh gợi ý phím tắt tinh gọn (Shortcut hints bar) ở dưới chân ô gõ chữ: `[Tab] Play/Pause • [Ctrl+←] -3s • [Alt+1/2/3] Speed • [Enter] Check`.
4. **Instant Diff Checking**:
   - Sau khi học viên gõ xong và nhấn `Enter`:
     - Chữ đúng: Màu xanh lá `text-emerald-700 bg-emerald-50`.
     - Chữ sai / gõ nhầm: Màu đỏ gạch `text-rose-700 bg-rose-50 line-through`.
     - Từ bị bỏ sót: Màu xám `text-slate-400 underline decoration-wavy`.

---

### 📖 EPIC 2: 1-Click Contextual Vocabulary Collector

- **Mục tiêu**: Cho phép học viên bôi đen bất kỳ từ/cụm từ nào trong bài đọc (Reading, Materials, Homework) để tra cứu nhanh và bấm 1 nút lưu thẳng vào Sổ từ vựng (`/vocabulary`) kèm ngữ cảnh câu văn thực tế.
- **Thư mục làm việc độc quyền**:
  - `src/shared/components/VocabCollector/` _(Tạo mới thư mục & barrel export)_
  - `src/shared/hooks/useTextSelection.ts` _(Tạo mới)_
- **Tệp tin tác động**:
  - `src/shared/components/VocabCollector/VocabFloatingTooltip.tsx`
  - `src/shared/components/VocabCollector/index.ts`
  - `src/shared/hooks/useTextSelection.ts`
  - Kết nối với `vocabularyService.ts` (API mock lưu từ vựng).

#### Yêu cầu tính năng chi tiết:

1. **Hook bắt vùng chọn chuột (`useTextSelection`)**:
   - Lắng nghe sự kiện `mouseup` / `selectionchange` trên trình duyệt.
   - Tính toán tọa độ `(top, left)` của vùng bôi đen để hiển thị tooltip nổi bám theo text.
   - Tự động lấy **nguyên văn câu văn chứa từ đó** bằng cách tìm dấu chấm câu trước và sau đoạn được chọn (Sentence Extraction).
2. **Floating Quick Card (`VocabFloatingTooltip`)**:
   - Hiển thị từ vựng đã chọn + phiên âm IPA mẫu + định nghĩa ngắn tiếng Việt / Anh.
   - Nút phát âm loa Audio (`Volume2`).
   - Nút CTA nổi bật: `+ Lưu vào Sổ từ vựng (+ Save to Notebook)`.
3. **Contextual Metadata Storage**:
   - Khi bấm lưu, dữ liệu được gửi đến `vocabularyService.addWord()` hoặc store từ vựng với cấu trúc:
     ```typescript
     interface CollectedWordPayload {
       word: string
       phonetic: string
       meaning: string
       contextSentence: string // Trích xuất tự động từ bài đọc
       sourceTitle: string // Ví dụ: "Cambridge 18 Academic Reading Test 1"
       createdAt: string
     }
     ```
   - Sau khi lưu thành công, hiển thị Toast xanh nhỏ `toast.success('Đã lưu vào Sổ từ vựng!', { duration: 2500 })`.

---

### 📝 EPIC 3: Student Graded Review & Detailed Essay Feedback

- **Mục tiêu**: Xây dựng trang xem lại kết quả bài thi Writing & Speaking cực kỳ chi tiết cho học viên, hiển thị bài viết được giáo viên sửa lỗi 4 màu (Inline Annotations), điểm 4 tiêu chí chuẩn Cambridge và bài mẫu Band 8.0+.
- **Thư mục làm việc độc quyền**: `src/features/exam-runner/components/ExamResultView/`
- **Tệp tin tác động**:
  - `src/features/exam-runner/components/ExamResultView/AnnotatedEssayReview.tsx` _(Tạo mới)_
  - `src/features/exam-runner/components/ExamResultView/SpeakingFeedbackReview.tsx` _(Tạo mới)_
  - `src/features/exam-runner/components/ExamResultView/ModelAnswerTab.tsx` _(Tạo mới)_
  - `src/features/exam-runner/components/ExamResultView/index.tsx` _(Refactor & Barrel export)_
  - `src/features/exam-runner/data/mockTeacherRubric.ts` _(Mở rộng mock data)_

#### Yêu cầu tính năng chi tiết:

1. **Màn hình đối soát bài viết có sửa lỗi (Annotated Essay View)**:
   - Hiển thị bài làm Task 1 & Task 2 của chính học viên.
   - Các đoạn sai được đánh dấu 4 màu sắc học thuật theo chuẩn 4 tiêu chí IELTS:
     - 🔴 **Grammar (Ngữ pháp)**: `bg-rose-100 text-rose-900 border-b-2 border-rose-500`
     - 🟡 **Lexical (Từ vựng/Collocation)**: `bg-amber-100 text-amber-900 border-b-2 border-amber-500`
     - 🔵 **Coherence (Mạch lạc/Liên từ)**: `bg-sky-100 text-sky-900 border-b-2 border-sky-500`
     - 🟢 **Teacher Kudos (Điểm sáng/Từ vựng tốt)**: `bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500`
   - **Click-to-Inspect Popover**: Click vào đoạn highlight mở một popover nhỏ hiển thị:
     - Nhận xét chi tiết của giáo viên.
     - Câu sửa gợi ý chuẩn Band 8.0 (`Rewrite Suggestion`).
2. **Tab Bảng điểm 4 Tiêu chí (Interactive Rubric Scorecard)**:
   - Cho phép học viên chuyển đổi xem nhận xét Task 1 và Task 2.
   - Thẻ điểm 4 tiêu chí (`Task Response / Achievement`, `Coherence & Cohesion`, `Lexical Resource`, `Grammatical Range & Accuracy`) kèm thanh tiến độ trực quan.
3. **Tab Bài viết mẫu (Model Answer Band 8.0+)**:
   - Cung cấp bài viết mẫu chuẩn Cambridge cho đề thi tương ứng kèm phân tích dàn ý và các cụm từ vựng "ăn điểm".
4. **Speaking Feedback Player**:
   - Trình phát lại các file audio Part 1, 2, 3 của học viên.
   - Kèm bảng nhận xét 4 tiêu chí Speaking (`Fluency`, `Lexical`, `Grammar`, `Pronunciation`) từ giám khảo.

---

### 📊 EPIC 4: Personal Error Log & Exam Trap Analytics

- **Mục tiêu**: Giúp học viên chẩn đoán và phân loại nguyên nhân làm sai câu hỏi sau mỗi bài thi (Reading/Listening), từ đó hiển thị Radar thống kê bẫy đề trên Dashboard để tập trung khắc phục điểm yếu.
- **Thư mục làm việc độc quyền**:
  - `src/features/dashboard/components/ErrorLogWidget.tsx` _(Tạo mới)_
  - `src/store/errorLogStore.ts` _(Tạo mới)_
- **Tệp tin tác động**:
  - `src/features/dashboard/index.tsx` _(Tích hợp widget)_
  - `src/features/exam-runner/components/QuestionCard.tsx` _(Bổ sung dropdown phân loại lỗi khi xem lại)_

#### Yêu cầu tính năng chi tiết:

1. **Bộ phân loại nguyên nhân sai (Mistake Tagging Dropdown)**:
   - Khi học viên xem lại bài thi đã nộp (Review Mode), ở mỗi câu sai (`isCorrect === false`), xuất hiện một menu dropdown tinh gọn:
     - 🪤 `TRAP_NOT_GIVEN`: Nhầm lẫn bẫy Not Given & False.
     - 📖 `VOCAB_UNKNOWN`: Không biết từ vựng chìa khóa / Paraphrase.
     - ⏱️ `TIME_PRESSURE`: Đọc ẩu / Thiếu thời gian làm bài.
     - 🎧 `AUDIO_DISTRACTION`: Lạc mất dấu âm thanh trong Listening.
     - ✍️ `SPELLING_ERROR`: Viết sai chính tả từ vựng.
2. **Error Log Store (`errorLogStore.ts`)**:
   - Lưu trữ danh sách các câu hỏi làm sai kèm nhãn phân loại vào LocalStorage.
3. **Dashboard Trap Analytics Widget (`ErrorLogWidget.tsx`)**:
   - Hiển thị trên màn hình chính Dashboard:
     - Tổng số câu sai cần ôn tập lại.
     - Biểu đồ phân bổ tỷ lệ các loại bẫy học viên hay mắc phải nhất (ví dụ: _62% lỗi do Bẫy Not Given_).
     - Nút hành động nhanh: **"Ôn tập lại 10 câu sai gần nhất (Review Missed Questions)"**.

---

## 🔒 4. Cam kết không xung đột (Merge Safety Matrix)

```
[Agent 1] ───> src/features/topics/*                      (Dictation Hotkeys)
[Agent 2] ───> src/shared/components/VocabCollector/*     (Vocab Tooltip & Selection)
[Agent 3] ───> src/features/exam-runner/ExamResultView/*  (Graded Review & Feedback)
[Agent 4] ───> src/features/dashboard/ErrorLogWidget.tsx  (Error Log & Analytics)
```

> **Tuyệt đối không chồng chéo (Zero Overlap):**
> 4 agent có thể nhận 4 branch độc lập:
> `feat/epic-1-dictation-hotkeys`  
> `feat/epic-2-vocab-collector`  
> `feat/epic-3-graded-essay-feedback`  
> `feat/epic-4-error-log-analytics`  
> Merge về `main` mà không xảy ra bất kỳ xung đột file (0 Git conflicts).

---

## ✅ 5. Quy chuẩn nghiệm thu (Definition of Done)

1. **Kiểm tra biên dịch**: Chạy `pnpm type-check; pnpm lint; pnpm build` đạt **0 errors, 0 warnings**.
2. **Zero Pixel Shift (0px Shift)**: Mọi tương tác tab, tooltip, dropdown không làm dịch chuyển vị trí văn bản.
3. **Tương thích Mobile & Desktop**: Mọi màn hình responsive trơn tru trên cả màn hình nhỏ (375px) lẫn màn hình lớn (1920px).
4. **Cập nhật tài liệu**: Đăng ký các component dùng chung mới vào `docs/ARCHITECTURE.md`.
