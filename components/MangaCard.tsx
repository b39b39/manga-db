'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Star, BookOpen, CheckCircle2, PauseCircle } from 'lucide-react'
import type { Manga } from '@/lib/types'

interface MangaCardProps {
  manga: Manga
  index: number
  onClick: () => void
}

const STATE_CONFIG = {
  ongoing:   { label: '연재', icon: BookOpen,     color: 'text-emerald-400' },
  completed: { label: '완결', icon: CheckCircle2, color: 'text-blue-400'    },
  hiatus:    { label: '휴재', icon: PauseCircle,  color: 'text-amber-400'   },
}

function rateTitleHoverClass(n: number): string {
  if (n >= 9.0) return 'group-hover:text-violet-400'
  if (n >= 7.5) return 'group-hover:text-blue-400'
  if (n >= 6.0) return 'group-hover:text-emerald-400'
  if (n >= 4.0) return 'group-hover:text-amber-400'
  return 'group-hover:text-rose-400'
}

export function rateNum(rate: number | string) {
  return parseFloat(String(rate))
}

export function rateColor(n: number): string {
  if (n >= 9.0) return 'text-violet-400'
  if (n >= 7.5) return 'text-blue-400'
  if (n >= 6.0) return 'text-emerald-400'
  if (n >= 4.0) return 'text-amber-400'
  return 'text-rose-400'
}

export function rateBarColor(n: number): string {
  if (n >= 9.0) return 'bg-violet-500'
  if (n >= 7.5) return 'bg-blue-500'
  if (n >= 6.0) return 'bg-emerald-500'
  if (n >= 4.0) return 'bg-amber-500'
  return 'bg-rose-500'
}

function RateBadge({ rate }: { rate: number | string }) {
  const n = rateNum(rate)
  const color = rateColor(n)
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${color}`}>
      <Star className="w-3 h-3" fill="currentColor" />
      {n.toFixed(1)}
    </span>
  )
}

export default function MangaCard({ manga, index, onClick }: MangaCardProps) {
  const stateConf  = STATE_CONFIG[manga.state]
  const StateIcon  = stateConf.icon
  const n          = rateNum(manga.rate)
  const accentClass = rateBarColor(n)

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ scale: 1.003 }}
      onClick={onClick}
      className="group relative flex items-stretch rounded-xl border border-white/8
                 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden
                 hover:border-white/20 hover:bg-card/80 hover:shadow-md
                 transition-colors duration-150 cursor-pointer"
    >
      {/* Left accent — rate color on hover, sits above icon */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 z-10 opacity-0
                       group-hover:opacity-100 transition-opacity ${accentClass}`} />

      {/* Icon — flush left/top/bottom, full card height */}
      <div className="relative flex-shrink-0 w-16 bg-white/5">
        {manga.icon ? (
          <Image src={manga.icon} alt={manga.name} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <BookOpen className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Content: title row + tags row */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 px-4 py-3">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <p className={`flex-1 font-semibold text-sm truncate text-foreground transition-colors ${rateTitleHoverClass(n)}`}>
            {manga.name}
          </p>
          {/* State badge */}
          <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium ${stateConf.color}`}>
            <StateIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{stateConf.label}</span>
          </div>
        </div>

        {/* Bottom row: genre chips + rate */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 flex-wrap">
            {manga.genre.slice(0, 4).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-normal bg-white/8
                           text-muted-foreground border-white/10"
              >
                {g}
              </Badge>
            ))}
            {manga.genre.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{manga.genre.length - 4}</span>
            )}
          </div>
          <div className="ml-auto flex-shrink-0">
            <RateBadge rate={manga.rate} />
          </div>
        </div>
      </div>
    </motion.article>
  )
}
