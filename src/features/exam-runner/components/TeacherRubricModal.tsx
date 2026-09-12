import React, { useState } from 'react'
import { X, Award, PenTool, Mic, MessageSquare, BookOpen, GraduationCap } from 'lucide-react'
import type { TeacherRubricAssessment } from '../types/fullExam.types'

interface TeacherRubricModalProps {
  isOpen: boolean
  onClose: () => void
  assessment: TeacherRubricAssessment
}

export const TeacherRubricModal: React.FC<TeacherRubricModalProps> = ({
  isOpen,
  onClose,
  assessment,
}) => {
  const [activeTab, setActiveTab] = useState<'WRITING' | 'SPEAKING'>('WRITING')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in-up"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 shadow-2xs">
              <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Phiếu Chấm Điểm Chi Tiết Của Giáo Viên
                </h3>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                  Chuẩn Khảo Thí Cambridge
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Chấm bởi:{' '}
                <span className="font-semibold text-slate-700">{assessment.teacherName}</span> •
                Lúc: {assessment.gradedAt}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng phiếu chấm"
            className="btn-interactive flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Skill Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('WRITING')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${
              activeTab === 'WRITING'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" strokeWidth={activeTab === 'WRITING' ? 2 : 1.75} />
            <span>IELTS Writing Rubric</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                activeTab === 'WRITING' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Band{' '}
              {(
                (assessment.writingTask1.overallTask1 + assessment.writingTask2.overallTask2 * 2) /
                3
              ).toFixed(1)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SPEAKING')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all border ${
              activeTab === 'SPEAKING'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Mic className="h-3.5 w-3.5" strokeWidth={activeTab === 'SPEAKING' ? 2 : 1.75} />
            <span>IELTS Speaking Rubric</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                activeTab === 'SPEAKING' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Band {assessment.speaking.overallSpeaking.toFixed(1)}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {activeTab === 'WRITING' && (
            <div className="space-y-6">
              {/* Task 1 Evaluation */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-slate-600" strokeWidth={1.75} />
                    <h4 className="text-sm font-bold text-slate-900">
                      Task 1: Academic Report (Biểu đồ)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-900 shadow-2xs">
                    <Award className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Band {assessment.writingTask1.overallTask1.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Task Achievement
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask1.taskAchievement.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Coherence & Cohesion
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask1.coherenceCohesion.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Lexical Resource
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask1.lexicalResource.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Grammar & Accuracy
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask1.grammaticalRangeAccuracy.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs border-l-3 border-l-slate-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Nhận xét của Giáo viên:</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 font-normal">
                    {assessment.writingTask1.feedbackComments}
                  </p>
                </div>
              </div>

              {/* Task 2 Evaluation */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-4 w-4 text-slate-600" strokeWidth={1.75} />
                    <h4 className="text-sm font-bold text-slate-900">
                      Task 2: Discursive Essay (Nghị luận xã hội)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-900 shadow-2xs">
                    <Award className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Band {assessment.writingTask2.overallTask2.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Task Response
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask2.taskResponse.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Coherence & Cohesion
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask2.coherenceCohesion.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Lexical Resource
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask2.lexicalResource.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Grammar & Accuracy
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.writingTask2.grammaticalRangeAccuracy.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs border-l-3 border-l-slate-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Nhận xét của Giáo viên:</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 font-normal">
                    {assessment.writingTask2.feedbackComments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SPEAKING' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-slate-600" strokeWidth={1.75} />
                    <h4 className="text-sm font-bold text-slate-900">
                      Đánh Giá Bài Thi Nói 3 Phần (Parts 1 - 3)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-900 shadow-2xs">
                    <Award className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Band {assessment.speaking.overallSpeaking.toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Fluency & Coherence
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.speaking.fluencyCoherence.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Lexical Resource
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.speaking.lexicalResource.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Grammar & Accuracy
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.speaking.grammaticalRangeAccuracy.toFixed(1)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-2xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Pronunciation
                    </div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">
                      {assessment.speaking.pronunciation.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs border-l-3 border-l-slate-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                    <span>Lời phê của Giám khảo:</span>
                  </div>
                  <p className="leading-relaxed text-slate-600 font-normal">
                    {assessment.speaking.examinerNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-interactive rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
          >
            Đóng phiếu chấm
          </button>
        </div>
      </div>
    </div>
  )
}
