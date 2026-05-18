import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { simulationProgress, simulationHistory, userBadges, badges } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/user/progress — ambil semua progres simulasi user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'progress'; // 'progress' | 'history' | 'badges'

  try {
    if (type === 'history') {
      const history = await db.query.simulationHistory.findMany({
        where: eq(simulationHistory.userId, session.user.id),
        orderBy: [desc(simulationHistory.startedAt)],
        limit: 50,
        with: { simulation: true },
      });
      return NextResponse.json({ history });
    }

    if (type === 'badges') {
      const earned = await db.query.userBadges.findMany({
        where: eq(userBadges.userId, session.user.id),
        with: { badge: true },
        orderBy: [desc(userBadges.earnedAt)],
      });
      return NextResponse.json({ badges: earned });
    }

    // Default: progress
    const progress = await db.query.simulationProgress.findMany({
      where: eq(simulationProgress.userId, session.user.id),
      orderBy: [desc(simulationProgress.lastAccessedAt)],
      with: { simulation: true },
    });
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('[USER_PROGRESS_GET]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
