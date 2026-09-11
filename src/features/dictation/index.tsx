import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from '@/shared/components/Toast/toastStore'
import type {
  DictationLesson,
  DictationMode,
  SavedVocabWord,
  UserSentenceAttempt,
  DictionaryEntry,
} from './types'
import { LESSON_DATABASE, DEFAULT_LESSON } from './constants/mockLessons'
import { DictationHeader } from './components/DictationHeader'
import { VideoPlayerColumn } from './components/VideoPlayerColumn'
import { DictationPracticeColumn } from './components/DictationPracticeColumn'
import { TranscriptColumn } from './components/TranscriptColumn'
import { DictionaryModal } from './components/DictionaryModal'
import { VocabNotebookModal } from './components/VocabNotebookModal'

interface YTPlayerInstance {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
  getVolume: () => number
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  destroy: () => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          height: string
          width: string
          videoId: string
          playerVars: Record<string, unknown>
          events: {
            onReady?: () => void
            onStateChange?: (event: { data: number }) => void
          }
        },
      ) => YTPlayerInstance
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export const DictationPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>()
  const navigate = useNavigate()

  // Lesson state
  const initialLesson = (lessonId && LESSON_DATABASE[lessonId]) || DEFAULT_LESSON
  const [currentLesson, setCurrentLesson] = useState<DictationLesson>(initialLesson)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0)
  const [difficultyMode, setDifficultyMode] = useState<DictationMode>('easy')
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [autoLoop, setAutoLoop] = useState<boolean>(true)
  const [userAttempts, setUserAttempts] = useState<Record<number, UserSentenceAttempt>>({})

  // Column visibility state (Requested 3-column toggles)
  const [isMediaHidden, setIsMediaHidden] = useState<boolean>(false)
  const [isTranscriptHidden, setIsTranscriptHidden] = useState<boolean>(false)

  // YouTube player state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playedSec, setPlayedSec] = useState<number>(0)
  const [durationSec, setDurationSec] = useState<number>(0)
  const [volume, setVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLoadingPlayer, setIsLoadingPlayer] = useState<boolean>(true)
  const playerRef = useRef<YTPlayerInstance | null>(null)
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Modals state
  const [dictWord, setDictWord] = useState<string>('')
  const [isDictOpen, setIsDictOpen] = useState<boolean>(false)
  const [isNotebookOpen, setIsNotebookOpen] = useState<boolean>(false)
  const [savedNotebook, setSavedNotebook] = useState<SavedVocabWord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lms_vocab_notebook') || '[]')
    } catch {
      return []
    }
  })

  const activeSentence = currentLesson.sentences[activeSentenceIndex] || currentLesson.sentences[0]

  // Initialize YouTube Iframe API
  useEffect(() => {
    const loadScript = () => {
      if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(tag)
      }
    }

    loadScript()

    const checkReady = () => {
      if (window.YT && window.YT.Player) {
        initPlayer(currentLesson.youtubeId)
      } else {
        window.onYouTubeIframeAPIReady = () => {
          initPlayer(currentLesson.youtubeId)
        }
      }
    }

    checkReady()

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch {
          // ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initPlayer = (videoId: string) => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy()
      } catch {
        // ignore
      }
    }

    if (!window.YT) return

    playerRef.current = new window.YT.Player('youtubePlayer', {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        fs: 0,
      },
      events: {
        onReady: () => {
          setIsLoadingPlayer(false)
          playerRef.current?.setPlaybackRate(playbackSpeed)
          playerRef.current?.setVolume(volume)
          if (isMuted) {
            playerRef.current?.mute()
          }
          seekToSegment(activeSentenceIndex)
        },
        onStateChange: (event) => {
          if (event.data === window.YT?.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else {
            setIsPlaying(false)
          }
        },
      },
    })
  }

  // Seek video to specific segment
  const seekToSegment = useCallback(
    (index: number) => {
      const seg = currentLesson.sentences[index]
      if (seg && playerRef.current) {
        playerRef.current.seekTo(seg.start, true)
      }
    },
    [currentLesson.sentences],
  )

  // Polling loop to keep video strictly within the segment
  useEffect(() => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current)

    pollTimerRef.current = setInterval(() => {
      if (!playerRef.current || !playerRef.current.getCurrentTime) return

      const cur = playerRef.current.getCurrentTime()
      const seg = currentLesson.sentences[activeSentenceIndex]
      if (!seg) return

      const segDuration = Math.max(0, seg.end - seg.start)
      const curPlayed = Math.max(0, cur - seg.start)
      setPlayedSec(curPlayed)
      setDurationSec(segDuration)

      // Segment boundary reached
      if (isPlaying && cur >= seg.end) {
        if (autoLoop && !userAttempts[activeSentenceIndex]?.correct) {
          playerRef.current.seekTo(seg.start, true)
        } else {
          playerRef.current.pauseVideo()
          setIsPlaying(false)
        }
      }
    }, 100)

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current)
    }
  }, [activeSentenceIndex, isPlaying, autoLoop, userAttempts, currentLesson.sentences])

  // Toggle Play / Pause segment
  const handleTogglePlay = useCallback(() => {
    if (!playerRef.current) return
    const seg = currentLesson.sentences[activeSentenceIndex]
    if (!seg) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      const cur = playerRef.current.getCurrentTime()
      if (cur < seg.start || cur >= seg.end) {
        playerRef.current.seekTo(seg.start, true)
      }
      playerRef.current.playVideo()
    }
  }, [isPlaying, activeSentenceIndex, currentLesson.sentences])

  // Replay current segment
  const handleReplay = useCallback(() => {
    if (!playerRef.current) return
    const seg = currentLesson.sentences[activeSentenceIndex]
    if (!seg) return
    playerRef.current.seekTo(seg.start, true)
    playerRef.current.playVideo()
  }, [activeSentenceIndex, currentLesson.sentences])

  // Navigate sentences
  const handleSelectSentence = useCallback(
    (index: number) => {
      setActiveSentenceIndex(index)
      seekToSegment(index)
    },
    [seekToSegment],
  )

  const handlePrevSentence = () => {
    if (activeSentenceIndex > 0) {
      handleSelectSentence(activeSentenceIndex - 1)
    }
  }

  const handleNextSentence = () => {
    if (activeSentenceIndex < currentLesson.sentences.length - 1) {
      handleSelectSentence(activeSentenceIndex + 1)
    } else {
      toast.success('Congratulations! You have completed this listening lesson.')
    }
  }

  // Volume and mute controls
  const handleChangeVolume = useCallback(
    (val: number) => {
      setVolume(val)
      if (playerRef.current) {
        playerRef.current.setVolume(val)
        if (val > 0 && isMuted) {
          playerRef.current.unMute()
          setIsMuted(false)
        }
      }
    },
    [isMuted],
  )

  const handleToggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
        playerRef.current.setVolume(volume || 100)
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  // Change lesson
  const handleSelectLesson = useCallback(
    (targetId: string) => {
      const lesson = LESSON_DATABASE[targetId]
      if (lesson) {
        setCurrentLesson(lesson)
        setActiveSentenceIndex(0)
        setUserAttempts({})
        setIsLoadingPlayer(true)
        initPlayer(lesson.youtubeId)
        navigate(`/topics/dictation/${targetId}`, { replace: true })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigate],
  )

  useEffect(() => {
    if (
      lessonId &&
      LESSON_DATABASE[lessonId] &&
      LESSON_DATABASE[lessonId].id !== currentLesson.id
    ) {
      handleSelectLesson(lessonId)
    }
  }, [lessonId, handleSelectLesson, currentLesson.id])

  // Check answer callback
  const handleCheckAnswer = (isCorrect: boolean) => {
    setUserAttempts((prev) => ({
      ...prev,
      [activeSentenceIndex]: {
        correct: isCorrect,
        userInput: '',
      },
    }))

    if (isCorrect) {
      toast.success(`Correct! Completed sentence #${activeSentenceIndex + 1}`)
    } else {
      toast.error('Not quite correct. Click "Replay" to listen again!')
    }
  }

  // Reset current lesson progress
  const handleResetLesson = () => {
    if (window.confirm('Are you sure you want to restart this entire lesson from the beginning?')) {
      setUserAttempts({})
      setActiveSentenceIndex(0)
      seekToSegment(0)
      toast.info('Lesson progress has been reset')
    }
  }

  // Dictionary modal handler
  const handleWordClick = (word: string) => {
    setDictWord(word)
    setIsDictOpen(true)
  }

  // Save to notebook
  const handleSaveToNotebook = (entry: DictionaryEntry, word: string) => {
    const exists = savedNotebook.some((item) => item.word.toLowerCase() === word.toLowerCase())
    if (!exists) {
      const updated: SavedVocabWord[] = [
        ...savedNotebook,
        {
          word,
          pos: entry.pos,
          ipa: entry.ipa,
          vi: entry.vi,
          date: new Date().toLocaleDateString('en-US'),
        },
      ]
      setSavedNotebook(updated)
      localStorage.setItem('lms_vocab_notebook', JSON.stringify(updated))
      toast.success(`Saved "${word}" to Vocabulary Notebook!`)
    }
  }

  // Delete notebook word
  const handleDeleteNotebookWord = (idx: number) => {
    const updated = savedNotebook.filter((_, i) => i !== idx)
    setSavedNotebook(updated)
    localStorage.setItem('lms_vocab_notebook', JSON.stringify(updated))
  }

  // Clear all notebook words
  const handleClearAllNotebook = () => {
    if (window.confirm('Are you sure you want to clear all saved vocabulary?')) {
      setSavedNotebook([])
      localStorage.removeItem('lms_vocab_notebook')
      toast.info('All saved vocabulary cleared')
    }
  }

  // Global Keyboard Shortcuts: Tab for play/pause, R for replay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        handleTogglePlay()
      }
      if (
        (e.key === 'r' || e.key === 'R') &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        handleReplay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTogglePlay, handleReplay])

  const completedCount = Object.values(userAttempts).filter((a) => a.correct).length
  const currentAttempt = userAttempts[activeSentenceIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* ── Top Header Bar & Column Toggles ── */}
      <DictationHeader
        lessonTitle={currentLesson.title}
        lessonCategory={currentLesson.category}
        isMediaHidden={isMediaHidden}
        onToggleMedia={() => setIsMediaHidden((prev) => !prev)}
        isTranscriptHidden={isTranscriptHidden}
        onToggleTranscript={() => setIsTranscriptHidden((prev) => !prev)}
        completedCount={completedCount}
        totalCount={currentLesson.sentences.length}
        vocabCount={savedNotebook.length}
        onOpenNotebook={() => setIsNotebookOpen(true)}
        onBackToTopics={() => navigate('/topics')}
      />

      {/* ── Main Dynamic 3-Column Adaptive Workspace ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* CỘT 1: VIDEO (MEDIA) */}
        {!isMediaHidden && (
          <div
            className={`transition-all duration-300 flex-shrink-0 ${
              isTranscriptHidden ? 'w-full lg:w-[40%]' : 'w-full lg:w-[32%]'
            }`}
          >
            <VideoPlayerColumn
              activeSentenceIndex={activeSentenceIndex}
              totalSentences={currentLesson.sentences.length}
              isPlaying={isPlaying}
              playedSec={playedSec}
              durationSec={durationSec}
              playbackSpeed={playbackSpeed}
              autoLoop={autoLoop}
              isLoading={isLoadingPlayer}
              volume={volume}
              isMuted={isMuted}
              onTogglePlay={handleTogglePlay}
              onReplay={handleReplay}
              onPrevSentence={handlePrevSentence}
              onNextSentence={handleNextSentence}
              onChangeSpeed={(spd) => {
                setPlaybackSpeed(spd)
                playerRef.current?.setPlaybackRate(spd)
              }}
              onToggleAutoLoop={(loop) => setAutoLoop(loop)}
              onChangeVolume={handleChangeVolume}
              onToggleMute={handleToggleMute}
            />
          </div>
        )}

        {/* CỘT 2: DICTATION (ĐIỀN NHỮNG GÌ ĐÃ NGHE) */}
        <div
          className={`flex-1 transition-all duration-300 min-w-0 ${
            isMediaHidden && isTranscriptHidden ? 'max-w-4xl w-full mx-auto' : ''
          }`}
        >
          <DictationPracticeColumn
            sentence={activeSentence}
            mode={difficultyMode}
            onChangeMode={(m) => setDifficultyMode(m)}
            isMediaHidden={isMediaHidden}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            activeSentenceIndex={activeSentenceIndex}
            totalSentences={currentLesson.sentences.length}
            isAnswered={!!currentAttempt}
            isCorrect={currentAttempt ? currentAttempt.correct : null}
            onCheckAnswer={handleCheckAnswer}
            onNextSentence={handleNextSentence}
            onWordClick={handleWordClick}
          />
        </div>

        {/* CỘT 3: TRANSCRIPT */}
        {!isTranscriptHidden && (
          <div
            className={`transition-all duration-300 flex-shrink-0 min-w-0 ${
              isMediaHidden ? 'w-full lg:w-[36%]' : 'w-full lg:w-[32%]'
            }`}
          >
            <TranscriptColumn
              sentences={currentLesson.sentences}
              activeSentenceIndex={activeSentenceIndex}
              userAttempts={userAttempts}
              onSelectSentence={handleSelectSentence}
              onWordClick={handleWordClick}
              onResetLesson={handleResetLesson}
            />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <DictionaryModal
        isOpen={isDictOpen}
        word={dictWord}
        onClose={() => setIsDictOpen(false)}
        onSaveToNotebook={handleSaveToNotebook}
        isAlreadySaved={savedNotebook.some(
          (w) => w.word.toLowerCase() === dictWord.toLowerCase().replace(/[^a-z]/g, ''),
        )}
      />

      <VocabNotebookModal
        isOpen={isNotebookOpen}
        words={savedNotebook}
        onClose={() => setIsNotebookOpen(false)}
        onDeleteWord={handleDeleteNotebookWord}
        onClearAll={handleClearAllNotebook}
      />
    </div>
  )
}

export default DictationPage
