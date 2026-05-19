'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, whitelistedEmails } from '@/lib/db/schema';
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

export async function addWhitelistedEmail(email: string, notes: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.email !== 'haqikuy470@gmail.com') {
    return { success: false, error: 'Unauthorized' };
  }

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Format email tidak valid.' };
  }

  try {
    await db.insert(whitelistedEmails).values({
      email: email.toLowerCase().trim(),
      notes: notes || null,
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('[ADMIN_WHITELIST_ADD_ERROR]', error);
    if (error?.code === '23505' || String(error).includes('unique')) {
      return { success: false, error: 'Email ini sudah terdaftar di whitelist!' };
    }
    return { success: false, error: 'Gagal menambahkan email ke whitelist' };
  }
}

export async function removeWhitelistedEmail(id: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.email !== 'haqikuy470@gmail.com') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await db.delete(whitelistedEmails).where(eq(whitelistedEmails.id, id));
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN_WHITELIST_REMOVE_ERROR]', error);
    return { success: false, error: 'Gagal menghapus email dari whitelist' };
  }
}
