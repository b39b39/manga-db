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
    const query       = searchParams.get('query')?.trim() ?? ''
    const searchBy    = searchParams.get('searchBy') ?? 'name'
    const sortBy      = (searchParams.get('sortBy') as SortField)   ?? 'updated'
    const order       = (searchParams.get('sortOrder') as SortOrder) ?? 'desc'
    const tagsParam   = searchParams.get('tags') ?? ''
    const tags        = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : []
    const authorQuery = searchParams.get('authorQuery')?.trim() ?? ''

    const sortCol     = ALLOWED_SORT_FIELDS[sortBy] ?? 'updated'
    const sortDir     = order === 'asc' ? 'ASC' : 'DESC'
    const orderClause = `ORDER BY ${sortCol} ${sortDir}`
    const likePattern = `%${query}%`

    const sql = getSql()

    // Build WHERE clause dynamically
    const conds: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vals: any[] = []

    if (query) {
      vals.push(likePattern)
      const n = vals.length
      if (searchBy === 'author') {
        conds.push(`EXISTS (SELECT 1 FROM unnest(author) a WHERE a ILIKE $${n})`)
      } else if (searchBy === 'genre') {
        conds.push(`EXISTS (SELECT 1 FROM unnest(genre) g WHERE g ILIKE $${n})`)
      } else {
        conds.push(`(name ILIKE $${n} OR EXISTS (SELECT 1 FROM unnest(alias) al WHERE al ILIKE $${n}))`)
      }
    }

    if (tags.length > 0) {
      vals.push(tags)
      // @> : 왼쪽 배열이 오른쪽 배열의 모든 요소를 포함 (AND 교집합)
      conds.push(`genre @> $${vals.length}::text[]`)
    }

    if (authorQuery) {
      vals.push(`%${authorQuery}%`)
      conds.push(`EXISTS (SELECT 1 FROM unnest(author) a WHERE a ILIKE $${vals.length})`)
    }

    const where = conds.length > 0 ? `WHERE ${conds.join(' AND ')}` : ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (vals.length
      ? await sql.query(`SELECT * FROM manga ${where} ${orderClause}`, vals)
      : await sql.query(`SELECT * FROM manga ${orderClause}`)) as unknown as any[]

    return NextResponse.json({ data: rows })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[GET /api/manga]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
