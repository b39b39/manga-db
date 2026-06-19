'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MangaCard from './MangaCard'
import MangaModal from './MangaModal'
import type { Manga } from '@/lib/types'
import { BookOpen, Loader2 } from 'lucide-react'

interface MangaListProps {
  items:   Manga[]
  loading: boolean
}

export default function MangaList({ items, loading }: MangaListProps) {
  const [selected, setSelected] = useState<Manga | null>(null)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm">불러오는 중...</span>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground"
      >
        <BookOpen className="w-10 h-10 opacity-30" />
        <p className="text-sm">결과가 없습니다.</p>
      </motion.div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={items.map((m) => m.id).join(',')}
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {items.map((manga, i) => (
            <MangaCard
              key={manga.id}
              manga={manga}
              index={i}
              onClick={() => setSelected(manga)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      <MangaModal manga={selected} onClose={() => setSelected(null)} />
    </>
  )
}
