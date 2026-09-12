import type { TeacherRubricAssessment } from '../types/fullExam.types'

/**
 * Realistic Mock Teacher Evaluation Rubric for demonstration & offline mode.
 * Separated cleanly from presentation components and scoring utilities
 * so it can be swapped 1:1 with real API responses from the backend.
 */
export const mockTeacherAssessment: TeacherRubricAssessment = {
  teacherId: 'TCH-082',
  teacherName: 'Thầy Hồ Thành (8.5 IELTS)',
  teacherAvatarUrl: '',
  gradedAt: '14:30 11/09/2026',
  overallBand: 7.5,
  status: 'GRADED_PUBLISHED',
  slaHoursRemaining: 0,
  writingTask1: {
    taskAchievement: 7.5,
    coherenceCohesion: 7.0,
    lexicalResource: 8.0,
    grammaticalRangeAccuracy: 7.0,
    overallTask1: 7.5,
    feedbackComments:
      'Bài viết có Overview rõ ràng, nêu bật được hai xu hướng chính của biểu đồ. Sử dụng từ vựng số liệu (surpassed, peaked at, a plateau) rất linh hoạt.',
  },
  writingTask2: {
    taskResponse: 7.0,
    coherenceCohesion: 7.5,
    lexicalResource: 7.0,
    grammaticalRangeAccuracy: 7.0,
    overallTask2: 7.0,
    feedbackComments:
      'Lập luận hai mặt cân bằng, luận điểm Body 2 phát triển sâu. Chú ý tránh một số lỗi lặp liên từ "However" và cấu trúc câu phức ở đoạn mở bài.',
  },
  speaking: {
    fluencyCoherence: 7.5,
    lexicalResource: 7.5,
    grammaticalRangeAccuracy: 7.0,
    pronunciation: 7.0,
    overallSpeaking: 7.5,
    audioFeedbackUrl: '',
    examinerNotes:
      'Phản xạ tự nhiên ở Part 1. Part 2 phát triển đủ các cue points trong thẻ câu hỏi, ngữ điệu (intonation) tốt. Part 3 cần mở rộng thêm các ví dụ thực tiễn để đạt 8.0.',
  },
}

/* ═══════════════════════════════════════════════════════════════════
   DETAILED INLINE ESSAY ANNOTATIONS & GRADED FEEDBACK SCHEMAS
═══════════════════════════════════════════════════════════════════ */

export type AnnotationCategory = 'GRAMMAR' | 'LEXICAL' | 'COHERENCE' | 'KUDOS'

export interface EssayAnnotation {
  id: string
  category: AnnotationCategory
  originalText: string // The exact substring to match and highlight
  teacherComment: string
  rewriteSuggestion?: string
  explanation?: string
}

export interface StudentEssaySubmission {
  taskNumber: 1 | 2
  taskTitle: string
  prompt: string
  essayText: string
  wordCount: number
  submittedAt: string
  bandScore: number
  criteriaScores: {
    criterion1Name: string // 'Task Achievement' (T1) or 'Task Response' (T2)
    criterion1Score: number
    coherenceCohesion: number
    lexicalResource: number
    grammaticalRangeAccuracy: number
  }
  teacherSummary: string
  annotations: EssayAnnotation[]
}

export interface ModelAnswerStructureSection {
  sectionKey: string
  title: string
  content: string
  bandNotes: string
  highlightedVocab: {
    phrase: string
    meaning: string
    bandLevel: '8.0' | '8.5' | '9.0'
  }[]
}

export interface ModelAnswerData {
  taskNumber: 1 | 2
  taskTitle: string
  targetBand: string
  prompt: string
  fullEssay: string
  wordCount: number
  examinerAnalysis: string
  structureSections: ModelAnswerStructureSection[]
  keyCollocations: {
    collocation: string
    type: string
    definition: string
    vietnameseMeaning: string
  }[]
}

export interface SpeakingPartFeedback {
  partNumber: 1 | 2 | 3
  partTitle: string
  topic: string
  durationSeconds: number
  audioUrl?: string
  questions: string[]
  transcriptSnippet?: string
  examinerNotes: string
  strengths: string[]
  improvements: string[]
  criteriaScores: {
    fluencyCoherence: number
    lexicalResource: number
    grammaticalRangeAccuracy: number
    pronunciation: number
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SAMPLE MOCK STUDENT SUBMISSIONS WITH 4-COLOR ANNOTATIONS
═══════════════════════════════════════════════════════════════════ */

export const mockStudentSubmissions: Record<'task1' | 'task2', StudentEssaySubmission> = {
  task1: {
    taskNumber: 1,
    taskTitle: 'Writing Task 1: Renewable Electricity in Europe',
    prompt:
      'The chart below shows the percentage of electricity generated from renewable sources in five European countries (Germany, United Kingdom, Denmark, Spain, Italy) in 2010, 2015, and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    essayText: `The bar chart gives information about how much electricity was produced from renewable energy sources in five different European countries between 2010 and 2020.

Overall, all five nations witnessed a general increase in renewable electricity output. In addition, Denmark was by far the leading producer throughout the surveyed period, while the United Kingdom experienced the biggest change in percentage.

Looking at the details, in 2010, Denmark started at 35%, which was higher than any other nation. Spain and Germany followed with 25% and 17% respectively. On the contrary, Italy and the UK generated lower proportions, with only 14% for Italy and 7% for the UK.

By 2020, Denmark's figure had grown significantly to nearly 60%, maintaining its top rank. The UK saw an exponential surge to 38%, which surpassed between Italy and Spain. Meanwhile, Germany also had a big increase to 42%, and Spain reached 39%. Finally, Italy progressed more modestly, finishing at 22%.`,
    wordCount: 164,
    submittedAt: '10:45 11/09/2026',
    bandScore: 7.5,
    criteriaScores: {
      criterion1Name: 'Task Achievement',
      criterion1Score: 7.5,
      coherenceCohesion: 7.0,
      lexicalResource: 8.0,
      grammaticalRangeAccuracy: 7.0,
    },
    teacherSummary:
      'Bài viết có Overview rất rõ ràng, nêu bật được hai xu hướng chính của biểu đồ. Dùng số liệu đối chiếu chuẩn xác. Cần lưu ý việc dùng sai giới từ sau động từ "surpass" và thay thế một số từ vựng thông tục như "big increase".',
    annotations: [
      {
        id: 't1-ann-1',
        category: 'KUDOS',
        originalText: 'was by far the leading producer',
        teacherComment:
          'Điểm sáng xuất sắc! Cấu trúc so sánh hơn nhất kết hợp trạng từ "by far" rất tự nhiên và thể hiện năng lực ngữ pháp Band 8.0+.',
        rewriteSuggestion: 'was by far the leading producer (Giữ nguyên - Rất tốt!)',
        explanation:
          'Giúp đoạn Overview mang tính học thuật cao và làm nổi bật ngay xu hướng chủ đạo.',
      },
      {
        id: 't1-ann-2',
        category: 'LEXICAL',
        originalText: 'the biggest change',
        teacherComment:
          'Cụm "the biggest change" khá văn nói thông thường. Nên nâng cấp lên cụm danh từ học thuật để thể hiện độ biến thiên mạnh mẽ.',
        rewriteSuggestion: 'the most dramatic rate of increase',
        explanation:
          'Dùng "dramatic rate of increase" hoặc "the most pronounced growth trajectory" nâng band Lexical Resource lên 8.0.',
      },
      {
        id: 't1-ann-3',
        category: 'COHERENCE',
        originalText: 'On the contrary',
        teacherComment:
          'Cụm "On the contrary" dùng để bác bỏ một nhận định sai trước đó, không dùng để so sánh số liệu đối lập.',
        rewriteSuggestion: 'By contrast, / In contrast,',
        explanation:
          'Trong IELTS Task 1, luôn dùng "By contrast" hoặc "Conversely" để nối hai nhóm số liệu đối chiếu.',
      },
      {
        id: 't1-ann-4',
        category: 'GRAMMAR',
        originalText: 'surpassed between',
        teacherComment:
          'Lỗi dùng sai giới từ: "surpass" là ngoại động từ (transitive verb), đi trực tiếp với tân ngữ, không dùng giới từ "between".',
        rewriteSuggestion: 'surpassing both Italy and Spain',
        explanation:
          'Sửa thành cấu trúc phân từ hiện tại: "reaching 38%, which surpassed both Italy and Spain" hoặc "overtaking both Italy and Spain".',
      },
      {
        id: 't1-ann-5',
        category: 'LEXICAL',
        originalText: 'big increase',
        teacherComment:
          'Từ "big" quá giản đơn và không phù hợp văn phong báo cáo học thuật Cambridge.',
        rewriteSuggestion: 'substantial escalation / marked upward trend',
        explanation:
          'Nên thay bằng "substantial surge" hoặc "steady upward climb" để miêu tả mức tăng trưởng từ 17% lên 42%.',
      },
    ],
  },

  task2: {
    taskNumber: 2,
    taskTitle: 'Writing Task 2: Higher Education Financing',
    prompt:
      'Some people believe that university education should be completely free for all students, funded entirely by the government. Others argue that students and their families should contribute tuition fees, as higher education directly benefits individuals.\n\nDiscuss both these views and give your own opinion.',
    essayText: `The debate over whether higher education should be funded entirely by the state or co-funded by students has attracted significant public attention. While universal free tertiary education promotes equal opportunities, I believe that a cost-sharing model is more viable and equitable.

On the one hand, providing free tuition ensures that every students should has access to higher learning regardless of financial background. When governments eliminate tuition fees, talented individuals from impoverished families are not discouraged from pursuing ambitious degrees such as medicine and engineering. Furthermore, a well-educated workforce generates immense societal benefits, contributing to national productivity and technological innovation.

On the another hand, university education is essentially a private investment that gives good money in the long run. Graduates typically secure higher salaries and enjoy superior career advancement compared to non-graduates. Therefore, it is unfair to burden taxpayers, many of whom never attended university, with the entire financial burden. Moreover, when students invest their own funds, they tend to be more committed to their academic progress.

In conclusion, although state-funded education fosters social mobility, an entirely free system places unsustainable pressure on public budgets. A balanced framework where reasonable tuition fees are paired with need-based financial aid represents the most sustainable solution.`,
    wordCount: 284,
    submittedAt: '10:45 11/09/2026',
    bandScore: 7.0,
    criteriaScores: {
      criterion1Name: 'Task Response',
      criterion1Score: 7.0,
      coherenceCohesion: 7.5,
      lexicalResource: 7.0,
      grammaticalRangeAccuracy: 7.0,
    },
    teacherSummary:
      'Lập luận cân bằng giữa hai luồng quan điểm, có quan điểm cá nhân (Thesis statement) rõ nét ngay từ mở bài. Tuy nhiên, vẫn còn vấp phải một số lỗi ngữ pháp hòa hợp chủ vị và cụm từ cố định làm giảm độ mượt mà của bài viết.',
    annotations: [
      {
        id: 't2-ann-1',
        category: 'GRAMMAR',
        originalText: 'every students should has',
        teacherComment:
          'Lỗi ngữ pháp hòa hợp chủ vị nghiêm trọng: "every" phải đi với danh từ số ít ("student"), và trợ động từ khuyết thiếu "should" phải đi với động từ nguyên mẫu ("have").',
        rewriteSuggestion: 'every student has',
        explanation:
          'Sửa thành: "ensures that every student has unhindered access to higher learning".',
      },
      {
        id: 't2-ann-2',
        category: 'KUDOS',
        originalText: 'contributing to national productivity and technological innovation',
        teacherComment:
          'Collocation học thuật đỉnh cao! Sử dụng từ ngữ chỉ tác động kinh tế vĩ mô chuẩn xác và mở rộng luận điểm thuyết phục.',
        rewriteSuggestion:
          'contributing to national productivity and technological innovation (Rất tốt!)',
        explanation:
          'Minh chứng cho khả năng lập luận sâu theo tiêu chí Task Response và Lexical Resource.',
      },
      {
        id: 't2-ann-3',
        category: 'COHERENCE',
        originalText: 'On the another hand',
        teacherComment:
          'Lỗi thành ngữ chuyển ý cố định: Cụm từ đúng trong tiếng Anh là "On the other hand", không bao giờ dùng "On the another hand".',
        rewriteSuggestion: 'On the other hand, / Conversely,',
        explanation:
          'Sửa thành liên từ tương phản chuẩn mực: "Conversely," hoặc "On the other hand,".',
      },
      {
        id: 't2-ann-4',
        category: 'LEXICAL',
        originalText: 'gives good money',
        teacherComment:
          'Văn phong khẩu ngữ (informal spoken English). Không được dùng "gives good money" trong bài luận nghị luận IELTS Task 2.',
        rewriteSuggestion: 'yields substantial financial dividends / lucrative career prospects',
        explanation:
          'Thay thế bằng "yields substantial economic returns" để đạt chuẩn văn phong học thuật cao cấp.',
      },
      {
        id: 't2-ann-5',
        category: 'KUDOS',
        originalText: 'places unsustainable pressure on public budgets',
        teacherComment:
          'Collocation xuất sắc trong kết bài! Cụm "places unsustainable pressure on" tóm gọn toàn bộ luận cứ phản biện.',
        rewriteSuggestion: 'places unsustainable pressure on public budgets (Tuyệt vời!)',
        explanation: 'Giúp phần Conclusion đúc kết cô đọng mà không bị lặp từ vựng ở thân bài.',
      },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════
   CAMBRIDGE OFFICIAL BAND 8.5+ MODEL ANSWERS WITH STRUCTURE
═══════════════════════════════════════════════════════════════════ */

export const mockModelAnswers: Record<'task1' | 'task2', ModelAnswerData> = {
  task1: {
    taskNumber: 1,
    taskTitle: 'Writing Task 1: Renewable Electricity in Europe',
    targetBand: 'Band 8.5 Cambridge Standard',
    prompt:
      'The chart below shows the percentage of electricity generated from renewable sources in five European countries (Germany, United Kingdom, Denmark, Spain, Italy) in 2010, 2015, and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.',
    fullEssay: `The bar chart illustrates the proportion of electricity produced from renewable energy sources across five European nations—Germany, the United Kingdom, Denmark, Spain, and Italy—in the years 2010, 2015, and 2020.

Overall, it is noticeable that all five countries experienced an upward trend in renewable power generation over the ten-year period. Denmark consistently led the group by a wide margin throughout the timeframe, while the United Kingdom registered the most dramatic rate of increase.

In 2010, Denmark generated approximately 35% of its electricity from renewable sources, followed by Spain at 25% and Germany at 17%. By contrast, Italy and the UK produced much smaller shares, at 14% and 7% respectively.

By 2020, Denmark’s figure surged to nearly 60%, maintaining its dominant position. Germany and the UK demonstrated substantial growth, reaching 42% and 38% respectively, with the UK witnessing a more than fivefold increase from its initial level. Spain saw a steady climb to 39%, whereas Italy progressed more modestly, finishing at 22%.`,
    wordCount: 168,
    examinerAnalysis:
      'Bài viết đạt chuẩn mực Band 8.5+ nhờ Overview bao quát trọn vẹn 2 đặc điểm then chốt (xu hướng tăng chung & hai quốc gia có vị thế đối cực). Số liệu được nhóm gộp theo mốc thời gian một cách logic, sử dụng linh hoạt các biến thể diễn đạt số liệu (proportions, shares, figures) và cấu trúc so sánh phân từ.',
    structureSections: [
      {
        sectionKey: 'intro',
        title: '1. Introduction (Mở bài & Paraphrase đề bài)',
        content:
          'The bar chart illustrates the proportion of electricity produced from renewable energy sources across five European nations—Germany, the United Kingdom, Denmark, Spain, and Italy—in the years 2010, 2015, and 2020.',
        bandNotes:
          'Paraphrase hoàn hảo: "percentage" → "proportion", "electricity generated" → "electricity produced", "five European countries" → "five European nations". Dùng gạch ngang em-dash tạo nhịp câu văn gãy gọn.',
        highlightedVocab: [
          {
            phrase: 'proportion of electricity produced',
            meaning: 'Tỷ trọng điện năng được sản xuất',
            bandLevel: '8.5',
          },
          {
            phrase: 'across five European nations',
            meaning: 'Trên khắp năm quốc gia Châu Âu',
            bandLevel: '8.0',
          },
        ],
      },
      {
        sectionKey: 'overview',
        title: '2. Overview (Bức tranh tổng thể - Chìa khóa Band 8.0+)',
        content:
          'Overall, it is noticeable that all five countries experienced an upward trend in renewable power generation over the ten-year period. Denmark consistently led the group by a wide margin throughout the timeframe, while the United Kingdom registered the most dramatic rate of increase.',
        bandNotes:
          'Đạt điểm tối đa Task Achievement nhờ chỉ ra đồng thời: (1) Xu hướng chung đi lên của toàn bộ các đối tượng; (2) Quốc gia luôn dẫn đầu cách biệt (Denmark); (3) Quốc gia có tốc độ bứt phá kỷ lục (UK). Tuyệt đối không đưa số liệu chi tiết vào Overview.',
        highlightedVocab: [
          {
            phrase: 'experienced an upward trend',
            meaning: 'Ghi nhận một xu hướng tăng trưởng',
            bandLevel: '8.0',
          },
          {
            phrase: 'consistently led the group by a wide margin',
            meaning: 'Liên tục dẫn đầu nhóm với cách biệt lớn',
            bandLevel: '9.0',
          },
          {
            phrase: 'registered the most dramatic rate of increase',
            meaning: 'Xác lập tốc độ tăng trưởng ngoạn mục nhất',
            bandLevel: '8.5',
          },
        ],
      },
      {
        sectionKey: 'body1',
        title: '3. Body Paragraph 1 (Số liệu năm gốc 2010 & Xếp hạng ban đầu)',
        content:
          'In 2010, Denmark generated approximately 35% of its electricity from renewable sources, followed by Spain at 25% and Germany at 17%. By contrast, Italy and the UK produced much smaller shares, at 14% and 7% respectively.',
        bandNotes:
          'Phân bổ nhóm số liệu từ cao xuống thấp: Nhóm top đầu (Denmark, Spain, Germany) đối sánh sắc bén với nhóm tụt lại phía sau (Italy, UK). Sử dụng liên từ đối chiếu chuẩn mực "By contrast" và phó từ phân phối "respectively".',
        highlightedVocab: [
          {
            phrase: 'followed by ... respectively',
            meaning: 'Lần lượt theo sau bởi...',
            bandLevel: '8.0',
          },
          {
            phrase: 'produced much smaller shares',
            meaning: 'Tạo ra tỷ phần khiêm tốn hơn nhiều',
            bandLevel: '8.5',
          },
        ],
      },
      {
        sectionKey: 'body2',
        title: '4. Body Paragraph 2 (Diễn biến năm 2020 & Tốc độ tăng trưởng)',
        content:
          'By 2020, Denmark’s figure surged to nearly 60%, maintaining its dominant position. Germany and the UK demonstrated substantial growth, reaching 42% and 38% respectively, with the UK witnessing a more than fivefold increase from its initial level. Spain saw a steady climb to 39%, whereas Italy progressed more modestly, finishing at 22%.',
        bandNotes:
          'Từ vựng tăng trưởng cực kỳ đa dạng: "surged to", "demonstrated substantial growth", "fivefold increase", "steady climb", "progressed more modestly". Cấu trúc phân từ độc lập ("with the UK witnessing...") tạo nên câu phức học thuật tinh tế.',
        highlightedVocab: [
          {
            phrase: 'surged to nearly 60%, maintaining its dominant position',
            meaning: 'Tăng vọt lên gần 60%, giữ vững vị thế thống trị',
            bandLevel: '9.0',
          },
          {
            phrase: 'witnessing a more than fivefold increase',
            meaning: 'Chứng kiến mức tăng trưởng gấp hơn 5 lần',
            bandLevel: '9.0',
          },
          {
            phrase: 'progressed more modestly',
            meaning: 'Tiến triển ở mức độ khiêm tốn hơn',
            bandLevel: '8.5',
          },
        ],
      },
    ],
    keyCollocations: [
      {
        collocation: 'lead by a wide margin',
        type: 'Verb + Noun Phrase',
        definition: 'To be far ahead of all other competitors in a measurable metric.',
        vietnameseMeaning: 'Dẫn đầu với cách biệt áp đảo',
      },
      {
        collocation: 'dramatic rate of increase',
        type: 'Adjective + Noun Phrase',
        definition: 'A steep and striking pace of growth.',
        vietnameseMeaning: 'Tốc độ gia tăng ngoạn mục',
      },
      {
        collocation: 'witness a fivefold increase',
        type: 'Verb + Multiplier',
        definition: 'To experience a numerical growth multiplying by five.',
        vietnameseMeaning: 'Chứng kiến mức tăng gấp 5 lần',
      },
      {
        collocation: 'maintain a dominant position',
        type: 'Verb + Adjective + Noun',
        definition: 'To keep holding the topmost status throughout a period.',
        vietnameseMeaning: 'Duy trì vị thế thống soái/đứng đầu',
      },
    ],
  },

  task2: {
    taskNumber: 2,
    taskTitle: 'Writing Task 2: Higher Education Financing',
    targetBand: 'Band 8.5 Cambridge Standard',
    prompt:
      'Some people believe that university education should be completely free for all students, funded entirely by the government. Others argue that students and their families should contribute tuition fees, as higher education directly benefits individuals.\n\nDiscuss both these views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.',
    fullEssay: `The question of whether tertiary education should be state-funded or financed through individual tuition fees remains a topic of intense debate. While tuition-free universities promote social equity and cultivate an educated workforce, I believe that a hybrid model—where students pay subsidized fees backed by income-contingent loans and merit-based grants—strikes the most sustainable balance.

Advocates of universally free university education emphasize equality of opportunity. Proponents argue that high tuition fees act as an insurmountable barrier for students from underprivileged socio-economic backgrounds, thereby perpetuating social disparities. When a government finances higher education, talented young individuals can pursue medicine, engineering, and scientific research irrespective of their household income. Furthermore, higher national graduation rates yield long-term societal dividends, such as higher tax revenues and accelerated technological innovation.

Conversely, supporters of tuition fees maintain that higher education is primarily a private investment that yields substantial personal returns. University graduates typically earn considerably higher lifetime salaries and enjoy greater career mobility than non-graduates. Therefore, it is arguably unjust to burden ordinary taxpayers—many of whom did not attend university themselves—with the full cost of tertiary schooling. Additionally, when students invest their own resources into their degrees, they are generally more conscientious and driven to complete their studies efficiently.

In conclusion, while free higher education embodies an egalitarian ideal, it frequently places severe strain on public budgets. A pragmatic approach combining subsidized fees with generous need-based scholarships ensures both equitable access and sustainable university standards.`,
    wordCount: 268,
    examinerAnalysis:
      'Bài luận mẫu mực đạt Band 8.5+: Câu chủ đề và luận điểm rõ ràng (Clear position throughout). Đoạn thân bài 1 giải thích sâu về tính bình đẳng cơ hội và lợi ích ngoại biên của giáo dục (societal dividends). Thân bài 2 phản biện thuyết phục với lý lẽ lợi ích cá nhân (private investment) và gánh nặng công bằng thuế. Kết bài đưa ra giải pháp dung hòa (hybrid pragmatic approach) rất thực tế.',
    structureSections: [
      {
        sectionKey: 'intro',
        title: '1. Introduction & Thesis Statement (Mở bài & Luận điểm cá nhân)',
        content:
          'The question of whether tertiary education should be state-funded or financed through individual tuition fees remains a topic of intense debate. While tuition-free universities promote social equity and cultivate an educated workforce, I believe that a hybrid model—where students pay subsidized fees backed by income-contingent loans and merit-based grants—strikes the most sustainable balance.',
        bandNotes:
          'Khẳng định lập trường (Thesis Statement) ngay ở câu thứ hai bằng cấu trúc nhượng bộ "While... I believe that a hybrid model... strikes the most sustainable balance". Không dùng những cụm rập khuôn như "I will discuss both sides".',
        highlightedVocab: [
          {
            phrase: 'tertiary education should be state-funded',
            meaning: 'Giáo dục bậc đại học nên được ngân sách nhà nước tài trợ',
            bandLevel: '8.5',
          },
          {
            phrase: 'cultivate an educated workforce',
            meaning: 'Bồi dưỡng lực lượng lao động có học thức cao',
            bandLevel: '8.5',
          },
          {
            phrase: 'strikes the most sustainable balance',
            meaning: 'Tạo lập thế cân bằng bền vững nhất',
            bandLevel: '9.0',
          },
        ],
      },
      {
        sectionKey: 'body1',
        title: '2. Body Paragraph 1 (Luận điểm ủng hộ miễn học phí toàn dân)',
        content:
          'Advocates of universally free university education emphasize equality of opportunity. Proponents argue that high tuition fees act as an insurmountable barrier for students from underprivileged socio-economic backgrounds, thereby perpetuating social disparities. When a government finances higher education, talented young individuals can pursue medicine, engineering, and scientific research irrespective of their household income. Furthermore, higher national graduation rates yield long-term societal dividends, such as higher tax revenues and accelerated technological innovation.',
        bandNotes:
          'Lập luận mở rộng từ góc độ cá nhân (xóa bỏ rào cản tài chính cho gia đình nghèo) lên góc độ vĩ mô xã hội (tăng nguồn thu thuế và đổi mới công nghệ). Luận điểm được liên kết chặt chẽ bằng các từ nối học thuật: "Proponents argue", "thereby", "Furthermore".',
        highlightedVocab: [
          {
            phrase: 'insurmountable barrier',
            meaning: 'Rào cản không thể vượt qua',
            bandLevel: '8.5',
          },
          {
            phrase: 'underprivileged socio-economic backgrounds',
            meaning: 'Hoàn cảnh kinh tế - xã hội khó khăn / thiệt thòi',
            bandLevel: '8.5',
          },
          {
            phrase: 'perpetuating social disparities',
            meaning: 'Làm kéo dài thêm sự bất bình đẳng xã hội',
            bandLevel: '9.0',
          },
          {
            phrase: 'yield long-term societal dividends',
            meaning: 'Mang lại các lợi ích cổ tức xã hội lâu dài',
            bandLevel: '9.0',
          },
        ],
      },
      {
        sectionKey: 'body2',
        title: '3. Body Paragraph 2 (Luận điểm ủng hộ người học cùng chi trả)',
        content:
          'Conversely, supporters of tuition fees maintain that higher education is primarily a private investment that yields substantial personal returns. University graduates typically earn considerably higher lifetime salaries and enjoy greater career mobility than non-graduates. Therefore, it is arguably unjust to burden ordinary taxpayers—many of whom did not attend university themselves—with the full cost of tertiary schooling. Additionally, when students invest their own resources into their degrees, they are generally more conscientious and driven to complete their studies efficiently.',
        bandNotes:
          'Phân tích sâu sắc khái niệm "Private Investment vs Public Good". Lý lẽ về tính công bằng của người nộp thuế thông thường ("ordinary taxpayers") là một luận cứ rất sắc bén của Cambridge.',
        highlightedVocab: [
          {
            phrase: 'private investment that yields substantial personal returns',
            meaning: 'Khoản đầu tư tư nhân đem lại lợi nhuận cá nhân to lớn',
            bandLevel: '9.0',
          },
          {
            phrase: 'greater career mobility',
            meaning: 'Khả năng dịch chuyển và thăng tiến nghề nghiệp tốt hơn',
            bandLevel: '8.5',
          },
          {
            phrase: 'arguably unjust to burden ordinary taxpayers',
            meaning: 'Rõ ràng là bất công nếu bắt người nộp thuế bình thường gánh chịu',
            bandLevel: '9.0',
          },
          {
            phrase: 'more conscientious and driven',
            meaning: 'Tận tâm, nghiêm túc và có động lực học tập cao hơn',
            bandLevel: '8.5',
          },
        ],
      },
      {
        sectionKey: 'conclusion',
        title: '4. Conclusion (Kết luận & Đề xuất giải pháp hài hòa)',
        content:
          'In conclusion, while free higher education embodies an egalitarian ideal, it frequently places severe strain on public budgets. A pragmatic approach combining subsidized fees with generous need-based scholarships ensures both equitable access and sustainable university standards.',
        bandNotes:
          'Đúc kết xúc tích hai mặt của vấn đề ("egalitarian ideal" vs "severe strain on public budgets") và tái khẳng định giải pháp thực tiễn ("pragmatic approach").',
        highlightedVocab: [
          {
            phrase: 'embodies an egalitarian ideal',
            meaning: 'Hiện thân cho lý tưởng bình đẳng xã hội',
            bandLevel: '9.0',
          },
          {
            phrase: 'places severe strain on public budgets',
            meaning: 'Tạo áp lực nặng nề lên ngân sách nhà nước',
            bandLevel: '8.5',
          },
          {
            phrase: 'pragmatic approach combining subsidized fees',
            meaning: 'Cách tiếp cận thực tế kết hợp học phí hỗ trợ',
            bandLevel: '9.0',
          },
        ],
      },
    ],
    keyCollocations: [
      {
        collocation: 'insurmountable barrier',
        type: 'Adjective + Noun',
        definition: 'An obstacle that is impossible to overcome.',
        vietnameseMeaning: 'Rào cản không thể vượt qua',
      },
      {
        collocation: 'perpetuate social disparities',
        type: 'Verb + Noun Phrase',
        definition: 'To cause inequality to continue for an extended time.',
        vietnameseMeaning: 'Kéo dài sự bất bình đẳng xã hội',
      },
      {
        collocation: 'societal dividends',
        type: 'Adjective + Noun',
        definition: 'Long-term advantages and positive outcomes shared by an entire society.',
        vietnameseMeaning: 'Cổ tức / Lợi ích chung cho toàn xã hội',
      },
      {
        collocation: 'place severe strain on',
        type: 'Idiomatic Verb Phrase',
        definition: 'To subject resources or budgets to excessive stress.',
        vietnameseMeaning: 'Đặt gánh nặng nặng nề lên...',
      },
      {
        collocation: 'pragmatic approach',
        type: 'Adjective + Noun',
        definition:
          'A sensible, realistic method based on practical rather than idealistic thoughts.',
        vietnameseMeaning: 'Cách tiếp cận thực tế, khả thi',
      },
    ],
  },
}

/* ═══════════════════════════════════════════════════════════════════
   SPEAKING FEEDBACK & AUDIO REVIEW MOCK DATA
═══════════════════════════════════════════════════════════════════ */

export const mockSpeakingFeedbacks: SpeakingPartFeedback[] = [
  {
    partNumber: 1,
    partTitle: 'Part 1: Introduction & Interview',
    topic: 'Hometown, Studies & Daily Routine',
    durationSeconds: 245,
    questions: [
      'Do you work or are you currently studying?',
      'What do you find most interesting about your field of study?',
      'Let’s talk about your hometown. What is the most famous place in your hometown?',
      'Do you prefer living in a bustling city or a peaceful countryside?',
    ],
    transcriptSnippet:
      '"Currently, I am a final-year undergraduate majoring in Computer Science. What fascinates me most is algorithmic problem-solving... Regarding my hometown, Da Nang is renowned for its coastal scenery and the iconic Dragon Bridge..."',
    examinerNotes:
      'Thí sinh thể hiện phản xạ tự nhiên, không ngập ngừng ở các câu hỏi thông thường. Trả lời đúng trọng tâm và tự động mở rộng ý thêm 2-3 câu có liên từ nối tự nhiên. Ngữ điệu câu trần thuật và câu hỏi lựa chọn rất chuẩn.',
    strengths: [
      'Phản xạ nhanh nhạy (< 1.5s độ trễ trước khi trả lời).',
      'Sử dụng collocation tự nhiên: "undergraduate majoring in", "algorithmic problem-solving", "coastal scenery".',
      'Phát âm âm cuối (ending sounds) rõ ràng: /s/, /z/, /t/.',
    ],
    improvements: [
      'Cần đa dạng hóa các từ nối mở đầu thay vì lặp lại "Well, actually...".',
      'Tập trung phát âm chuẩn trọng âm từ có 3 âm tiết trở lên (ví dụ: "fascinates", "undergraduate").',
    ],
    criteriaScores: {
      fluencyCoherence: 7.5,
      lexicalResource: 8.0,
      grammaticalRangeAccuracy: 7.5,
      pronunciation: 7.5,
    },
  },
  {
    partNumber: 2,
    partTitle: 'Part 2: Individual Long Turn (Cue Card)',
    topic: 'Describe a memorable journey you took with your friends or family',
    durationSeconds: 120,
    questions: [
      'Where you went on this journey',
      'Who you travelled with',
      'What activities you participated in',
      'Explain why this journey remains memorable to you',
    ],
    transcriptSnippet:
      '"I would like to talk about a backpacking expedition to Ha Giang that I embarked upon two summers ago with my high school peers. What struck me most was the majestic landscape of Ma Pi Leng Pass..."',
    examinerNotes:
      'Duy trì dòng chảy bài nói trọn vẹn trong 2 phút mà không bị ngắt quãng vô cớ (no awkward pauses). Đã bao quát toàn bộ 4 gạch đầu dòng của Cue Card. Thể hiện năng lực kể chuyện (Storytelling) tốt với thì quá khứ đơn và quá khứ hoàn thành đan xen chính xác.',
    strengths: [
      'Làm chủ thời gian xuất sắc (nói đủ 1 phút 58 giây).',
      'Từ vựng miêu tả cảnh quan và cảm xúc đạt chuẩn C1: "backpacking expedition", "embarked upon", "majestic landscape", "breathtaking panoramic view".',
      'Liên kết ý mạch lạc theo trình tự thời gian (chronological order).',
    ],
    improvements: [
      'Tránh lạm dụng từ "like" khi suy nghĩ chuyển ý trong câu dài.',
      'Cần hạ ngữ điệu (falling intonation) dứt khoát hơn ở cuối câu kết bài để báo hiệu cho giám khảo biết đã hoàn thành bài nói.',
    ],
    criteriaScores: {
      fluencyCoherence: 7.5,
      lexicalResource: 8.0,
      grammaticalRangeAccuracy: 7.0,
      pronunciation: 7.0,
    },
  },
  {
    partNumber: 3,
    partTitle: 'Part 3: Two-Way Discussion',
    topic: 'Tourism, Cultural Preservation & Urban Mobility',
    durationSeconds: 290,
    questions: [
      'How has tourism influenced traditional cultures in developing nations?',
      'Do you think governments should limit the number of tourists visiting heritage sites?',
      'What are the main advantages of investing in public rapid transit over private vehicles?',
    ],
    transcriptSnippet:
      '"From my perspective, commercialized tourism can be a double-edged sword. While it injects substantial revenue into local economies, it frequently leads to the commodification of indigenous traditions..."',
    examinerNotes:
      'Thí sinh có tư duy phản biện (Critical Thinking) tốt ở mức độ trừu tượng. Sử dụng cấu trúc lập luận 2 mặt rất sắc sảo. Cần khắc phục một vài lỗi ngữ pháp nhỏ khi dùng mệnh đề quan hệ phức và câu điều kiện hỗn hợp.',
    strengths: [
      'Tư duy trừu tượng sắc bén: nhận diện du lịch là "double-edged sword" và diễn giải khái niệm "commodification of indigenous traditions".',
      'Khả năng paraphrase câu hỏi của giám khảo tự nhiên, không rập khuôn.',
    ],
    improvements: [
      'Cần kiểm soát nhịp độ nói khi trình bày ý tưởng phức tạp, tránh nói quá nhanh dẫn đến nuốt âm.',
      'Sử dụng thêm cấu trúc đảo ngữ (Inversion) hoặc câu điều kiện loại 3 để đẩy tiêu chí Grammatical Range lên Band 8.0.',
    ],
    criteriaScores: {
      fluencyCoherence: 7.5,
      lexicalResource: 8.0,
      grammaticalRangeAccuracy: 7.0,
      pronunciation: 7.5,
    },
  },
]
