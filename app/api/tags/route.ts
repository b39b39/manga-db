import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export async function GET() {
  try {
    const sql = getSql()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (await sql.query('SELECT name FROM tag ORDER BY name')) as unknown as Array<{name: string}>
    return NextResponse.json(rows.map((r) => r.name as string))
  } catch (err) {
    console.error('[GET /api/tags]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
