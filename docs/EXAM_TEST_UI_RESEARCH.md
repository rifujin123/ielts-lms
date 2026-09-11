# Nghiên Cứu Kiến Trúc UI/UX & Frontend Cho Hệ Thống Thi Trực Tuyến (CBT Engine)

> **Tài liệu tham chiếu kỹ thuật chuyên sâu**  
> **Dự án**: IELTS Hồ Thành LMS  
> **Phiên bản**: 1.0.0 — Tháng 09/2026  
> **Mục tiêu**: Thiết kế kiến trúc module thi trực tuyến (Computer-Based Test) đa định dạng, đáp ứng chuẩn quốc tế (IELTS) và chuẩn quốc gia (Toán THPTQG 2025+, ĐGNL HSA/HCM/TSA).

---

## MỤC LỤC

1. [Tổng Quan & Đặt Vấn Đề](#1-tổng-quan--đặt-vấn-đề)
2. [Khảo Sát Khung Đánh Giá & Thư Viện Mã Nguồn Mở (QTI & Quiz Engines)](#2-khảo-sát-khung-đánh-giá--thư-viện-mã-nguồn-mở-qti--quiz-engines)
3. [Phân Tích Khối Xây Dựng Thành Phần (Component Building Blocks)](#3-phân-tích-khối-xây-dựng-thành-phần-component-building-blocks)
   - 3.1. Split-View Engine (Chia đôi màn hình độc lập)
   - 3.2. Math & Science Rendering (KaTeX, MathLive, Canvas/SVG)
   - 3.3. Text Highlighting & Annotation Subsystem (Bôi vàng & Ghi chú bài đọc)
   - 3.4. Audio Engine & Listening Test Controller
   - 3.5. Scratchpad (Bảng nháp ảo tương tác)
4. [Benchmark Các Nền Tảng Hàng Đầu (IELTS, THPTQG & ĐGNL)](#4-benchmark-các-nền-tảng-hàng-đầu-ielts-thptqg--đgnl)
5. [Cấu Trúc Dữ Liệu Đề Thi Hợp Nhất (Universal CBT JSON Schema)](#5-cấu-trúc-dữ-liệu-đề-thi-hợp-nhất-universal-cbt-json-schema)
6. [Đề Xuất Kiến Trúc Component (React 18 + Tailwind CSS)](#6-đề-xuất-kiến-trúc-component-react-18--tailwind-css)
7. [Mô Hình Quản Lý State, Auto-Save & Khả Năng Chống Mất Dữ Liệu](#7-mô-hình-quản-lý-state-auto-save--khả-năng-chống-mất-dữ-liệu)
8. [Bảo Mật Phòng Thi & Giám Sát Gian Lận (Anti-Cheat / Exam Integrity)](#8-bảo-mật-phòng-thi--giám-sát-gian-lận-anti-cheat--exam-integrity)
9. [Lộ Trình Triển Khai Khả Thi (Implementation Roadmap)](#9-lộ-trình-triển-khai-khả-thi-implementation-roadmap)

---

## 1. Tổng Quan & Đặt Vấn Đề

Hệ thống LMS của IELTS Hồ Thành đang mở rộng từ cổng học tập và làm bài tập cơ bản sang nền tảng khảo thí trực tuyến (Computer-Based Testing - CBT) toàn diện. Hệ thống cần xử lý đồng thời 3 bài toán khảo thí với các đặc thù UX hoàn toàn khác biệt:

1. **IELTS Online Exam (Academic & General Training)**:
   - **Giao diện Dual-Pane Split Layout**: Đoạn văn Reading cuộn độc lập bên trái, hệ thống câu hỏi bên phải. Tùy biến kích thước pane kéo thả mượt mà không gây giật layout (0px shift).
   - **Đa dạng dạng câu hỏi phức tạp**: Multiple Choice, Fill-in-the-blank (Cloze), Matching Headings/Information (Kéo thả hoặc dropdown), True/False/Not Given, Yes/No/Not Given, Map/Diagram labeling.
   - **Bộ công cụ thi chuyên biệt**: Text Highlighter (đánh dấu vàng/xanh), Notes (ghi chú nổi tại vị trí bôi đen), Question Palette (ma trận 40 câu hỏi thể hiện trạng thái: Đã làm / Chưa làm / Đánh dấu xem lại - Flagged), Section Switcher, Audio Player đơn lượt (không cho phép tua trong chế độ thi thật).
2. **Đề thi Toán THPT Quốc Gia (Format 2025+ GDPT 2018)**:
   - **Công thức Toán học chuẩn mực**: Hiển thị mượt mà biểu thức phức tạp, tích phân, ma trận, hình học tọa độ vector không gian $Oxyz$ bằng KaTeX siêu tốc.
   - **3 Phần thi chuẩn cấu trúc Bộ GD&ĐT**:
     - _Phần I_: 12 câu trắc nghiệm 4 lựa chọn (Chọn 1 đáp án, 0.25đ/câu).
     - _Phần II_: 4 câu trắc nghiệm Đúng / Sai. Mỗi câu gồm 4 lệnh hỏi a, b, c, d với quy tắc tính điểm lũy tiến bậc thang (Đúng 1 ý = 0.1đ; 2 ý = 0.25đ; 3 ý = 0.5đ; 4 ý = 1.0đ).
     - _Phần III_: 6 câu trắc nghiệm trả lời ngắn (Điền số thực, phân số, số âm tương tự tô phiếu thi THPTQG, 0.5đ/câu).
   - **Bảng vẽ nháp ảo (Scratchpad Canvas)**: Cho phép thí sinh vẽ nháp, biến đổi phương trình ngay trên màn hình khi dùng máy tính bảng hoặc laptop.
3. **Đề thi Đánh giá Năng lực (ĐGNL - HSA ĐHQGHN, ĐHQG-HCM, TSA ĐHBK Hà Nội)**:
   - **Cấu trúc liên môn đa phần (Multi-disciplinary Sectioned Test)**: Định lượng (Toán), Định tính (Văn học - Ngôn ngữ), Khoa học / Giải quyết vấn đề.
   - **Cơ chế Khóa phần thi (Section Time-Lock)**: Mỗi phần có đồng hồ đếm ngược riêng; khi hết giờ phần nào sẽ tự động nộp và **khóa cứng vĩnh viễn** phần đó, chuyển sang phần tiếp theo mà không được phép quay lại (Đặc thù đề HSA ĐHQG Hà Nội).
   - **Ma trận điều hướng lớn**: Từ 120 đến 150 câu hỏi, hỗ trợ lọc nhanh câu chưa làm và gắn cờ rà soát trước khi đóng phần.

---

## 2. Khảo Sát Khung Đánh Giá & Thư Viện Mã Nguồn Mở (QTI & Quiz Engines)

Khi xây dựng engine khảo thí, câu hỏi lớn đầu tiên là: **Nên sử dụng chuẩn QTI (Question & Test Interoperability) mã nguồn mở hay tự thiết kế kiến trúc Component dựa trên JSON Schema riêng?**

### 2.1. Phân Tích Chuẩn IMS QTI (QTI 2.x & QTI 3.0)

IMS QTI là chuẩn quốc tế định nghĩa đề thi bằng XML (tương thích giữa các hệ thống LMS lớn như Canvas, Blackboard, Moodle).

| Tiêu chí                            | Khung chuẩn QTI (XML-based)                                                                                                      | Custom JSON Assessment Engine (React-native)                                         |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **Định dạng dữ liệu**               | XML phức tạp, nhiều thẻ lồng nhau (`<itemBody>`, `<responseDeclaration>`, `<outcomeDeclaration>`).                               | JSON tinh gọn, tương thích 100% với TypeScript interface và REST/GraphQL API.        |
| **Styling & Custom UI**             | Rất khó can thiệp styling; giao diện mặc định cũ kỹ, xung đột nặng nề với Tailwind CSS do bị cô lập bằng Shadow DOM hoặc iframe. | Tự do 100% với Tailwind CSS, shadcn/ui, Radix Primitives và Design Tokens của dự án. |
| **Xử lý câu hỏi đặc thù Việt Nam**  | Không hỗ trợ nguyên bản cơ chế chấm lũy tiến Đúng/Sai 4 ý (Phần II THPTQG) và format tô số Phần III.                             | Dễ dàng tùy biến logic chấm điểm và tương tác trong React hooks.                     |
| **Kích thước Bundle & Tốc độ**      | Nặng nề do phải kèm theo parser XML và validator engine.                                                                         | Nhẹ, tree-shakable, load trang dưới 1.5 giây.                                        |
| **Trải nghiệm nhà phát triển (DX)** | Dốc, tài liệu phân mảnh, debug phức tạp.                                                                                         | Tuyệt vời, component hóa dạng React thông thường.                                    |

### 2.2. Đánh Giá Các Dự Án Mã Nguồn Mở Nổi Bật

1. **PIE Framework (Portable Interactions and Elements)**:
   - _Bản chất_: Nền tảng mở do cộng đồng EdTech Mỹ phát triển, sử dụng Web Components bọc ngoài JSON data, hỗ trợ hơn 20 loại câu hỏi tương tác (graphing, drag-and-drop, math entry).
   - _Ưu điểm_: Tách biệt rõ ràng giữa View và Controller bảo mật chấm điểm máy chủ; có công cụ chuyển đổi sang QTI.
   - _Hạn chế_: Shadow DOM gây khó khăn khi muốn áp dụng các animation token (`animate-fade-in-up`, `card-interactive`) và Tailwind class từ dự án IELTS LMS.
2. **qti-3-player (Agency Enterprise) & Longsight QTI 3 Player**:
   - _Bản chất_: Engine QTI 3.0 hiện đại viết bằng TypeScript, cung cấp wrapper cho React (`@ae-studio/qti-react`).
   - _Đánh giá_: Phù hợp nếu dự án bắt buộc phải nhập đề thi từ ngân hàng đề QTI xuất khẩu từ Canvas/Moodle. Tuy nhiên, việc mô phỏng giao diện IDP/BC IELTS (với Dual-Pane Resizable, Text Highlighter, Question Palette chân trang) qua wrapper QTI đòi hỏi override DOM rất gượng ép.
3. **Learnosity Architecture Analysis (Mô hình tham chiếu vàng)**:
   - Mặc dù Learnosity là giải pháp thương mại độc quyền doanh nghiệp đắt đỏ ($10k+/năm), kiến trúc module hóa của họ là **chuẩn mực kiến trúc tốt nhất thế giới**:
     - `Items API`: Điều phối tổng thể luồng làm bài, phân trang, timer và thanh điều hướng.
     - `Questions API`: Render từng loại câu hỏi độc lập dưới dạng stateless components.
     - `Assess API`: Lớp bảo mật phòng thi, ghi nhận tương tác, chấm điểm máy chủ và phục hồi sự cố rớt mạng.
   - **Kết luận kiến trúc**: IELTS Hồ Thành LMS nên **học tập kiến trúc phân lớp của Learnosity**, nhưng triển khai native bằng **React 18 + TypeScript + Tailwind CSS + Zustand**.

---

## 3. Phân Tích Khối Xây Dựng Thành Phần (Component Building Blocks)

### 3.1. Split-View Engine (Chia Đôi Màn Hình Độc Lập)

IELTS Reading bắt buộc phải có màn hình chia đôi: Bên trái là bài đọc (Passage) dài 700-900 từ, bên phải là danh sách câu hỏi. Cả hai pane phải có khả năng cuộn độc lập và người dùng có thể kéo thanh chia (splitter/resizer) để mở rộng bài đọc hoặc câu hỏi.

#### So sánh các thư viện:

- `react-split`: Dựa trên `split.js` từ 2017, can thiệp trực tiếp vào inline style của DOM, dễ gây giật khung hình và lỗi hydration khi kết hợp với React 18.
- `allotment`: Lấy cảm hứng từ VS Code split pane, tính năng phong phú nhưng phụ thuộc CSS-in-JS và kích thước bundle tương đối lớn.
- **`react-resizable-panels` (Lựa chọn tối ưu nhất)**:
  - Tác giả: Brian Vaughn (cựu kỹ sư core React, tác giả React DevTools & react-virtualized).
  - Được tích hợp chính thức trong **shadcn/ui Resizable**.
  - Không gây Layout Shift (0px shift), hỗ trợ Touch screen trên iPad/Tablet mượt mà.
  - Hỗ trợ lưu vị trí kéo vào `localStorage` qua thuộc tính `autoSaveId`.
  - Hỗ trợ đầy đủ phím mũi tên bàn phím cho tiêu chuẩn Accessibility (a11y).

```tsx
// Ví dụ triển khai Split Pane chuẩn mực cho IELTS Reading
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

export const ExamSplitLayout: React.FC<{
  passageNode: React.ReactNode
  questionNode: React.ReactNode
}> = ({ passageNode, questionNode }) => (
  <PanelGroup
    direction="horizontal"
    autoSaveId="ielts-reading-split"
    className="h-[calc(100vh-130px)] w-full"
  >
    <Panel defaultSize={48} minSize={30} className="custom-scrollbar overflow-y-auto pr-2">
      {passageNode}
    </Panel>
    <PanelResizeHandle className="group relative flex w-2 items-center justify-center bg-transparent transition-colors hover:bg-primary/20">
      <div className="h-10 w-1 rounded-full bg-outline-variant group-hover:bg-primary transition-colors" />
    </PanelResizeHandle>
    <Panel defaultSize={52} minSize={35} className="custom-scrollbar overflow-y-auto pl-2">
      {questionNode}
    </Panel>
  </PanelGroup>
)
```

---

### 3.2. Math & Science Rendering (KaTeX, MathLive, Canvas/SVG)

Đề thi Toán THPTQG 2025 và phần Định lượng ĐGNL yêu cầu hiển thị mật độ dày đặc các công thức giải tích, hình học không gian và đồ thị hàm số.

#### 1. Hiển thị công thức (Static Math Rendering): KaTeX vs MathJax

- **KaTeX (Lựa chọn dứt khoát)**:
  - Tốc độ render nhanh gấp 10-100 lần MathJax nhờ biên dịch trực tiếp sang HTML/CSS mà không cần reflow DOM nhiều lần.
  - Tích hợp hoàn hảo qua thư viện nhẹ `katex` kết hợp hook bọc `useMemo` hoặc regex tự động nhận diện ký tự `$...$` (inline) và `$$...$$` (block).
  - Tương thích tốt với tiếng Việt trong công thức (ví dụ nhãn $A_{\text{tiếp tuyến}}$).

#### 2. Nhập công thức & Điền số Phần III (Interactive Math Input):

- Đối với Phần III THPTQG (Điền số thực, phân số tối giản, số âm): Sử dụng **Masked Input** hoặc **Virtual Numeric Keypad** với các phím giới hạn `[0-9]`, dấu âm `-`, dấu thập phân `,` hoặc `/`.
- Đối với đề thi tự luận nâng cao hoặc ĐGNL có yêu cầu gõ biểu thức đại số: Sử dụng Web Component **`mathlive`** (từ CortexJS), cung cấp bàn phím ảo toán học trực quan trên di động/máy tính bảng, xuất dữ liệu dạng chuẩn LaTeX hoặc MathJSON.

#### 3. Hình học & Đồ thị hàm số:

- **Khuyến nghị chuẩn**: Render đồ thị dưới dạng **vector SVG** từ hệ thống soạn đề (hỗ trợ responsive tuyệt đối, sắc nét trên màn hình Retina, không bị vỡ hạt như JPG/PNG).

---

### 3.3. Text Highlighting & Annotation Subsystem (Bôi Vàng & Ghi Chú)

Trong bài thi IELTS Reading, tính năng bôi vàng đoạn văn (Highlight) và ghi chú (Notes) là chức năng sống còn, chiếm 40% trải nghiệm của thí sinh.

#### Kiến trúc Highlighting:

- **Thư viện đề xuất**: `web-highlighter` (tác giả alienzhou).
- **Nguyên lý hoạt động**:
  1. Lắng nghe sự kiện `selectionchange` / `mouseup` trên vùng chứa bài đọc (`#reading-passage`).
  2. Hiển thị thanh công cụ nổi (Floating Popover) sát vị trí bôi đen:
     - Nút Highlight (Vàng `#FEF08A` / Xanh `#BAE6FD`).
     - Nút Thêm ghi chú (Note).
     - Nút Xóa đánh dấu (Clear).
  3. Tuần tự hóa vị trí bôi đen (Serialization) thành cấu trúc JSON lưu trữ:
     ```json
     {
       "id": "hl_9a8b7c",
       "passageId": "p1",
       "startMeta": { "parentIndex": 2, "offset": 14 },
       "endMeta": { "parentIndex": 2, "offset": 58 },
       "text": "hippocampal grid cell network",
       "color": "yellow",
       "note": "Keyword câu 15"
     }
     ```
  4. Phục hồi nguyên vẹn các thẻ `<mark class="ielts-highlight">` khi học viên tải lại trang hoặc chuyển đổi giữa các Passage.

---

### 3.4. Audio Engine & Listening Test Controller

Đề thi IELTS Listening đòi hỏi cơ chế kiểm soát âm thanh khắt khe:

1. **Hai chế độ phát âm thanh (Audio Modes)**:
   - **Chế độ Thi Thử Chuẩn (Exam Mode - Chuẩn IDP/BC)**:
     - File audio phát **duy nhất 1 lần từ đầu đến cuối**.
     - Khóa cứng toàn bộ thanh tua (Seek bar bị ẩn hoặc disabled).
     - Không có nút Tạm dừng (Pause). Thí sinh chỉ được điều chỉnh âm lượng (Volume slider).
     - Tự động chuyển Section và chuyển đếm ngược thời gian kiểm tra bài (Check time 2 phút cuối).
   - **Chế độ Luyện Tập (Practice Mode)**:
     - Mở đầy đủ Scrubber/Timeline, cho phép tua lùi 5s, chỉnh tốc độ phát (0.75x, 1x, 1.25x), hiển thị Audio Waveform hoặc Transcript có đồng bộ mốc thời gian (Timestamps).
2. **Lựa chọn kỹ thuật**:
   - Sử dụng **HTML5 `<audio>` Native API** kết hợp React hook quản lý trạng thái, **tránh dùng các thư viện nặng như `wavesurfer.js` trong chế độ thi thật** (do `wavesurfer.js` phải decode toàn bộ tệp MP3 dài 30-40 phút vào bộ nhớ RAM, gây lag và đơ tab trên các dòng máy tính cấu hình yếu).

---

### 3.5. Scratchpad (Bảng Nháp Ảo Tương Tác)

Phục vụ đặc thù tính toán đề thi Toán THPTQG và bài thi ĐGNL (Định lượng):

- Triển khai một Drawer hoặc Floating Modal sử dụng thẻ `<canvas>` HTML5 hoặc thư viện nhẹ như `fabric.js` / SVG Path tracking.
- Bộ công cụ gồm: Bút vẽ (Pen 3 kích cỡ nét), Tẩy (Eraser), Xóa sạch (Clear All), Đổi màu mực (Đen/Xanh/Đỏ), Hoàn tác (Undo/Redo).
- Lưu bản nháp cục bộ theo từng câu hỏi vào `sessionStorage` để học viên mở lại xem lại bước giải nháp của chính mình.

---

## 4. Benchmark Các Nền Tảng Hàng Đầu (IELTS, THPTQG & ĐGNL)

### 4.1. Khảo Sát Nền Tảng Luyện Thi IELTS

| Nền tảng                                   | Điểm mạnh UI/UX đáng học hỏi                                                                                                                                                                                               | Hạn chế / Điểm cần cải tiến                                                                                         |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Cambridge Official / IDP / BC CD IELTS** | Giao diện chuẩn khảo thí quốc tế: Tối giản tối đa, có chế độ tương phản cao (Black on White, White on Black, Yellow on Black), font size A/A+/A++, điều hướng 40 câu hỏi chân trang cố định, nút Review và Help chuẩn mực. | Trải nghiệm đồ họa cổ điển, thiếu các phân tích giải thích tương tác sau khi nộp bài.                               |
| **Prep.vn**                                | Split view bài đọc mượt mà, phân loại câu hỏi rõ ràng, giao diện chấm chữa AI và hiển thị transcript có highlight từ khóa dẫn chứng.                                                                                       | Thanh điều hướng câu hỏi đôi khi bị che khuất trên màn hình laptop nhỏ (13 inch).                                   |
| **DOL.vn (IELTS Đình Lực)**                | Tích hợp sâu phương pháp **Linearthinking**: hiển thị cấu trúc câu, liên kết ý, sơ đồ tư duy phân tích đoạn văn cực kỳ trực quan; công cụ tra từ vựng ngay trong ngữ cảnh.                                                 | Chế độ thi thử đôi khi chứa nhiều yếu tố đồ họa giảng dạy, làm giảm tính "căng thẳng chân thực" của phòng thi thật. |
| **Study4**                                 | Tốc độ tải đề cực nhanh, thanh Question Palette linh hoạt bên góc phải hoặc đáy, cộng đồng thảo luận từng câu hỏi sôi động, đồng bộ timestamp âm thanh chuẩn xác.                                                          | Giao diện nhiều banner và quảng cáo bên ngoài, cần tinh gọn khi chuyển sang chế độ tập trung làm bài (Focus Mode).  |
| **IELTS Online Tests (IOT)**               | Gần như mô phỏng 95% layout thi IDP máy tính thực tế, hỗ trợ drag-and-drop cho Matching Headings.                                                                                                                          | Hệ thống cũ hay gặp lỗi giật khi drag drop trên trình duyệt Safari hoặc màn hình cảm ứng.                           |

### 4.2. Khảo Sát Nền Tảng Khảo Thí THPTQG & ĐGNL

| Nền tảng                             | Đặc trưng UI/UX khảo thí                                                                                                                             | Cơ chế kỹ thuật nhận diện                                                                                        |
| :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **Azota**                            | Khả năng chịu tải đồng thời hàng trăm nghìn học sinh; phát hiện chuyển tab / thoát toàn màn hình cực nhạy; hỗ trợ nộp ảnh bài tự luận.               | Phù hợp kiểm tra trường học, nhưng giao diện câu hỏi Toán học chưa đạt độ thẩm mỹ cao về typography công thức.   |
| **HSA ThiOnline (Cổng ĐGNL ĐHQGHN)** | Cơ chế khóa cứng phân môn (Section Time-Lock); hết 75 phút phần 1 tự động chuyển phần 2, không thể quay lại sửa đáp án; ma trận câu hỏi 50 câu/phần. | Giao diện mang tính hành chính khảo thí nhà nước, cần hiện đại hóa trải nghiệm người dùng trên các thiết bị mới. |
| **OLM.vn**                           | Trình soạn thảo công thức Toán học tích hợp phong phú; học sinh có thể click chọn ký hiệu phân số, căn bậc hai nhanh chóng.                          | UI hơi hướng tiểu học/THCS, cần nâng tầm học thuật sang trọng cho học viên IELTS & THPT lớn tuổi.                |

---

## 5. Cấu Trúc Dữ Liệu Đề Thi Hợp Nhất (Universal CBT JSON Schema)

Để đáp ứng cả 3 kỳ thi trong cùng một hệ thống mà không phải viết lại code render cho từng môn, chúng tôi thiết kế **Universal Assessment Item Schema** chuẩn TypeScript:

```typescript
// ── Định danh loại kỳ thi & loại câu hỏi ──────────────────────────
export type ExamFormatType =
  'IELTS_READING' | 'IELTS_LISTENING' | 'IELTS_WRITING' | 'THPTQG_MATH' | 'DGNL_HSA'

export type QuestionType =
  | 'MULTIPLE_CHOICE' // Trắc nghiệm 1 đáp án (IELTS, THPTQG Phần I, ĐGNL)
  | 'MULTIPLE_RESPONSE' // Chọn nhiều đáp án (IELTS "Choose TWO letters")
  | 'TRUE_FALSE_NOT_GIVEN' // TFNG / YNNG (IELTS)
  | 'FILL_IN_BLANK' // Điền từ vào chỗ trống / Cloze (IELTS)
  | 'MATCHING_HEADINGS' // Nối tiêu đề / Kéo thả (IELTS)
  | 'MATCHING_FEATURES' // Ghép nối thông tin (IELTS)
  | 'TRUE_FALSE_GROUP' // Đúng/Sai 4 ý a, b, c, d tính điểm bậc thang (THPTQG Phần II)
  | 'SHORT_NUMERICAL' // Điền số thực / kết quả ngắn (THPTQG Phần III, HSA)
  | 'ESSAY' // Tự luận viết (IELTS Writing Task 1, 2)

// ── Cấu trúc Đề thi tổng thể ──────────────────────────────────────
export interface ExamSessionManifest {
  id: string
  title: string
  format: ExamFormatType
  totalDurationMinutes: number
  hasSectionTimeLock: boolean // true với ĐGNL HSA, false với IELTS/THPTQG
  sections: ExamSection[]
}

export interface ExamSection {
  id: string
  title: string // e.g., "Passage 1", "Phần I: Trắc nghiệm 4 lựa chọn", "Tư duy định lượng"
  durationMinutes?: number // Áp dụng khi có section time-lock
  passageContentHtml?: string // Nội dung bài đọc (cho IELTS Reading hoặc Đọc hiểu ĐGNL)
  audioUrl?: string // Audio file (cho IELTS Listening)
  questions: ExamQuestionItem[]
}

// ── Cấu trúc Câu hỏi linh hoạt ────────────────────────────────────
export interface ExamQuestionItem {
  id: string
  orderNumber: number // Thứ tự hiển thị (1 đến 40 hoặc 1 đến 50)
  type: QuestionType
  promptHtml: string // Đề bài có hỗ trợ công thức LaTeX ($...$) và ảnh SVG
  explanationHtml?: string // Lời giải chi tiết (hiển thị khi xem lại kết quả)

  // Dành cho MULTIPLE_CHOICE, MULTIPLE_RESPONSE
  options?: {
    key: string // 'A', 'B', 'C', 'D'
    contentHtml: string // Hỗ trợ KaTeX
  }[]

  // Dành cho TRUE_FALSE_GROUP (Phần II THPTQG 2025)
  subQuestions?: {
    key: 'a' | 'b' | 'c' | 'd'
    statementHtml: string
    correctAnswer?: boolean
  }[]

  // Dành cho MATCHING_HEADINGS
  matchingPool?: {
    id: string
    text: string // e.g. "i. The role of hippocampal cells"
  }[]

  // Metadata cấu hình chấm điểm
  scoring: {
    maxScore: number
    rule: 'ALL_OR_NOTHING' | 'PARTIAL_LADDER_THPTQG' | 'PER_SUBQUESTION'
  }
}
```

---

## 6. Đề Xuất Kiến Trúc Component (React 18 + Tailwind CSS)

Hệ thống được tổ chức theo kiến trúc phân tầng Component rõ rệt, tương thích 100% với cấu trúc thư mục hiện tại của `ielts-lms`:

```
src/features/exam-runner/
├── index.tsx                         ← Route entry point (/exam/:id)
├── types/                            ← Universal CBT TypeScript interfaces
│   └── exam.types.ts
├── store/                            ← Zustand exam state manager
│   └── examSessionStore.ts
├── hooks/                            ← Custom CBT logic hooks
│   ├── useExamTimer.ts               ← Quản lý đếm ngược & Section Time-Lock
│   ├── useAudioController.ts         ← Điều khiển âm thanh đơn lượt / luyện tập
│   ├── useTextHighlighter.ts         ← Tương tác bôi vàng & ghi chú bài đọc
│   ├── useAutoSave.ts                ← Đồng bộ IndexedDB & Server debounced sync
│   └── useAntiCheatMonitor.ts        ← Giám sát thoát fullscreen / chuyển tab
├── layouts/
│   ├── ExamHeaderBar.tsx             ← Thanh tiêu đề, đồng hồ, nút nộp bài, theme switch
│   ├── DualPaneLayout.tsx            ← react-resizable-panels cho IELTS Reading / Writing
│   ├── SingleColumnLayout.tsx        ← Bố cục 1 cột cho Toán THPTQG & ĐGNL
│   └── ExamBottomPalette.tsx         ← Ma trận câu hỏi cố định chân trang (IDP style)
└── components/
    ├── QuestionFactory.tsx           ← Dispatcher component render loại câu hỏi phù hợp
    ├── renderers/
    │   ├── MultipleChoiceCard.tsx    ← Render trắc nghiệm 4 lựa chọn (Phần I)
    │   ├── TrueFalseGroupCard.tsx    ← Render Đúng/Sai 4 ý bậc thang (Phần II THPTQG)
    │   ├── ShortAnswerCard.tsx       ← Render điền số / bàn phím số ảo (Phần III THPTQG)
    │   ├── FillInBlankInline.tsx     ← Render ô điền từ khuyết trực tiếp trong đoạn văn
    │   ├── MatchingHeadingsCard.tsx  ← Kéo thả tiêu đề bài đọc IELTS
    │   └── KaTeXRenderer.tsx         ← Thành phần bọc KaTeX tối ưu hóa memoization
    └── tools/
        ├── HighlighterPopover.tsx    ← Thanh công cụ nổi bôi vàng / ghi chú
        ├── ScratchpadModal.tsx       ← Bảng vẽ nháp tương tác Canvas
        ├── AudioPlayerWidget.tsx     ← Trình phát audio chuyên dụng
        └── SectionSwitchConfirmModal.tsx ← Modal xác nhận khóa phần thi ĐGNL
```

### Sơ Đồ Luồng Dữ Liệu & Tương Tác Của CBT Runner

```mermaid
flowchart TD
    A["API Server / Mock Engine"] -->|"Fetch Exam Manifest"| B["TanStack Query (useQuery)"]
    B -->|"Initialize Exam Data"| C["Zustand examSessionStore"]
    C <-->|"Zero-latency local sync"| D["IndexedDB (idb-keyval)"]

    subgraph CBT Shell ["CBT Shell Layout"]
        E["ExamHeaderBar (Timer, Status, Tools)"]
        F["QuestionFactory (Dynamic Dispatcher)"]
        G["ExamBottomPalette (Matrix Navigation)"]
    end

    C --> CBT Shell

    subgraph Question Renderers ["Question Renderers"]
        R1["MultipleChoiceCard (IELTS / THPTQG I)"]
        R2["TrueFalseGroupCard (THPTQG II 4-subitem)"]
        R3["ShortAnswerCard (THPTQG III Num-pad)"]
        R4["MatchingHeadingsCard (Drag & Drop)"]
    end

    F --> Question Renderers

    Question Renderers -->|"User Action (select / type)"| C
    C -->|"Debounced Sync (3s)"| H["Backend Auto-Save API"]

    subgraph Background Guards ["Background Guards"]
        G1["useExamTimer (Auto-submit / Section Lock)"]
        G2["useAntiCheatMonitor (Visibility / Fullscreen)"]
    end

    C <--> Background Guards
```

---

## 7. Mô Hình Quản Lý State, Auto-Save & Khả Năng Chống Mất Dữ Liệu

Mất bài làm khi rớt mạng, mất điện hoặc vô tình tắt tab là "ác mộng" tồi tệ nhất trong khảo thí trực tuyến. Chúng tôi thiết lập **Chiến Lược Bảo Vệ Dữ Liệu 3 Lớp (3-Tier Resilience Strategy)**:

### 7.1. Lớp 1: In-Memory UI State (Zustand)

- Cập nhật tức thì (0ms latency) khi thí sinh click chọn hoặc gõ phím.
- Ghi nhận trạng thái từng câu: `value` (nội dung trả lời), `isFlagged` (gắn cờ xem lại), `lastModified` (timestamp).

### 7.2. Lớp 2: Local Persistence (IndexedDB qua `idb-keyval`)

- Lưu toàn bộ câu trả lời, ghi chú bôi vàng và thời gian còn lại vào `IndexedDB` của trình duyệt ngay sau mỗi thao tác (thời gian ghi < 5ms, dung lượng lưu trữ lên tới hàng trăm MB, vượt trội so với mức trần 5MB của `localStorage`).
- Nếu học viên F5 hoặc mất điện đột ngột bật lại, hệ thống tự động khôi phục 100% hiện trạng bài làm mà không cần tải lại từ máy chủ.

### 7.3. Lớp 3: Debounced Server Sync & `navigator.sendBeacon`

- Tự động gom các thay đổi câu trả lời và gửi lên máy chủ qua Axios định kỳ mỗi **3 giây** (sử dụng debounce để không gây nghẽn mạng).
- Lắng nghe sự kiện `window.onbeforeunload` và `visibilitychange`: Sử dụng `navigator.sendBeacon('/api/exam/autosave', payload)` để gửi những thay đổi cuối cùng ngay cả khi người dùng bấm tắt cửa sổ trình duyệt.

---

## 8. Bảo Mật Phòng Thi & Giám Sát Gian Lận (Anti-Cheat / Exam Integrity)

Đối với các kỳ thi mô phỏng nghiêm túc (IELTS Mock Test chuẩn IDP hay ĐGNL):

1. **Khóa chế độ toàn màn hình (Fullscreen Enforcement)**:
   - Yêu cầu kích hoạt Fullscreen API khi bắt đầu bài thi.
   - Bắt sự kiện `fullscreenchange`. Nếu thí sinh thoát toàn màn hình, hiển thị modal cảnh báo che toàn bộ đề thi và đếm ngược 10 giây yêu cầu quay lại.
2. **Theo dõi chuyển tab / ứng dụng (`visibilitychange` & `blur`)**:
   - Ghi nhận số lần rời tab (`switchTabCount`).
   - Sau quá 3 lần cảnh báo, hệ thống có thể cấu hình tự động khóa bài thi và thu bài ngay lập tức.
3. **Chống sao chép & tra cứu ngoài (Clipboard & Context Menu Lock)**:
   - Vô hiệu hóa chuột phải (`contextmenu` event), chặn phím tắt Inspect (`F12`, `Ctrl+Shift+I`).
   - Chặn bôi đen sao chép văn bản bên ngoài vùng bài đọc cho phép (`user-select: none` trên các câu hỏi thi).

---

## 9. Lộ Trình Triển Khai Khả Thi (Implementation Roadmap)

| Giai đoạn                  | Hạng mục thực hiện                                                                                                                                      | Thời gian dự kiến | Đầu ra kiểm thử                                                                              |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------- | :------------------------------------------------------------------------------------------- |
| **P1: Nền tảng Core**      | Cài đặt `react-resizable-panels`, `katex`, `idb-keyval`. Xây dựng `examSessionStore` (Zustand), `ExamHeaderBar`, `ExamBottomPalette` (ma trận câu hỏi). | Tuần 1            | Khung giao diện CBT chuẩn, chuyển động 0px layout shift, lưu nháp IndexedDB mượt mà.         |
| **P2: IELTS CBT Engine**   | Hoàn thiện Split Layout, tích hợp `web-highlighter`, Audio Player khóa tua, Question Renderers (MCQ, Cloze, TFNG, Matching Headings).                   | Tuần 2            | Làm trọn vẹn bài thi Full IELTS Reading & Listening 40 câu tương tự IDP/BC.                  |
| **P3: Toán THPTQG 2025**   | Tích hợp KaTeX formula, phát triển renderer Đúng/Sai 4 ý (Phần II - tính điểm bậc thang), Virtual Number Pad (Phần III), Scratchpad vẽ nháp Canvas.     | Tuần 3            | Giải đề minh họa Toán THPTQG 2025 mượt mà, công thức sắc nét, chấm điểm bậc thang chính xác. |
| **P4: ĐGNL Multi-Section** | Xây dựng cơ chế Section Time-Lock (khóa cứng phần thi hết giờ), điều hướng liên môn 150 câu hỏi, giám sát Fullscreen / chuyển tab.                      | Tuần 4            | Hoàn tất đề thi ĐGNL HSA ĐHQG Hà Nội với quy trình chuyển phần thi bất khả đảo ngược.        |

---

_Tài liệu được soạn thảo bởi Chuyên gia Kiến trúc UI/UX & Frontend Khảo thí — IELTS Hồ Thành LMS._
