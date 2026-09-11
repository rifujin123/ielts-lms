import type { GamifiedExerciseLesson } from '../types/gamifiedExercise.types'

export const sampleGamifiedLessons: Record<string, GamifiedExerciseLesson> = {
  'EX-01': {
    id: 'EX-01',
    title: 'Reading: Linearthinking Logic & Paraphrasing',
    skill: 'Reading',
    subCategory: 'Academic Reading — Band 6.5+ Drill',
    xpReward: 30,
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        prompt: 'Chọn từ đồng nghĩa học thuật (Academic Synonym) phù hợp nhất với từ in đậm:',
        context:
          '“The government introduced stringent regulations to **curb** the rapid increase in carbon emissions.”',
        instruction: 'Nhấn phím 1–4 hoặc click vào đáp án đúng',
        options: [
          { id: 'opt_1', text: 'limit / restrict', hint: 'Kìm hãm / giới hạn' },
          { id: 'opt_2', text: 'accelerate', hint: 'Gia tốc / đẩy nhanh' },
          { id: 'opt_3', text: 'neglect', hint: 'Bỏ bê / xem nhẹ' },
          { id: 'opt_4', text: 'finance', hint: 'Tài trợ tài chính' },
        ],
        correctOptionId: 'opt_1',
        explanation: {
          rule: 'Linearthinking — Nghĩa theo ngữ cảnh (Contextual Meaning)',
          detail:
            'Động từ "curb" mang nghĩa kiểm soát hoặc kìm hãm sự gia tăng của một tác nhân tiêu cực. Trong ngữ cảnh khí thải carbon, "limit / restrict" là từ đồng nghĩa chính xác nhất.',
        },
      },
      {
        id: 'q2',
        type: 'word_bank_gap_fill',
        prompt:
          'Sắp xếp các từ từ ngân hàng vào đúng vị trí để hoàn thành cấu trúc câu Linearthinking:',
        context:
          'Quy tắc liên kết: Chủ ngữ + Động từ nhận thức + Đối tượng nghiên cứu + Kết luận logic.',
        sentenceWithBlanks:
          'The research team decided to [blank_1] the experimental findings before drawing any [blank_2] regarding climate patterns.',
        blanks: [
          { blankId: 'blank_1', correctWord: 'scrutinize' },
          { blankId: 'blank_2', correctWord: 'conclusions' },
        ],
        wordBank: [
          { id: 'wb_1', word: 'scrutinize' },
          { id: 'wb_2', word: 'conclusions' },
          { id: 'wb_3', word: 'haphazardly' },
          { id: 'wb_4', word: 'superficial' },
          { id: 'wb_5', word: 'replicate' },
        ],
        explanation: {
          rule: 'Linearthinking — Collocation & Cấu trúc động từ',
          detail:
            'Cụm "decided to scrutinize" (xem xét kỹ lưỡng) đứng trước tân ngữ "experimental findings". Cụm "drawing any conclusions" là collocation kinh điển trong văn viết IELTS học thuật.',
        },
      },
      {
        id: 'q3',
        type: 'multiple_choice',
        prompt:
          'Chọn TẤT CẢ các cụm từ thể hiện mối quan hệ Nhân - Quả (Cause & Effect) chuẩn IELTS:',
        instruction: 'Chọn 2 đáp án đúng',
        requiredSelectCount: 2,
        options: [
          { id: 'mc_1', text: 'stem from (bắt nguồn từ)' },
          { id: 'mc_2', text: 'in stark contrast to (ngược lại hoàn toàn)' },
          { id: 'mc_3', text: 'give rise to (dẫn đến / làm nảy sinh)' },
          { id: 'mc_4', text: 'notwithstanding (mặc dù vậy)' },
        ],
        correctOptionIds: ['mc_1', 'mc_3'],
        explanation: {
          rule: 'Linearthinking — Liên kết Nhân Quả (Cause - Effect Connectors)',
          detail:
            '"stem from" chỉ Nguyên nhân (A bắt nguồn từ B) và "give rise to" chỉ Kết quả (A làm nảy sinh B). Hai cụm còn lại thể hiện sự tương phản (Contrast).',
        },
      },
      {
        id: 'q4',
        type: 'word_bank_gap_fill',
        prompt:
          'Điền các từ nối học thuật vào chỗ trống để tạo mạch liên kết mạch lạc (Coherence):',
        sentenceWithBlanks:
          'Renewable energy has become considerably cheaper; [blank_1], fossil fuels continue to [blank_2] global energy consumption.',
        blanks: [
          { blankId: 'blank_1', correctWord: 'nevertheless' },
          { blankId: 'blank_2', correctWord: 'dominate' },
        ],
        wordBank: [
          { id: 'wb_1', word: 'nevertheless' },
          { id: 'wb_2', word: 'dominate' },
          { id: 'wb_3', word: 'subsequently' },
          { id: 'wb_4', word: 'deteriorate' },
          { id: 'wb_5', word: 'abandon' },
        ],
        explanation: {
          rule: 'Linearthinking — Tư duy Tương phản (Contrastive Discourse)',
          detail:
            'Vế trước: năng lượng tái tạo rẻ hơn (tích cực). Vế sau: nhiên liệu hóa thạch vẫn chiếm ưu thế (tiêu cực đối lập). Ta dùng trạng từ liên kết "nevertheless" (tuy nhiên) và động từ "dominate" (chiếm ưu thế).',
        },
      },
      {
        id: 'q5',
        type: 'single_choice',
        prompt: 'Theo tư duy Linearthinking, nhận định nào dưới đây đúng với đoạn văn?',
        context:
          '“While artificial intelligence can rapidly synthesize clinical trial datasets, it lacks the intuitive diagnostic empathy indispensable in primary healthcare.”',
        instruction: 'Nhấn phím 1–4 hoặc click vào đáp án đúng',
        options: [
          { id: 'opt_1', text: 'AI hoàn toàn thay thế được bác sĩ trong khám chữa bệnh ban đầu.' },
          {
            id: 'opt_2',
            text: 'AI xử lý dữ liệu tốt nhưng chưa thể thay thế sự thấu cảm của con người.',
          },
          { id: 'opt_3', text: 'Dữ liệu thử nghiệm lâm sàng không thể phân tích bằng máy móc.' },
          { id: 'opt_4', text: 'Sự thấu cảm chẩn đoán là yếu tố không quan trọng trong y tế.' },
        ],
        correctOptionId: 'opt_2',
        explanation: {
          rule: 'Linearthinking — Đơn giản hóa câu phức (Simplifying Complex Sentences)',
          detail:
            'Cấu trúc While A (AI tổng hợp dữ liệu nhanh), B (nhưng thiếu sự thấu cảm chẩn đoán cốt yếu). Do đó đáp án phản ánh trung thực trọng tâm câu là: AI xử lý dữ liệu tốt nhưng chưa thể thay thế sự thấu cảm của con người.',
        },
      },
    ],
  },
}
