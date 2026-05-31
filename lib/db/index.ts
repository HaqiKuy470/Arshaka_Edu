import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// ================================================================
// CONNECTION POOL — PostgreSQL
// ================================================================
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

// Reuse pool in development (hot reload aman)
export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

// ================================================================
// DRIZZLE INSTANCE
// ================================================================
export const db = drizzle(pool, { schema });

// ================================================================
// HEALTH CHECK
// ================================================================
export async function checkDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch {
    return false;
  }
}
