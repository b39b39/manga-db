'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownAZ, ArrowUpAZ, X, SlidersHorizontal, Search } from 'lucide-react'
import type { FilterParams } from '@/lib/types'
import SearchBar from './SearchBar'

type SortByF    = NonNullable<FilterParams['sortBy']>
type SortOrderF = NonNullable<FilterParams['sortOrder']>

interface FilterControlsProps {
  query:              string
  onQueryChange:      (v: string) => void
  sortBy:             SortByF
  sortOrder:          SortOrderF
  selectedTags:       string[]
  authorQuery:        string
  onSortByChange:     (v: SortByF)     => void
  onSortOrderChange:  (v: SortOrderF)  => void
  onTagsChange:       (tags: string[]) => void
  onAuthorQueryChange:(v: string)      => void
}

export default function FilterControls({
  query, onQueryChange,
  sortBy, sortOrder, selectedTags, authorQuery,
  onSortByChange, onSortOrderChange, onTagsChange, onAuthorQueryChange,
}: FilterControlsProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [advancedOpen, setAdvancedOpen]   = useState(false)

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

  const hasAdvancedFilters = authorQuery.length > 0 || selectedTags.length > 0

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Main row */}
      <div className="flex items-center gap-2">
        {/* Title search */}
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder="제목 또는 별명 검색..."
        />

        {/* Sort by */}
        <Select value={sortBy} onValueChange={(v) => { if (v) onSortByChange(v as SortByF) }}>
          <SelectTrigger className="w-[120px] h-9 text-xs bg-white/5 border-white/10
                                    focus:ring-0 focus:border-white/30 flex-shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-white/10">
            <SelectItem value="updated" className="text-xs">최근 업데이트</SelectItem>
            <SelectItem value="created" className="text-xs">등록일</SelectItem>
            <SelectItem value="rate"    className="text-xs">평점</SelectItem>
            <SelectItem value="name"    className="text-xs">제목</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort order */}
        <button
          onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="h-9 w-9 flex items-center justify-center rounded-md border border-white/10
                     bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/30
                     transition-colors flex-shrink-0"
          title={sortOrder === 'desc' ? '내림차순' : '오름차순'}
        >
          {sortOrder === 'desc'
            ? <ArrowDownAZ className="w-4 h-4" />
            : <ArrowUpAZ   className="w-4 h-4" />}
        </button>

        {/* Advanced toggle */}
        <button
          onClick={() => setAdvancedOpen(o => !o)}
          className={[
            'relative h-9 w-9 flex items-center justify-center rounded-md border transition-colors flex-shrink-0',
            advancedOpen
              ? 'bg-primary/20 border-primary text-foreground'
              : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30',
          ].join(' ')}
          title="상세검색"
          aria-expanded={advancedOpen}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {hasAdvancedFilters && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      </div>

      {/* Collapsible advanced panel */}
      <div
        className={[
          'overflow-hidden transition-all duration-200',
          advancedOpen ? 'max-h-96' : 'max-h-0',
        ].join(' ')}
      >
        <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/3 px-4 py-3">

          {/* Author search */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-10 flex-shrink-0">작가명</span>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                value={authorQuery}
                onChange={e => onAuthorQueryChange(e.target.value)}
                placeholder="작가명 검색..."
                className="w-full pl-8 pr-8 h-8 rounded-md border border-white/10 bg-white/5
                           text-xs text-foreground placeholder:text-muted-foreground/60
                           focus:outline-none focus:border-white/30 transition-colors"
              />
              {authorQuery && (
                <button
                  onClick={() => onAuthorQueryChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground
                             hover:text-foreground transition-colors"
                  aria-label="작가명 초기화"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tag chips */}
          {availableTags.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground w-10 flex-shrink-0 pt-0.5">태그</span>
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
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
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
