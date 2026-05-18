'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function completeOnboarding(formData: {
  role: 'student' | 'teacher';
  grade?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db
      .update(users)
      .set({
        role: formData.role,
        isOnboarded: true,
        grade: formData.grade || null,
      })
      .where(eq(users.id, session.user.id));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('[ONBOARDING_ERROR]', error);
    return { success: false, error: 'Terjadi kesalahan sistem' };
  }
}
