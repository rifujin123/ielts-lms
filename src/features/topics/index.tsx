import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Film,
  Headphones,
  Play,
  Clock,
  Award,
  Sparkles,
  FileText,
  Search,
  MessagesSquare,
  Mic,
  Music,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react'
import { LESSON_DATABASE } from '@/features/dictation/constants/mockLessons'
import type { DictationLesson } from '@/features/dictation/types'

interface CategoryMeta {
  id: string
  name: string
  icon: LucideIcon
  description: string
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: 'Movie Short Clip',
    name: 'Movie Short Clip',
    icon: Film,
    description: 'Classic animation & movie trailers with natural intonation.',
  },
  {
    id: 'Daily Conversation',
    name: 'Daily Conversation',
    icon: MessagesSquare,
    description: 'Everyday conversations: travel, dining, shopping, and real-life situations.',
  },
  {
    id: 'IPA & Pronunciation',
    name: 'IPA & Pronunciation',
    icon: Mic,
    description: 'Master vowels, consonants, and connected speech techniques.',
  },
  {
    id: 'US-UK Songs',
    name: 'US-UK Songs',
    icon: Music,
    description: 'Practice dictation with melodic, clearly articulated acoustic tracks.',
  },
]

export const TopicsPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const allLessons = Object.values(LESSON_DATABASE)

  const handleStartDictation = (lessonId: string) => {
    navigate(`/topics/dictation/${lessonId}`)
  }

  // Filter lessons based on search query
  const searchFilteredLessons = allLessons.filter((lesson) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      lesson.title.toLowerCase().includes(query) ||
      (lesson.description && lesson.description.toLowerCase().includes(query)) ||
      (lesson.category && lesson.category.toLowerCase().includes(query))
    )
  })

  // Visible categories depending on tab selection
  const activeCategories =
    selectedCategory === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((cat) => cat.name === selectedCategory)

  // Render an individual lesson card
  const renderLessonCard = (lesson: DictationLesson) => (
    <div
      key={lesson.id}
      onClick={() => handleStartDictation(lesson.id)}
      className="card-interactive group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs hover:border-primary cursor-pointer transition-all"
    >
      {/* 16:9 Thumbnail Image with Hover Play Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <img
          src={
            lesson.thumbnailUrl || `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg`
          }
          alt={lesson.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play Icon Badge */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-6 w-6 ml-0.5" strokeWidth={2.5} />
          </div>
        </div>

        {/* Top Badge: Category */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
            {lesson.category}
          </span>
        </div>

        {/* Bottom Badges: Duration & Sentence count */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold text-white">
          <span className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 font-mono">
            <Clock className="h-3 w-3 text-sky-400" />
            {lesson.duration || '0:30'}
          </span>
          <span className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5">
            <FileText className="h-3 w-3 text-emerald-400" />
            {lesson.sentences.length} sentences
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Level Pill */}
        <div className="mb-2 flex items-center gap-1 text-[11px] font-bold text-secondary">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>{lesson.level || 'B1 - Intermediate'}</span>
        </div>

        {/* Title */}
        <h3 className="text-label-md font-bold text-on-surface line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-body-sm text-secondary line-clamp-2 flex-1 leading-relaxed">
          {lesson.description}
        </p>

        {/* Action CTA Row */}
        <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span>{lesson.sentences.length} sentences</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleStartDictation(lesson.id)
            }}
            className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-label-sm font-bold text-on-primary shadow-xs hover:bg-primary-hover transition-colors"
          >
            <Headphones className="h-4 w-4" strokeWidth={2} />
            <span>Practice</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8">
      {/* ── Hero Banner ── */}
      <div className="animate-fade-in-up stagger-1 relative overflow-hidden rounded-3xl border border-outline-variant bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-container/20 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
            <span>Interactive Video Dictation Library</span>
          </div>
          <h1 className="text-display-hero-mobile sm:text-display-hero font-extrabold tracking-tight text-on-surface">
            Listening Topics
          </h1>
          <p className="text-body-md text-secondary leading-relaxed">
            Choose from a diverse collection of movie clips, everyday conversations, IPA
            pronunciation drills, and acoustic songs to master English dictation and build natural
            listening reflexes.
          </p>
        </div>

        {/* Decorative background badge */}
        <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10 dark:opacity-5">
          <Film className="h-64 w-64 text-primary" />
        </div>
      </div>

      {/* ── Category Filter Pills & Search Bar ── */}
      <div className="animate-fade-in-up stagger-2 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All tab */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`btn-interactive flex items-center gap-2 rounded-full px-4 py-2 text-label-sm font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'border border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={2} />
            <span>All Topics</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
              {allLessons.length}
            </span>
          </button>

          {/* Dynamic category tabs */}
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const count = allLessons.filter((l) => l.category === cat.name).length
            const isActive = selectedCategory === cat.name
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`btn-interactive flex items-center gap-2 rounded-full px-4 py-2 text-label-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'border border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span>{cat.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-container-high text-secondary'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, topics, keywords..."
            className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface placeholder:text-secondary/50 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* ── Category Rows (Multi-row 4x3 Grid) ── */}
      <div className="flex flex-col gap-10">
        {activeCategories.map((cat) => {
          const Icon = cat.icon
          const categoryLessons = searchFilteredLessons.filter((l) => l.category === cat.name)

          if (categoryLessons.length === 0) return null

          return (
            <div key={cat.id} className="animate-fade-in-up flex flex-col gap-4">
              {/* Category Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-primary">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="text-title-md font-bold text-on-surface flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="text-xs font-semibold text-secondary rounded-full bg-surface-container-high px-2 py-0.5">
                        {categoryLessons.length} {categoryLessons.length === 1 ? 'video' : 'videos'}
                      </span>
                    </h2>
                    <p className="text-body-sm text-secondary line-clamp-1">{cat.description}</p>
                  </div>
                </div>

                {selectedCategory === 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className="text-label-sm font-semibold text-primary hover:underline"
                  >
                    View all {cat.name} →
                  </button>
                )}
              </div>

              {/* 3-Column Video Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryLessons.map((lesson) => renderLessonCard(lesson))}
              </div>
            </div>
          )
        })}

        {/* Empty State */}
        {searchFilteredLessons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-secondary">
            <Film className="h-12 w-12 stroke-1 text-secondary/40 mb-3" />
            <h3 className="text-label-lg font-bold text-on-surface">No videos found</h3>
            <p className="text-body-sm mt-1">Please try searching with different keywords.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopicsPage
