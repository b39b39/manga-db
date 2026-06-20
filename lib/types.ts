export type MangaState = 'ongoing' | 'completed' | 'hiatus'

export interface Manga {
  id: number
  name: string
  alias: string[]
  author: string[]
  rate: number
  image: string
  icon: string
  summary: string
  review: string
  genre: string[]
  state: MangaState
  updated: string
  created: string
}

export type SortField = 'updated' | 'created' | 'rate' | 'name'
export type SortOrder = 'desc' | 'asc'

export interface FilterParams {
  query?: string
  searchBy?: 'name' | 'author' | 'genre'
  sortBy?: SortField
  sortOrder?: SortOrder
  tags?: string[]
}
