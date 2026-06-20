'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import SearchBar from '@/components/SearchBar'
import FilterControls from '@/components/FilterControls'
import MangaList from '@/components/MangaList'
import type { FilterParams, Manga } from '@/lib/types'
import { BookMarked } from 'lucide-react'

const DEFAULT_FILTER: Required<FilterParams> = {
  query:     '',
  searchBy:  'name',
  sortBy:    'updated',
  sortOrder: 'desc',
  tags:      [],
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function HomePage() {
  const [filter, setFilter]   = useState<Required<FilterParams>>(DEFAULT_FILTER)
  const [items,  setItems]    = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const abortRef = useRef<AbortController | null>(null)

  const debouncedQuery = useDebounce(filter.query, 350)

  const fetchManga = useCallback(async (f: Required<FilterParams>) => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    try {
      const params = new URLSearchParams({
        query:     f.query,
        searchBy:  f.searchBy,
        sortBy:    f.sortBy,
        sortOrder: f.sortOrder,
      })
      if (f.tags.length > 0) params.set('tags', f.tags.join(','))
      const res  = await fetch(`/api/manga?${params}`, { signal: ctrl.signal })
      const json = await res.json()
      setItems(json.data ?? [])
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchManga({ ...filter, query: debouncedQuery })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filter.searchBy, filter.sortBy, filter.sortOrder, filter.tags.join(',')])

  const update = <K extends keyof FilterParams>(key: K, val: FilterParams[K]) =>
    setFilter((prev) => ({ ...prev, [key]: val }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/8 bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <BookMarked className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="font-bold text-base tracking-tight text-foreground">MangaDB</span>
          <Separator orientation="vertical" className="h-4 bg-white/15" />
          <span className="text-xs text-muted-foreground hidden sm:block">
            만화 정보 &amp; 리뷰
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {/* Controls bar */}
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar
              value={filter.query}
              onChange={(v) => update('query', v)}
              placeholder={
                filter.searchBy === 'name'   ? '제목 또는 별명 검색...' :
                filter.searchBy === 'author' ? '작가명 검색...' :
                                               '장르 검색...'
              }
            />
            <FilterControls
              searchBy={filter.searchBy}
              sortBy={filter.sortBy}
              sortOrder={filter.sortOrder}
              selectedTags={filter.tags}
              onSearchByChange={(v)  => update('searchBy',  v)}
              onSortByChange={(v)    => update('sortBy',    v)}
              onSortOrderChange={(v) => update('sortOrder', v)}
              onTagsChange={(tags)   => update('tags', tags)}
            />
          </div>

          {/* Result count */}
          {!loading && (
            <p className="text-xs text-muted-foreground px-0.5">
              총 <span className="font-medium text-foreground">{items.length}</span>개
              {filter.tags.length > 0 && (
                <span className="ml-1 text-primary/80">
                  (태그: {filter.tags.join(' + ')})
                </span>
              )}
            </p>
          )}
        </section>

        {/* Manga list */}
        <MangaList items={items} loading={loading} />
      </main>
    </div>
  )
}
