'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Star, BookOpen, CheckCircle2, PauseCircle, User, Calendar } from 'lucide-react'
import type { Manga, MangaAuthor } from '@/lib/types'
import { rateNum, rateBarColor } from './MangaCard'

/**
 * 작가 배열을 정렬 후 포맷합니다.
 * 순서: writer → illustrator → 속성없음, 그룹 내 사전순
 * 출력: "A, B (글) / C, D (그림) / E"
 */
function formatAuthors(authors: MangaAuthor[], fallback: string[]): string {
  if (!authors || authors.length === 0) return fallback.join(', ')
  const sort = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b, 'ko'))
  const writers      = sort(authors.filter(a => a.role === 'writer').map(a => a.name))
  const illustrators = sort(authors.filter(a => a.role === 'illustrator').map(a => a.name))
  const others       = sort(authors.filter(a => a.role === '').map(a => a.name))
  const parts: string[] = []
  if (writers.length)      parts.push(`${writers.join(', ')} (글)`)
  if (illustrators.length) parts.push(`${illustrators.join(', ')} (그림)`)
  if (others.length)       parts.push(others.join(', '))
  return parts.join(' / ')
}

interface MangaModalProps {
  manga: Manga | null
  onClose: () => void
}

const STATE_CONFIG = {
  ongoing:   { label: '연재 중', icon: BookOpen,     color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  completed: { label: '완결됨',  icon: CheckCircle2, color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30' },
  hiatus:    { label: '휴재 중', icon: PauseCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30' },
}

function RatingBar({ rate }: { rate: number | string }) {
  const n = rateNum(rate)
  const pct = (n / 10) * 100
  const color = rateBarColor(n)
  return (
    <div className="flex items-center gap-3">
      <Star className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" />
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        />
      </div>
      <span className="text-sm font-bold tabular-nums w-8 text-right">{n.toFixed(1)}</span>
    </div>
  )
}

export default function MangaModal({ manga, onClose }: MangaModalProps) {
  if (!manga) return null
  const stateConf = STATE_CONFIG[manga.state]
  const StateIcon = stateConf.icon

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Dialog open={!!manga} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-white/10 gap-0 h-[80vh] max-h-[680px] flex flex-row">
        <DialogTitle className="sr-only">{manga.name}</DialogTitle>

        {/* Left column: cover image */}
        <div className="w-56 flex-shrink-0 relative bg-white/5">
          {manga.image ? (
            <Image
              src={manga.image}
              alt={manga.name}
              fill
              className="object-cover object-center"
              sizes="224px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <BookOpen className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10
                              bg-white/10 flex-shrink-0 shadow-lg">
                {manga.icon ? (
                  <Image src={manga.icon} alt={manga.name} fill className="object-cover" sizes="48px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
              </div>
              {/* Title + alias */}
              <div className="min-w-0">
                <h2 className="text-base font-bold leading-tight text-white">
                  {manga.name}
                </h2>
                {manga.alias.length > 0 && (
                  <p className="text-xs text-white/60 truncate mt-0.5">
                    {manga.alias.join(' · ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            {/* State badge + RatingBar */}
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                               rounded-full border flex-shrink-0 ${stateConf.color} ${stateConf.bg}`}>
                <StateIcon className="w-3.5 h-3.5" />
                {stateConf.label}
              </span>
              <div className="flex-1">
                <RatingBar rate={manga.rate} />
              </div>
            </div>

            {/* Authors */}
            <div className="flex items-start gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-foreground/80">
                {formatAuthors(manga.authors, manga.author)}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {manga.genre.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="text-xs px-2 py-0.5 bg-white/8 text-muted-foreground border-white/10"
                >
                  {g}
                </Badge>
              ))}
            </div>

            {/* Summary */}
            {manga.summary && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">줄거리</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{manga.summary}</p>
              </div>
            )}

            {/* Review */}
            {manga.review && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">리뷰</p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{manga.review}</p>
              </div>
            )}

            {/* Dates */}
            <div className="flex gap-4 text-xs text-muted-foreground border-t border-white/8 pt-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                등록일 {fmtDate(manga.created)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                업데이트 {fmtDate(manga.updated)}
              </span>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
