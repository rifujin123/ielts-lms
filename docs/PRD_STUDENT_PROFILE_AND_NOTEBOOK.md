---
title: 'PRD — Student Profile, Header User Dropdown & Personal Vocabulary Notebook'
status: approved
created: 2026-09-12
updated: 2026-09-12
author: 'Mary (BMad Business Analyst)'
stakeholders: 'IELTS Hồ Thành Academic Board, Student Experience Team & Engineering'
version: '1.0'
scope: 'Pure Frontend Implementation (Vite + React + Tailwind + Zustand + LocalStorage Persistence)'
---

# PRD — Student Profile, Header User Dropdown & Personal Vocabulary Notebook

## 1. Executive Summary & Strategic Rationale

### 1.1 Problem Statement

In the current IELTS Hồ Thành LMS portal:

1. **Lack of Account Management**: Clicking the student avatar in the top Header does nothing. Students have no dedicated screen (/profile) to inspect their account validity, manage contact details (phone number), change security credentials, or see their enrolled course and class details.
2. **Missing Personal Vocabulary Loop**: While teacher-curated vocabulary sets exist (/vocabulary), students have no bottom-up mechanism to collect, store, and review new or difficult words encountered during actual practice (Reading exams, Listening tests, Video Dictation, or teacher essay corrections).

### 1.2 The Solution

Deliver a coherent, high-retention student utility suite:

1. **Header Avatar Dropdown Menu**: A sleek, accessible dropdown from the user avatar containing:
   - Mini student card (Name, Student ID, Email, Active Status badge).
   - Quick link to **"Sổ từ vựng"** (/vocabulary?tab=personal).
   - Quick link to **"Tài khoản"** (/profile).
   - Action **"Đăng xuất"** with confirmation and toast feedback.
2. **Student Profile & Account Page (/profile)**:
   - **Account Info**: Full name, editable phone number (with Vietnam phone format validation), read-only email, and membership expiration badge with day countdown.
   - **Security**: Password change form (Current, New, Confirm, password strength meter, visibility toggle eye icon, validation rules).
   - **Enrolled Course & Class**: Detailed card showing active course, target band, class code, schedule, teacher/TA info, and session progress.
3. **Personal Vocabulary Notebook (/vocabulary Tab 2)**:
   - Unified tab switcher on /vocabulary:
     - **Tab 1: 📚 Khóa học (Teacher Curated Sets)**.
     - **Tab 2: 📓 Sổ từ của tôi (Personal Word Bank)**.
   - Word entry schema: Headword, phonetic IPA, native audio pronunciation (Web Speech API), Vietnamese definition, IELTS context sentence, source tag (#Reading, #Listening, #Dictation, #Writing, #Manual), collocations, personal note, and mastery status.
   - Quick Add modal (+ Thêm từ mới) with instant dictionary lookup suggestions.
   - Smart filters (by skill source, mastery status, search query).
   - Dedicated Flashcard study mode for personal words.
   - Persistent storage in browser localStorage + fallback mock dataset.

## 2. Information Architecture & Navigation Flow

\\\
[AppHeader]
└── Click User Avatar
├── Dropdown Menu
│ ├── Mini User Card (Name, ID, Email, Status)
│ ├── [Sổ từ vựng] ──> [/vocabulary?tab=personal]
│ ├── [Tài khoản] ──> [/profile]
│ └── [Đăng xuất] ──> Logout confirmation & toast
│
├── [/profile] (Student Profile Page)
│ ├── Section 1: Thông tin tài khoản (Phone editable, Status badge)
│ ├── Section 2: Bảo mật (Đổi mật khẩu)
│ └── Section 3: Gói học & Lớp học đang theo
│
└── [/vocabulary] (Unified Vocabulary Hub)
├── Tab 1: 📚 Bộ từ giáo trình (Teacher Topic Sets)
└── Tab 2: 📓 Sổ từ vựng của tôi (Personal Notebook)
\\\

## 3. Data Models & Contracts

- \StudentProfile\ (id, name, initials, phone, email, membershipStatus, expiryDate, remainingDays, enrolledCourse).
- \PersonalWordEntry\ (id, word, phonetic, partOfSpeech, meaningVi, contextSentence, sourceSkill, sourceReference, collocations, personalNote, masteryStatus, createdAt, updatedAt).
