'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownAZ, ArrowUpAZ, X } from 'lucide-react'
import type { FilterParams } from '@/lib/types'

type SearchBy  = NonNullable<FilterParams['searchBy']>
type SortByF   = NonNullable<FilterParams['sortBy']>
type SortOrderF = NonNullable<FilterParams['sortOrder']>

interface FilterControlsProps {
  searchBy:     SearchBy
  sortBy:       SortByF
  sortOrder:    SortOrderF
  selectedTags: string[]
  onSearchByChange:  (v: SearchBy)    => void
  onSortByChange:    (v: SortByF)     => void
  onSortOrderChange: (v: SortOrderF)  => void
  onTagsChange:      (tags: string[]) => void
}

export default function FilterControls({
  searchBy, sortBy, sortOrder, selectedTags,
  onSearchByChange, onSortByChange, onSortOrderChange, onTagsChange,
}: FilterControlsProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/tags')
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setAvailableTags(data) : null)
      .catch(() => null)
  }, [])

  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Sort / search-by controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={searchBy} onValueChange={(v) => { if (v) onSearchByChange(v as SearchBy) }}>
          <SelectTrigger className="w-[110px] h-9 text-xs bg-white/5 border-white/10
                                    focus:ring-0 focus:border-white/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-white/10">
            <SelectItem value="name"   className="text-xs">제목</SelectItem>
            <SelectItem value="author" className="text-xs">작가</SelectItem>
            <SelectItem value="genre"  className="text-xs">장르</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => { if (v) onSortByChange(v as SortByF) }}>
          <SelectTrigger className="w-[120px] h-9 text-xs bg-white/5 border-white/10
                                    focus:ring-0 focus:border-white/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-white/10">
            <SelectItem value="updated" className="text-xs">최근 업데이트</SelectItem>
            <SelectItem value="created" className="text-xs">등록일</SelectItem>
            <SelectItem value="rate"    className="text-xs">평점</SelectItem>
            <SelectItem value="name"    className="text-xs">제목</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="h-9 w-9 flex items-center justify-center rounded-md border border-white/10
                     bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/30
                     transition-colors"
          title={sortOrder === 'desc' ? '내림차순' : '오름차순'}
        >
          {sortOrder === 'desc'
            ? <ArrowDownAZ className="w-4 h-4" />
            : <ArrowUpAZ   className="w-4 h-4" />}
        </button>
      </div>

      {/* Tag chips (AND intersection filter) */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {availableTags.map(tag => {
            const active = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={[
                  'px-2.5 py-0.5 rounded-full text-xs border transition-colors',
                  active
                    ? 'bg-primary/20 border-primary text-foreground font-semibold'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground',
                ].join(' ')}
              >
                {tag}
              </button>
            )
          })}
          {selectedTags.length > 0 && (
            <button
              onClick={() => onTagsChange([])}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border
                         border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30
                         transition-colors ml-1"
              title="태그 필터 초기화"
            >
              <X className="w-3 h-3" /> 초기화
            </button>
          )}
        </div>
      )}
    </div>
  )
}
