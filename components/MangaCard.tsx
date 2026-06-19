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
  ongoing:   { label: '연재중', icon: BookOpen,     color: 'text-emerald-400', accent: 'bg-emerald-500' },
  completed: { label: '완결',   icon: CheckCircle2, color: 'text-blue-400',    accent: 'bg-blue-500' },
  hiatus:    { label: '휴재',   icon: PauseCircle,  color: 'text-amber-400',   accent: 'bg-amber-500' },
}

export function rateNum(rate: number | string) {
  return parseFloat(String(rate))
}

function RateBadge({ rate }: { rate: number | string }) {
  const n = rateNum(rate)
  const color = n >= 8 ? 'text-emerald-400' : n >= 6 ? 'text-amber-400' : 'text-rose-400'
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold tabular-nums ${color}`}>
      <Star className="w-3 h-3" fill="currentColor" />
      {n.toFixed(1)}
    </span>
  )
}

export default function MangaCard({ manga, index, onClick }: MangaCardProps) {
  const stateConf = STATE_CONFIG[manga.state]
  const StateIcon = stateConf.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ scale: 1.003 }}
      onClick={onClick}
      className="group relative flex items-center gap-3 rounded-xl border border-white/8
                 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-sm
                 hover:border-white/20 hover:bg-card/80 hover:shadow-md
                 transition-colors duration-150 cursor-pointer"
    >
      {/* Left accent */}
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0
                       group-hover:opacity-100 transition-opacity ${stateConf.accent}`} />

      {/* Icon */}
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden
                      border border-white/10 bg-white/5">
        {manga.icon ? (
          <Image src={manga.icon} alt={manga.name} fill className="object-cover" sizes="40px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <BookOpen className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
          {manga.name}
        </p>
      </div>

      {/* Genres */}
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        {manga.genre.slice(0, 3).map((g) => (
          <Badge
            key={g}
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 font-normal bg-white/8
                       text-muted-foreground border-white/10"
          >
            {g}
          </Badge>
        ))}
        {manga.genre.length > 3 && (
          <span className="text-[10px] text-muted-foreground">+{manga.genre.length - 3}</span>
        )}
      </div>

      {/* State */}
      <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium ${stateConf.color}`}>
        <StateIcon className="w-3.5 h-3.5" />
        <span className="hidden md:inline">{stateConf.label}</span>
      </div>

      {/* Rate */}
      <RateBadge rate={manga.rate} />
    </motion.article>
  )
}
