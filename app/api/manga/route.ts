import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'
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

    const sortCol = ALLOWED_SORT_FIELDS[sortBy] ?? 'updated'
    const sortDir = order === 'asc' ? 'ASC' : 'DESC'

    const orderClause = `ORDER BY ${sortCol} ${sortDir}`
    const likePattern = `%${query}%`

    let result
    if (!query) {
      result = await getPool().query(`SELECT * FROM manga ${orderClause}`)
    } else if (searchBy === 'author') {
      result = await getPool().query(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(author) a WHERE a ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else if (searchBy === 'genre') {
      result = await getPool().query(
        `SELECT * FROM manga
         WHERE EXISTS (SELECT 1 FROM unnest(genre) g WHERE g ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    } else {
      result = await getPool().query(
        `SELECT * FROM manga
         WHERE name ILIKE $1
            OR EXISTS (SELECT 1 FROM unnest(alias) al WHERE al ILIKE $1)
         ${orderClause}`,
        [likePattern]
      )
    }

    return NextResponse.json({ data: result.rows })
  } catch (err) {
    console.error('[GET /api/manga]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
