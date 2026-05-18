'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: 'student' | 'teacher' | 'admin') {
  const session = await auth();
  
  // Guard untuk email admin mutlak
  if (!session?.user?.id || session.user.email !== 'haqikuy470@gmail.com') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Jangan biarkan admin menurunkan rolenya sendiri secara tidak sengaja
    const userToUpdate = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (userToUpdate?.email === 'haqikuy470@gmail.com' && newRole !== 'admin') {
      return { success: false, error: 'Tidak dapat mengubah role Admin Utama!' };
    }

    await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN_ROLE_UPDATE_ERROR]', error);
    return { success: false, error: 'Gagal memperbarui role pengguna' };
  }
}
