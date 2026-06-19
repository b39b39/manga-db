import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _sql: NeonQueryFunction<any, any> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSql(): NeonQueryFunction<any, any> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}
