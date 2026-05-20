'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import type { FilterParams } from '@/lib/types'

interface FilterControlsProps {
  searchBy:  FilterParams['searchBy']
  sortBy:    FilterParams['sortBy']
  sortOrder: FilterParams['sortOrder']
  onSearchByChange:  (v: FilterParams['searchBy'])  => void
  onSortByChange:    (v: FilterParams['sortBy'])    => void
  onSortOrderChange: (v: FilterParams['sortOrder']) => void
}

export default function FilterControls({
  searchBy,
  sortBy,
  sortOrder,
  onSearchByChange,
  onSortByChange,
  onSortOrderChange,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search-by selector */}
      <Select value={searchBy} onValueChange={(v) => onSearchByChange(v as FilterParams['searchBy'])}>
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

      {/* Sort-by selector */}
      <Select value={sortBy} onValueChange={(v) => onSortByChange(v as FilterParams['sortBy'])}>
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

      {/* Sort order toggle */}
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
  )
}
