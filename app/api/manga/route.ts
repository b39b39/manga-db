import { NextRequest, NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import type { SortField, SortOrder } from '@/lib/types'

const ALLOWED_SORT_FIELDS: Record<string, string> = {
  updated: 'updated',
  created: 'created',
  rate:    'rate',
  name:    'name',
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const query    = searchParams.get('query')?.trim() ?? ''
    const searchBy = searchParams.get('searchBy') ?? 'name'
    const sortBy   = (searchParams.get('sortBy') as SortField)   ?? 'updated'
    const order    = (searchParams.get('sortOrder') as SortOrder) ?? 'desc'

    const sortCol     = ALLOWED_SORT_FIELDS[sortBy] ?? 'updated'
    const sortDir     = order === 'asc' ? 'ASC' : 'DESC'
    const orderClause = `ORDER BY ${sortCol} ${sortDir}`
    const likePattern = `%${query}%`

    const sql = getSql()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any
    if (!query) {
      rows = await sql.query(`SELECT * FROM manga ${orderClause}`)
    } else if (searchBy === 'author') {
      rows = await sql.query(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(author) a WHERE a ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else if (searchBy === 'genre') {
      rows = await sql.query(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(genre) g WHERE g ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else {
      rows = await sql.query(
        `SELECT * FROM manga
         WHERE name ILIKE $1
            OR EXISTS (SELECT 1 FROM unnest(alias) al WHERE al ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    }

    return NextResponse.json({ data: rows })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[GET /api/manga]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
