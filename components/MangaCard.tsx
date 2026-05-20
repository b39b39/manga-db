'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, BookOpen, Clock, CheckCircle2, PauseCircle } from 'lucide-react'
import type { Manga } from '@/lib/types'

interface MangaCardProps {
  manga: Manga
  index: number
}

const STATE_CONFIG = {
  ongoing:   { label: '연재중',  icon: BookOpen,      color: 'text-emerald-400' },
  completed: { label: '완결',    icon: CheckCircle2,  color: 'text-blue-400' },
  hiatus:    { label: '휴재',    icon: PauseCircle,   color: 'text-amber-400' },
}

function RatingBar({ rate }: { rate: number }) {
  const pct = (rate / 10) * 100
  const color =
    rate >= 8 ? 'bg-emerald-500' :
    rate >= 6 ? 'bg-amber-500' :
                'bg-rose-500'

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums text-foreground/80 w-7 text-right">
        {rate.toFixed(1)}
      </span>
    </div>
  )
}

export default function MangaCard({ manga, index }: MangaCardProps) {
  const stateConf = STATE_CONFIG[manga.state]
  const StateIcon = stateConf.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ scale: 1.005 }}
      className="group relative flex items-stretch gap-4 rounded-xl border border-white/8
                 bg-card/60 backdrop-blur-sm px-4 py-3.5 shadow-md
                 hover:border-white/20 hover:bg-card/80 hover:shadow-lg
                 transition-colors duration-200 cursor-pointer"
    >
      {/* Icon thumbnail */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden
                      border border-white/10 bg-white/5 self-center">
        {manga.icon ? (
          <Image
            src={manga.icon}
            alt={manga.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20">
            <BookOpen className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Cover image (wider, hidden on small screens) */}
      <div className="relative hidden sm:block flex-shrink-0 w-24 h-[88px] rounded-lg
                      overflow-hidden border border-white/10 bg-white/5 self-center">
        {manga.image ? (
          <Image
            src={manga.image}
            alt={manga.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 min-w-0 py-0.5">
        {/* Top row: title + state */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-semibold text-base leading-tight truncate text-foreground
                           group-hover:text-primary transition-colors">
              {manga.name}
            </h2>
            {manga.alias.length > 0 && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {manga.alias.join(' · ')}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-1 flex-shrink-0 text-xs font-medium ${stateConf.color}`}>
            <StateIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{stateConf.label}</span>
          </div>
        </div>

        {/* Authors */}
        <p className="text-xs text-muted-foreground truncate">
          {manga.author.join(', ')}
        </p>

        {/* Summary */}
        <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
          {manga.summary}
        </p>

        {/* Bottom row: genres + rating */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <div className="flex flex-wrap gap-1 min-w-0">
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
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-normal bg-white/8
                           text-muted-foreground border-white/10"
              >
                +{manga.genre.length - 4}
              </Badge>
            )}
          </div>
          <RatingBar rate={manga.rate} />
        </div>
      </div>

      {/* Subtle left accent line */}
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-0
                       group-hover:opacity-100 transition-opacity
                       ${manga.state === 'ongoing' ? 'bg-emerald-500' :
                         manga.state === 'completed' ? 'bg-blue-500' : 'bg-amber-500'}`}
      />
    </motion.article>
  )
}
