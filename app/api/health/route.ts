import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

// GET /api/health — cek status database
export async function GET() {
  const dbOk = await checkDbConnection();
  const status = dbOk ? 'ok' : 'error';

  return NextResponse.json(
    {
      status,
      db: dbOk ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    },
    { status: dbOk ? 200 : 503 }
  );
}
