import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { simulationProgress, simulationHistory, simulations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// POST /api/simulations/track — catat aktivitas simulasi
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { simulationId, action, durationSeconds, completionRate, metadata } = body;

    if (!simulationId || !action) {
      return NextResponse.json(
        { error: 'simulationId dan action wajib diisi.' },
        { status: 400 }
      );
    }

    // Pastikan simulasi ada
    const [sim] = await db
      .select({ id: simulations.id })
      .from(simulations)
      .where(eq(simulations.id, simulationId))
      .limit(1);

    if (!sim) {
      return NextResponse.json({ error: 'Simulasi tidak ditemukan.' }, { status: 404 });
    }

    const userId = session.user.id;

    if (action === 'start') {
      // Catat ke history
      const [entry] = await db
        .insert(simulationHistory)
        .values({ userId, simulationId })
        .returning({ id: simulationHistory.id });

      return NextResponse.json({ historyId: entry.id, message: 'Sesi dimulai.' });
    }

    if (action === 'end') {
      // Update history entry (tandai selesai)
      const { historyId } = body;
      if (historyId) {
        await db
          .update(simulationHistory)
          .set({
            endedAt: new Date(),
            durationSeconds: durationSeconds ?? null,
            metadata: metadata ?? null,
          })
          .where(
            and(
              eq(simulationHistory.id, historyId),
              eq(simulationHistory.userId, userId)
            )
          );
      }

      // Upsert progress
      const [existingProgress] = await db
        .select()
        .from(simulationProgress)
        .where(
          and(
            eq(simulationProgress.userId, userId),
            eq(simulationProgress.simulationId, simulationId)
          )
        )
        .limit(1);

      if (existingProgress) {
        await db
          .update(simulationProgress)
          .set({
            completionRate: Math.max(
              existingProgress.completionRate,
              completionRate ?? 0
            ),
            timeSpentSeconds:
              (existingProgress.timeSpentSeconds ?? 0) + (durationSeconds ?? 0),
            lastAccessedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(simulationProgress.id, existingProgress.id));
      } else {
        await db.insert(simulationProgress).values({
          userId,
          simulationId,
          completionRate: completionRate ?? 0,
          timeSpentSeconds: durationSeconds ?? 0,
        });
      }

      return NextResponse.json({ message: 'Progres tersimpan.' });
    }

    return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 });
  } catch (error) {
    console.error('[TRACK_SIMULATION]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET /api/simulations/track?simulationId=xxx — ambil progres satu simulasi
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const simulationId = searchParams.get('simulationId');

  if (!simulationId) {
    return NextResponse.json({ error: 'simulationId diperlukan.' }, { status: 400 });
  }

  const [progress] = await db
    .select()
    .from(simulationProgress)
    .where(
      and(
        eq(simulationProgress.userId, session.user.id),
        eq(simulationProgress.simulationId, simulationId)
      )
    )
    .limit(1);

  return NextResponse.json({ progress: progress ?? null });
}
