'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Star, BookOpen, CheckCircle2, PauseCircle, User, Calendar } from 'lucide-react'
import type { Manga } from '@/lib/types'
import { rateNum } from './MangaCard'

interface MangaModalProps {
  manga: Manga | null
  onClose: () => void
}

const STATE_CONFIG = {
  ongoing:   { label: '연재중', icon: BookOpen,     color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  completed: { label: '완결',   icon: CheckCircle2, color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/30' },
  hiatus:    { label: '휴재',   icon: PauseCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/30' },
}

function RatingBar({ rate }: { rate: number | string }) {
  const n = rateNum(rate)
  const pct = (n / 10) * 100
  const color = n >= 8 ? 'bg-emerald-500' : n >= 6 ? 'bg-amber-500' : 'bg-rose-500'
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-white/10 gap-0">
        <DialogTitle className="sr-only">{manga.name}</DialogTitle>

        {/* Cover image header */}
        <div className="relative h-48 w-full bg-white/5 flex-shrink-0">
          {manga.image ? (
            <Image
              src={manga.image}
              alt={manga.name}
              fill
              className="object-cover"
              sizes="672px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <BookOpen className="w-16 h-16" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

          {/* Icon + title over the gradient */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white/20
                            bg-white/10 flex-shrink-0 shadow-lg">
              {manga.icon ? (
                <Image src={manga.icon} alt={manga.name} fill className="object-cover" sizes="56px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30">
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold leading-tight text-white drop-shadow">
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

        <ScrollArea className="max-h-[60vh]">
          <div className="px-5 py-4 space-y-5">

            {/* State + Rating */}
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1
                               rounded-full border ${stateConf.color} ${stateConf.bg}`}>
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
              <span className="text-foreground/80">{manga.author.join(', ')}</span>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
