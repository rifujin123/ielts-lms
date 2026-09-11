import React, { useState } from 'react'
import type {
  GamifiedExerciseLesson,
  SingleChoiceQuestionData,
  MultipleChoiceQuestionData,
  WordBankGapFillQuestionData,
  WordBankItem,
} from './types/gamifiedExercise.types'
import { sampleGamifiedLessons } from './mocks/sampleGamifiedExercises'
import { soundEffects } from './utils/soundEffects'
import { ExerciseTopBar } from './components/ExerciseTopBar'
import { SingleChoiceQuestion } from './components/SingleChoiceQuestion'
import { MultipleChoiceQuestion } from './components/MultipleChoiceQuestion'
import { WordBankGapFillQuestion } from './components/WordBankGapFillQuestion'
import {
  ExerciseBottomFeedbackDrawer,
  type EvaluationStatus,
} from './components/ExerciseBottomFeedbackDrawer'
import { ExerciseCompleteScreen } from './components/ExerciseCompleteScreen'
import { QuestionExplanationModal } from './components/QuestionExplanationModal'

interface ExerciseGamifiedRunnerProps {
  exerciseId?: string
  lessonData?: GamifiedExerciseLesson
  onExit: () => void
  onComplete?: (result: { accuracyPct: number }) => void
}

export const ExerciseGamifiedRunner: React.FC<ExerciseGamifiedRunnerProps> = ({
  exerciseId = 'EX-01',
  lessonData,
  onExit,
  onComplete,
}) => {
  // Resolve lesson data fallback
  const lesson: GamifiedExerciseLesson =
    lessonData || sampleGamifiedLessons[exerciseId] || sampleGamifiedLessons['EX-01']

  const questions = lesson.questions

  // State Machine
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationStatus>('idle')
  const [streakCount, setStreakCount] = useState<number>(0)
  const [maxStreak, setMaxStreak] = useState<number>(0)
  const [livesCount, setLivesCount] = useState<number>(5)
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(false)

  // Current question inputs
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [placedWords, setPlacedWords] = useState<Record<string, WordBankItem | null>>({})

  const currentQuestion = questions[currentQuestionIndex]

  // Reset inputs for next question
  const resetQuestionInputs = () => {
    setSelectedOptionId(null)
    setSelectedOptionIds([])
    setPlacedWords({})
    setEvaluationStatus('idle')
    setIsExplanationOpen(false)
  }

  // Check if student has provided enough input to enable the Check button
  const isAnswerReady = (() => {
    if (!currentQuestion) return false
    switch (currentQuestion.type) {
      case 'single_choice':
        return selectedOptionId !== null
      case 'multiple_choice':
        return selectedOptionIds.length > 0
      case 'word_bank_gap_fill':
        return currentQuestion.blanks.every((b) => placedWords[b.blankId] != null)
      default:
        return false
    }
  })()

  // Evaluate student answer
  const handleCheckAnswer = () => {
    if (!currentQuestion || evaluationStatus !== 'idle') return

    let isCorrect = false

    if (currentQuestion.type === 'single_choice') {
      const q = currentQuestion as SingleChoiceQuestionData
      isCorrect = selectedOptionId === q.correctOptionId
    } else if (currentQuestion.type === 'multiple_choice') {
      const q = currentQuestion as MultipleChoiceQuestionData
      const correctSet = new Set(q.correctOptionIds)
      const selectedSet = new Set(selectedOptionIds)
      isCorrect =
        correctSet.size === selectedSet.size && [...correctSet].every((id) => selectedSet.has(id))
    } else if (currentQuestion.type === 'word_bank_gap_fill') {
      const q = currentQuestion as WordBankGapFillQuestionData
      isCorrect = q.blanks.every(
        (b) =>
          placedWords[b.blankId]?.word.trim().toLowerCase() === b.correctWord.trim().toLowerCase(),
      )
    }

    if (isCorrect) {
      soundEffects.playCorrect()
      setEvaluationStatus('correct')
      const nextStreak = streakCount + 1
      setStreakCount(nextStreak)
      setMaxStreak((prev) => Math.max(prev, nextStreak))
      setCorrectCount((prev) => prev + 1)
    } else {
      soundEffects.playIncorrect()
      setEvaluationStatus('incorrect')
      setStreakCount(0)
      setLivesCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Advance to next question or complete lesson
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1)
      resetQuestionInputs()
    } else {
      setIsCompleted(true)
      const accuracy =
        questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 100
      onComplete?.({
        accuracyPct: accuracy,
      })
    }
  }

  // Format correct answer summary text for bottom drawer
  const getCorrectAnswerSummary = (): string | undefined => {
    if (evaluationStatus !== 'incorrect' || !currentQuestion) return undefined

    if (currentQuestion.type === 'single_choice') {
      const q = currentQuestion as SingleChoiceQuestionData
      const correctOpt = q.options.find((o) => o.id === q.correctOptionId)
      return correctOpt ? correctOpt.text : undefined
    }

    if (currentQuestion.type === 'multiple_choice') {
      const q = currentQuestion as MultipleChoiceQuestionData
      const correctOpts = q.options
        .filter((o) => q.correctOptionIds.includes(o.id))
        .map((o) => o.text)
      return correctOpts.join('; ')
    }

    if (currentQuestion.type === 'word_bank_gap_fill') {
      const q = currentQuestion as WordBankGapFillQuestionData
      return q.blanks.map((b) => b.correctWord).join(' → ')
    }

    return undefined
  }

  // Restart lesson
  const handleRetryLesson = () => {
    setCurrentQuestionIndex(0)
    setStreakCount(0)
    setLivesCount(5)
    setCorrectCount(0)
    setIsCompleted(false)
    resetQuestionInputs()
  }

  // Show Completion Screen
  if (isCompleted) {
    return (
      <ExerciseCompleteScreen
        lessonTitle={lesson.title}
        totalQuestions={questions.length}
        correctCount={correctCount}
        streakCount={maxStreak}
        onFinish={onExit}
        onRetry={handleRetryLesson}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Sticky Top Navigation & Progress Bar */}
      <ExerciseTopBar
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        streakCount={streakCount}
        livesCount={livesCount}
        onExit={onExit}
      />

      {/* 2. Main Question Area with Generous Whitespace */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-36 flex flex-col justify-center">
        {currentQuestion && currentQuestion.type === 'single_choice' && (
          <SingleChoiceQuestion
            question={currentQuestion as SingleChoiceQuestionData}
            selectedOptionId={selectedOptionId}
            onSelectOption={setSelectedOptionId}
            isEvaluated={evaluationStatus !== 'idle'}
            isCorrect={evaluationStatus === 'correct'}
          />
        )}

        {currentQuestion && currentQuestion.type === 'multiple_choice' && (
          <MultipleChoiceQuestion
            question={currentQuestion as MultipleChoiceQuestionData}
            selectedOptionIds={selectedOptionIds}
            onToggleOption={(optId) => {
              setSelectedOptionIds((prev) =>
                prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId],
              )
            }}
            isEvaluated={evaluationStatus !== 'idle'}
            isCorrect={evaluationStatus === 'correct'}
          />
        )}

        {currentQuestion && currentQuestion.type === 'word_bank_gap_fill' && (
          <WordBankGapFillQuestion
            question={currentQuestion as WordBankGapFillQuestionData}
            placedWords={placedWords}
            onPlaceWord={(blankId, wordItem) => {
              setPlacedWords((prev) => ({ ...prev, [blankId]: wordItem }))
            }}
            onRemoveWord={(blankId) => {
              setPlacedWords((prev) => {
                const next = { ...prev }
                delete next[blankId]
                return next
              })
            }}
            isEvaluated={evaluationStatus !== 'idle'}
            isCorrect={evaluationStatus === 'correct'}
          />
        )}
      </main>

      {/* 3. Sticky Bottom Action & Animated Feedback Drawer */}
      <ExerciseBottomFeedbackDrawer
        status={evaluationStatus}
        isAnswerReady={isAnswerReady}
        onCheckAnswer={handleCheckAnswer}
        onNextQuestion={handleNextQuestion}
        onOpenExplanation={() => setIsExplanationOpen(true)}
        correctAnswerSummary={getCorrectAnswerSummary()}
      />

      {/* 4. Explanation Modal (Opened via "Đáp án & Giải thích" button on error) */}
      <QuestionExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        question={currentQuestion}
        correctAnswerSummary={getCorrectAnswerSummary()}
      />
    </div>
  )
}
