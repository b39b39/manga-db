import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import type { SortField, SortOrder } from '@/lib/types'

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  updated: 'updated',
  created: 'created',
  rate:    'rate',
  name:    'name',
}

// neon() HTTP transport called as a regular function (sortCol/sortDir are allowlist-safe)
type RawQuery = (q: string, p?: unknown[]) => Promise<unknown[]>

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const query    = searchParams.get('query')?.trim() ?? ''
    const searchBy = searchParams.get('searchBy') ?? 'name'
    const sortBy   = (searchParams.get('sortBy') as SortField)   ?? 'updated'
    const order    = (searchParams.get('sortOrder') as SortOrder) ?? 'desc'

    const sortCol    = ALLOWED_SORT_FIELDS[sortBy] ?? 'updated'
    const sortDir    = order === 'asc' ? 'ASC' : 'DESC'
    const orderClause = `ORDER BY ${sortCol} ${sortDir}`
    const likePattern = `%${query}%`

    const rawQuery = getSql() as unknown as RawQuery

    let rows: unknown[]
    if (!query) {
      rows = await rawQuery(`SELECT * FROM manga ${orderClause}`)
    } else if (searchBy === 'author') {
      rows = await rawQuery(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(author) a WHERE a ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else if (searchBy === 'genre') {
      rows = await rawQuery(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(genre) g WHERE g ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else {
      rows = await rawQuery(
        `SELECT * FROM manga
         WHERE name ILIKE $1
            OR EXISTS (SELECT 1 FROM unnest(alias) al WHERE al ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    }

    return NextResponse.json({ data: rows })
  } catch (err) {
    console.error('[GET /api/manga]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
