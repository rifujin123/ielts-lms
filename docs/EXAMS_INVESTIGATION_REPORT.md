# Báo Cáo Khảo Sát & Phân Tích Thực Tế 3 Bộ Đề Thi Của Trung Tâm Hồ Thành

> **Tài liệu phân tích kỹ thuật đề thi thực chiến**  
> **Nguồn dữ liệu khảo sát**: Thư mục `/exams/`  
> **Đơn vị phát hành**: Team Toán Hồ Thành, Team ĐGNL Hồ Thành, IELTS Hồ Thành  
> **Mục tiêu**: Xây dựng 3 cổng thi trực tuyến (Online Exam Portals) chuyên biệt hóa cao độ cho từng phân hệ khảo thí.

---

## 1. TỔNG HỢP CÁC TỆP ĐỀ THI ĐƯỢC KHẢO SÁT

| Tên tệp trong `/exams/`                          | Đơn vị & Kì thi                                                | Số lượng câu & Thời gian           | Đặc thù cấu trúc                                                                                                                                                                                                                                         |
| :----------------------------------------------- | :------------------------------------------------------------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `017. [ĐỀ - BĐA - QR] ĐỀ THỰC CHIẾN SỐ 017.docx` | **Team Toán Hồ Thành**<br>Đề Thực Chiến Môn Toán 2026          | **22 câu** (3 phần)<br>**90 phút** | Chuẩn cấu trúc mới Bộ GD&ĐT 2025+:<br>• Phần I: 12 câu trắc nghiệm 4 lựa chọn.<br>• Phần II: 4 câu Đúng/Sai (mỗi câu 4 ý a,b,c,d; tính điểm bậc thang).<br>• Phần III: 6 câu điền số ngắn.<br>Có 13 hình vẽ đồ thị, hình học Oxyz và bảng đáp án.        |
| `23. ĐỀ TỰ LUYỆN ĐGNL - LẦN 23.docx`             | **Team ĐGNL Hồ Thành**<br>Đề Tự Luyện Kỳ Thi V-ACT 2026 (ĐHQG) | **120 câu**<br>**150 phút**        | Cấu trúc chuẩn ĐGNL V-ACT ĐHQG TP.HCM / HSA:<br>• Phần 1: Ngôn ngữ (30 Tiếng Việt + 30 Tiếng Anh).<br>• Phần 2: Toán học (30 câu).<br>• Phần 3: Tư duy khoa học (12 câu Logic/Số liệu + 18 câu Suy luận).<br>Có 13 hình minh họa và bảng đáp án 120 câu. |
| `[ĐỀ THI THỬ SỐ 3] _ [ 02] _ TIẾNG ANH..docx`    | **Phần 1: Ngôn ngữ — Tiếng Anh**                               | **30 câu** (Câu 31 - 60)           | Bài đọc hiểu công nghệ/xã hội chuyên sâu (AI slop, parasocial, digital nihilism), trắc nghiệm ngữ pháp/từ vựng và hướng dẫn giải chi tiết.                                                                                                               |

---

## 2. PHÂN TÍCH CHI TIẾT CỔNG THI 1: TOÁN THPT QUỐC GIA (TEAM TOÁN HỒ THÀNH)

### 2.1. Cấu Trúc Đề & Quy Tắc Tính Điểm

- **Thời gian làm bài**: 90 phút (đồng hồ đếm ngược có cảnh báo 15 phút, 5 phút).
- **Phần I (12 câu - Trắc nghiệm 4 lựa chọn)**:
  - Chọn 1 trong 4 phương án A, B, C, D.
  - Điểm: **0.25 điểm / câu** (Tối đa 3.0 điểm).
- **Phần II (4 câu - Trắc nghiệm Đúng / Sai)**:
  - Mỗi câu gồm một giả thiết chính và **4 phát biểu a), b), c), d)**.
  - Thí sinh phải chọn `Đúng` hoặc `Sai` cho từng phát biểu.
  - **Quy tắc chấm điểm lũy tiến bậc thang**:
    - Đúng 1 ý: **0.1 điểm**
    - Đúng 2 ý: **0.25 điểm**
    - Đúng 3 ý: **0.50 điểm**
    - Đúng 4 ý: **1.00 điểm** (Tối đa 4.0 điểm cho 4 câu).
- **Phần III (6 câu - Trắc nghiệm trả lời ngắn)**:
  - Thí sinh tự tính toán và nhập đáp án là một số thực, số nguyên, phân số hoặc số âm (ví dụ đề 017: `22,5`; `1010`; `0,43`; `297`; `1300`; `3721`).
  - Điểm: **0.5 điểm / câu** (Tối đa 3.0 điểm).
  - Tổng điểm toàn bài: **10.0 điểm**.

### 2.2. Yêu Cầu UI/UX & Công Cụ Hỗ Trợ Riêng

1. **KaTeX Math Engine**:
   - Hiển thị sắc nét các biểu thức giải tích, vector $Oxyz$, tích phân $\int$, hàm số $f'(x) = 1 - \frac{1}{x}$, xác suất, và ma trận.
2. **Interactive Scratchpad (Bảng nháp ảo Canvas)**:
   - Cho phép học sinh mở một tấm bảng nháp nổi (hoặc nửa dưới màn hình) để dùng bút cảm ứng/chuột vẽ nháp sơ bộ đồ thị hoặc biến đổi phương trình.
3. **Bàn phím số ảo (Virtual Numeric Keypad)**:
   - Hỗ trợ nhập liệu cho Phần III với các phím chuẩn: `0-9`, dấu phẩy `,`, dấu âm `-`, nút xóa `Delete` tương tự phiếu làm bài THPTQG.
4. **Hình học & Đồ thị Vector**:
   - Tối ưu hóa render hình lăng trụ, tứ diện, hệ trục tọa độ $Oxyz$ bằng SVG responsive sắc nét.

---

## 3. PHÂN TÍCH CHI TIẾT CỔNG THI 2: ĐÁNH GIÁ NĂNG LỰC (TEAM ĐGNL HỒ THÀNH - V-ACT)

### 3.1. Cấu Trúc Đề 120 Câu / 150 Phút

Bài thi ĐGNL Hồ Thành (chuẩn V-ACT ĐHQG TP.HCM và tương đương HSA ĐHQG Hà Nội) chia thành 3 phân môn lớn với 120 câu hỏi:

```
TỔNG THỂ ĐỀ THI ĐGNL (120 câu - 150 phút)
├── PHẦN 1: NGÔN NGỮ (60 câu | Câu 1 - 60)
│   ├── 1.1. Tiếng Việt (30 câu | Câu 1 - 30): Văn học, ngữ pháp, phong cách ngôn ngữ, đoạn trích thơ/văn xuôi
│   └── 1.2. Tiếng Anh (30 câu | Câu 31 - 60): Điền từ, tìm lỗi sai, đoạn văn đọc hiểu học thuật
│
├── PHẦN 2: TOÁN HỌC (30 câu | Câu 61 - 90)
│   └── Toán phổ thông, hình học, xác suất, ứng dụng thực tế
│
└── PHẦN 3: TƯ DUY KHOA HỌC (30 câu | Câu 91 - 120)
    ├── 1.1. Tư duy logic & Phân tích số liệu (12 câu | Câu 91 - 102): Biểu đồ tròn/cột, bài toán logic giả thiết
    └── 1.2. Suy luận khoa học (18 câu | Câu 103 - 120): Vật lý, Hóa học, Sinh học, Địa lý, Lịch sử
```

### 3.2. Yêu Cầu UI/UX & Công Cụ Hỗ Trợ Riêng

1. **Question Matrix Palette 120 câu**:
   - Thanh điều hướng câu hỏi lớn (1-120), phân thành 3 cụm tab tương ứng 3 phần thi.
   - Trạng thái trực quan: Màu xanh (Đã làm), Màu xám viền nét đứt (Chưa làm), Màu cam có biểu tượng cờ (Gắn cờ xem lại - Flagged).
2. **Bộ lọc trạng thái nhanh (Quick Filter)**:
   - Nút lọc: "Tất cả (120)" | "Chưa trả lời (X)" | "Đã gắn cờ (Y)". Giúp thí sinh không bị sót câu trong 10 phút cuối.
3. **Chế độ Section Lock (Tùy chọn)**:
   - Cấu hình linh hoạt: Cho phép làm tự do giữa các phần (chuẩn ĐHQG-HCM) HOẶC khóa cứng phần thi theo thời lượng (chuẩn HSA ĐHQGHN).

---

## 4. PHÂN TÍCH CHI TIẾT CỔNG THI 3: IELTS ONLINE TEST (IELTS HỒ THÀNH)

### 4.1. Cấu Trúc Đề Chuẩn Quốc Tế (Academic & General)

- **Reading**: 3 Passages (40 câu / 60 phút)
- **Listening**: 4 Sections (40 câu / 30 phút + 2 phút check)
- **Writing**: Task 1 (150 từ) & Task 2 (250 từ / 60 phút)
- **Speaking**: 3 Parts (Ghi âm trực tiếp hoặc video call)

### 4.2. Yêu Cầu UI/UX & Công Cụ Hỗ Trợ Riêng

1. **Dual-Pane Split Layout (react-resizable-panels)**:
   - Bài đọc cuộn độc lập bên trái, câu hỏi bên phải, kéo thả chia màn hình không giật layout.
2. **Text Highlighting & Floating Notes**:
   - Bôi vàng / xanh đoạn văn bài đọc, gắn ghi chú popover, lưu vết trong IndexedDB.
3. **Locked Audio Player (Listening)**:
   - Audio phát một lần từ đầu đến cuối, vô hiệu hóa thanh tua trong chế độ thi thật.
4. **Rich Question Types**:
   - Matching Headings (Drag & Drop), Fill-in-the-blank (Cloze inline), True/False/Not Given, Multiple Response.

---

## 5. ĐỀ XUẤT KIẾN TRÚC TỔ CHỨC DỰ ÁN CHO 3 SITES / PORTALS

Để đạt tính nhất quán về thương hiệu **Hồ Thành Education**, tối ưu tài nguyên và dễ dàng bảo trì, chúng tôi khuyến nghị triển khai theo mô hình **Multi-Portal Workspace Architecture**:

```
src/
├── portals/
│   ├── ielts/                        ← [Portal 1] IELTS CBT Online Test
│   │   ├── components/               (ReadingSplitView, AudioLockPlayer, Highlighting)
│   │   └── pages/IeltsExamPage.tsx
│   │
│   ├── thpt-math/                    ← [Portal 2] Toán THPT Quốc Gia
│   │   ├── components/               (TrueFalseGroup, ShortAnswerKeypad, ScratchpadCanvas, KaTeXView)
│   │   └── pages/ThptMathExamPage.tsx
│   │
│   └── dgnl/                         ← [Portal 3] Đánh Giá Năng Lực (V-ACT & HSA)
│       ├── components/               (MatrixNavigator120, SectionFilter, MultiSubjectReview)
│       └── pages/DgnlExamPage.tsx
│
├── core-cbt/                         ← NỀN TẢNG ENGINE DÙNG CHUNG
│   ├── store/examSessionStore.ts     (Quản lý trạng thái bài thi, đáp án, gắn cờ)
│   ├── persistence/idbStorage.ts     (IndexedDB auto-save chống mất bài khi rớt mạng)
│   ├── security/antiCheatGuard.ts    (Giám sát toàn màn hình, đếm số lần chuyển tab)
│   └── timer/useCbtTimer.ts          (Đồng hồ đếm ngược, tự động thu bài)
```

Tài liệu này đóng vai trò căn cứ kỹ thuật chính xác cho giai đoạn dựng UI & chuyển đổi dữ liệu đề thi thực tế.
