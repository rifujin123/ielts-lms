import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, RotateCcw, Clock, CheckCircle2, Volume2 } from 'lucide-react'
import type { SpeakingExamSkill } from '../types/fullExam.types'
import { useFullExamStore } from '../store/fullExamStore'

interface SpeakingRunnerProps {
  skillData: SpeakingExamSkill
}

export const SpeakingRunner: React.FC<SpeakingRunnerProps> = ({ skillData }) => {
  const [activePart, setActivePart] = useState<1 | 2 | 3>(1)
  const { speakingRecordings, setSpeakingRecording } = useFullExamStore()

  // Part 2 Prep Timer State (60s prep, 120s speak)
  const [prepSeconds, setPrepSeconds] = useState<number>(60)
  const [isPrepActive, setIsPrepActive] = useState<boolean>(false)
  const [scratchNotes, setScratchNotes] = useState<string>('')

  // Recording State (MediaRecorder)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Part 2 prep countdown interval
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPrepActive && prepSeconds > 0) {
      timer = setInterval(() => setPrepSeconds((s) => s - 1), 1000)
    } else if (prepSeconds === 0 && isPrepActive) {
      setIsPrepActive(false)
    }
    return () => clearInterval(timer)
  }, [isPrepActive, prepSeconds])

  // Recording countdown
  useEffect(() => {
    let recTimer: NodeJS.Timeout
    if (isRecording) {
      recTimer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000)
    }
    return () => clearInterval(recTimer)
  }, [isRecording])

  // Start microphone recording using browser native API
  const handleStartRecording = async (partId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setSpeakingRecording(partId, url, recordingSeconds)
        stream.getTracks().forEach((track) => track.stop())
      }

      recorder.start()
      setIsRecording(true)
      setRecordingSeconds(0)
    } catch (err) {
      console.warn('Microphone permission not granted:', err)
      // Fallback: simulated recording if no mic hardware
      setIsRecording(true)
      setRecordingSeconds(0)
    }
  }

  const handleStopRecording = (partId: number) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    } else {
      // Simulated audio blob
      setSpeakingRecording(partId, 'simulated-audio.mp3', recordingSeconds)
    }
    setIsRecording(false)
  }

  const existingRecording = speakingRecordings[activePart]

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-100 p-6 md:p-8 custom-scrollbar">
      <div className="mx-auto max-w-4xl w-full space-y-6">
        {/* ── Top Part Selector Bar ───────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((partNum) => {
              const isActive = activePart === partNum
              const hasRecorded = !!speakingRecordings[partNum]
              return (
                <button
                  key={partNum}
                  type="button"
                  onClick={() => setActivePart(partNum as 1 | 2 | 3)}
                  className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>Part {partNum}</span>
                  {hasRecorded && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                </button>
              )
            })}
          </div>

          <div className="text-xs font-semibold text-slate-500">Thời lượng chuẩn: 11 – 14 phút</div>
        </div>

        {/* ── PART 1: Introduction & Interview ──────────────────────── */}
        {activePart === 1 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 uppercase">
                SPEAKING PART 1 (4–5 PHÚT)
              </span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{skillData.part1.topic}</h2>
              <p className="mt-1 text-xs text-slate-500">{skillData.part1.description}</p>
            </div>

            <div className="space-y-3">
              {skillData.part1.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-800">
                    {idx + 1}
                  </span>
                  <div className="text-sm font-medium text-slate-800 pt-0.5">{q.text}</div>
                </div>
              ))}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isRecording ? 'animate-pulse bg-red-600 text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {isRecording ? 'Đang ghi âm câu trả lời...' : 'Thu âm phần thi Part 1'}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Thời lượng: {Math.floor(recordingSeconds / 60)}:
                    {String(recordingSeconds % 60).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => handleStartRecording(1)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
                >
                  <Mic className="h-4 w-4" />
                  <span>Bắt đầu thu âm</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStopRecording(1)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-600 shadow-xs"
                >
                  <Square className="h-4 w-4" />
                  <span>Dừng & Lưu bài</span>
                </button>
              )}
            </div>

            {existingRecording && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Đã ghi âm thành công ({existingRecording.duration} giây)</span>
                </div>
                {existingRecording.blobUrl !== 'simulated-audio.mp3' && (
                  <audio controls src={existingRecording.blobUrl} className="h-8" />
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PART 2: Cue Card & Long Turn ──────────────────────────── */}
        {activePart === 2 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 uppercase">
                SPEAKING PART 2 (CUE CARD)
              </span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Candidate Task Card: {skillData.part2.topicTitle}
              </h2>
            </div>

            {/* Official Cue Card Box */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-6">
              <h3 className="text-base font-bold text-slate-900 mb-3">You should say:</h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                {skillData.part2.cueCardPoints.map((pt, i) => (
                  <li key={i} className="leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs font-semibold text-slate-500 italic">
                You will have to talk about the topic for one to two minutes. You have one minute to
                think about what you are going to say. You can make some notes to help you if you
                wish.
              </div>
            </div>

            {/* 1-Minute Prep Countdown & Scratchpad */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Thời gian chuẩn bị (1 phút suy nghĩ và ghi nháp)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    00:{String(prepSeconds).padStart(2, '0')}
                  </span>
                  {!isPrepActive && prepSeconds > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsPrepActive(true)}
                      className="btn-interactive flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Bắt đầu 1 phút</span>
                    </button>
                  )}
                  {prepSeconds === 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPrepSeconds(60)
                        setIsPrepActive(false)
                      }}
                      className="btn-interactive flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Đặt lại</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={scratchNotes}
                onChange={(e) => setScratchNotes(e.target.value)}
                placeholder="Ghi nhanh các ý chính/keywords nháp cho bài nói Part 2 tại đây..."
                className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Part 2 Recording */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isRecording ? 'animate-pulse bg-red-600 text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {isRecording ? 'Đang ghi âm bài nói 2 phút...' : 'Ghi âm Part 2 (Long turn)'}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Thời lượng nói: {Math.floor(recordingSeconds / 60)}:
                    {String(recordingSeconds % 60).padStart(2, '0')} / 02:00
                  </div>
                </div>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => handleStartRecording(2)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
                >
                  <Mic className="h-4 w-4" />
                  <span>Bắt đầu nói (2 phút)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStopRecording(2)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-600 shadow-xs"
                >
                  <Square className="h-4 w-4" />
                  <span>Dừng & Lưu bài</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── PART 3: Two-Way Discussion ────────────────────────────── */}
        {activePart === 3 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 uppercase">
                SPEAKING PART 3 (4–5 PHÚT)
              </span>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Discussion Topic: {skillData.part3.discussionTopic}
              </h2>
            </div>

            <div className="space-y-4">
              {skillData.part3.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <div className="text-sm font-bold text-slate-900 pt-0.5 leading-relaxed">
                      {q.text}
                    </div>
                  </div>
                  {q.guidance && (
                    <div className="ml-9 rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200/60 flex items-start gap-2">
                      <Volume2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{q.guidance}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Part 3 Recording */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-5 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    isRecording ? 'animate-pulse bg-red-600 text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {isRecording ? 'Đang ghi âm Part 3...' : 'Thu âm phần thảo luận Part 3'}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Thời lượng: {Math.floor(recordingSeconds / 60)}:
                    {String(recordingSeconds % 60).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={() => handleStartRecording(3)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
                >
                  <Mic className="h-4 w-4" />
                  <span>Bắt đầu thu âm</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStopRecording(3)}
                  className="btn-interactive flex items-center gap-2 rounded-xl bg-slate-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-600 shadow-xs"
                >
                  <Square className="h-4 w-4" />
                  <span>Dừng & Lưu bài</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
