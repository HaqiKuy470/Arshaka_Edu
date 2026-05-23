'use server';

import { db } from '@/lib/db';
import { classrooms, classroomEnrollments, assignments, submissions, users, accounts } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Helper: Generate random class code (e.g. ARS-A8B9)
function generateClassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let segment = '';
  for (let i = 0; i < 6; i++) {
    segment += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ARS-${segment}`;
}

// ─── Action: Buat Kelas (Guru Only) ──────────────────────────────────────────
export async function createClassroom(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user || user.role !== 'teacher') {
    throw new Error('Hanya Pengajar (Teacher) yang dapat membuat kelas.');
  }

  const name = formData.get('name') as string;
  const subject = formData.get('subject') as string;

  if (!name || !subject) {
    throw new Error('Nama kelas dan mata pelajaran wajib diisi.');
  }

  const code = generateClassCode();

  await db.insert(classrooms).values({
    name,
    subject,
    code,
    teacherId: user.id,
  });

  revalidatePath('/dashboard');
  return { success: true, code };
}

// ─── Action: Gabung Kelas (Siswa Only) ─────────────────────────────────────────
export async function enrollClassroom(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user || user.role !== 'student') {
    throw new Error('Hanya Pelajar (Student) yang dapat bergabung dengan kelas.');
  }

  const code = (formData.get('code') as string)?.trim().toUpperCase();
  if (!code) {
    throw new Error('Kode kelas wajib diisi.');
  }

  // Cari kelas berdasarkan kode
  const targetClass = await db.query.classrooms.findFirst({
    where: eq(classrooms.code, code),
  });

  if (!targetClass) {
    throw new Error('Kelas dengan kode tersebut tidak ditemukan.');
  }

  // Periksa apakah sudah terdaftar
  const existingEnrollment = await db.query.classroomEnrollments.findFirst({
    where: and(
      eq(classroomEnrollments.classroomId, targetClass.id),
      eq(classroomEnrollments.studentId, user.id)
    ),
  });

  if (existingEnrollment) {
    throw new Error('Anda sudah terdaftar di kelas ini.');
  }

  // Daftarkan siswa
  await db.insert(classroomEnrollments).values({
    classroomId: targetClass.id,
    studentId: user.id,
  });

  // Ambil semua tugas di kelas ini dan daftarkan submission sebagai pending
  const classAssignments = await db.select().from(assignments).where(eq(assignments.classroomId, targetClass.id));
  for (const asg of classAssignments) {
    await db.insert(submissions).values({
      assignmentId: asg.id,
      studentId: user.id,
      status: 'pending',
    });
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// ─── Action: Buat Tugas (Guru Only) ──────────────────────────────────────────
export async function createAssignment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user || user.role !== 'teacher') {
    throw new Error('Hanya Pengajar yang dapat membuat tugas.');
  }

  const classroomId = formData.get('classroomId') as string;
  const simulationId = formData.get('simulationId') as string;
  const title = formData.get('title') as string;
  const instructions = formData.get('instructions') as string;
  const dueDateString = formData.get('dueDate') as string;

  if (!classroomId || !simulationId || !title) {
    throw new Error('Kelas, simulasi, dan judul tugas wajib diisi.');
  }

  const newAssignment = await db.insert(assignments).values({
    classroomId,
    simulationId,
    title,
    instructions,
    dueDate: dueDateString ? new Date(dueDateString) : null,
  }).returning({ id: assignments.id });

  // Daftarkan semua siswa di kelas ini untuk mendapatkan tugas ini (status pending)
  const students = await db
    .select({ studentId: classroomEnrollments.studentId })
    .from(classroomEnrollments)
    .where(eq(classroomEnrollments.classroomId, classroomId));

  if (students.length > 0) {
    const submissionsToInsert = students.map((s) => ({
      assignmentId: newAssignment[0].id,
      studentId: s.studentId,
      status: 'pending' as const,
    }));
    await db.insert(submissions).values(submissionsToInsert);
  }

  revalidatePath('/dashboard');
  return { success: true };
}

// ─── Action: Edit Profil (Nama & Gambar) ──────────────────────────────────────
export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const name = formData.get('name') as string;
  const image = formData.get('image') as string;

  if (!name) {
    throw new Error('Nama wajib diisi.');
  }

  await db
    .update(users)
    .set({
      name,
      image: image || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath('/dashboard');
  return { success: true };
}

// ─── Google Classroom Integration Actions ─────────────────────────────────────

async function refreshGoogleAccessToken(account: { provider: string; providerAccountId: string; refresh_token: string | null }) {
  if (!account.refresh_token) {
    console.warn('[Google Token Refresh] No refresh token available');
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: account.refresh_token,
      }),
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    const newAccessToken = data.access_token;
    const expiresAt = data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : null;

    // Update in database
    await db.update(accounts)
      .set({
        access_token: newAccessToken,
        expires_at: expiresAt,
        refresh_token: data.refresh_token ?? account.refresh_token,
      })
      .where(and(
        eq(accounts.provider, account.provider),
        eq(accounts.providerAccountId, account.providerAccountId)
      ));

    console.log('[Google Token Refresh] Token refreshed successfully');
    return newAccessToken;
  } catch (error) {
    console.error('[Google Token Refresh] Failed to refresh access token:', error);
    return null;
  }
}

async function getValidGoogleAccessToken(userId: string) {
  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.provider, 'google')
    )
  });

  if (!account || !account.access_token) {
    return null;
  }

  // Check if expired or about to expire (within 5 minutes)
  const isExpired = account.expires_at 
    ? (account.expires_at * 1000 - 300000 < Date.now()) 
    : false;

  if (isExpired && account.refresh_token) {
    console.log('[Google Classroom] Access token is expired/expiring soon, attempting refresh...');
    const newAccessToken = await refreshGoogleAccessToken(account);
    if (newAccessToken) {
      return newAccessToken;
    }
  }

  return account.access_token;
}

export async function checkGoogleConnection() {
  const session = await auth();
  if (!session?.user?.id) return { connected: false };

  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session.user.id),
      eq(accounts.provider, 'google')
    )
  });

  return {
    connected: !!account,
    email: session.user.email
  };
}

export async function fetchGoogleCourses() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const accessToken = await getValidGoogleAccessToken(session.user.id);

  const mockCourses = [
    { id: 'google-101', name: 'Google Classroom: Fisika Kelas 10A', subject: 'Fisika', section: 'Tahun Ajaran 2026/2027' },
    { id: 'google-102', name: 'Google Classroom: Kimia 11 - IPA', subject: 'Kimia', section: 'Tahun Ajaran 2026/2027' },
    { id: 'google-103', name: 'Google Classroom: Biologi Terpadu', subject: 'Biologi', section: 'Kurikulum Merdeka' },
    { id: 'google-104', name: 'Google Classroom: Matematika Wajib', subject: 'Matematika', section: 'Kelas 12' }
  ];

  if (!accessToken) {
    return {
      connected: false,
      courses: mockCourses,
      simulated: true,
      message: 'Belum menghubungkan akun Google. Menggunakan kelas simulasi.'
    };
  }

  try {
    const res = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error(`Gagal mengambil kelas dari Google Classroom: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      connected: true,
      courses: (data.courses || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        subject: c.descriptionHeading || 'Fisika',
        section: c.section || 'Google Classroom'
      })),
      simulated: false
    };
  } catch (error) {
    console.warn('[Google Classroom API failed, falling back to simulation]', error);
  }

  return {
    connected: true,
    courses: mockCourses,
    simulated: true,
    message: 'Gagal memanggil API Google (kemungkinan token kedaluwarsa atau kurang izin). Menggunakan kelas simulasi.'
  };
}

export async function importGoogleCourse(courseId: string, courseName: string, subject: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const classroomCode = generateClassCode();
  
  // 1. Buat Kelas Virtual Baru di DB
  const newClass = await db.insert(classrooms).values({
    name: courseName,
    subject: subject,
    code: classroomCode,
    teacherId: session.user.id
  }).returning({ id: classrooms.id });

  const classroomId = newClass[0].id;

  // 2. Dapatkan token akses Google yang valid
  const accessToken = await getValidGoogleAccessToken(session.user.id);

  let studentsToEnroll: Array<{ name: string; email: string }> = [];

  // 3. Coba Tarik Siswa Riil dari Google Classroom API
  if (accessToken && !courseId.startsWith('google-')) {
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.students) {
          studentsToEnroll = data.students.map((s: any) => ({
            name: s.profile?.name?.fullName || s.profile?.emailAddress?.split('@')[0],
            email: s.profile?.emailAddress
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch real student list, falling back to mock students', e);
    }
  }

  // 4. Fallback ke Siswa Simulasi jika daftar kosong
  if (studentsToEnroll.length === 0) {
    studentsToEnroll = [
      { name: 'Ahmad Rafli', email: 'rafli@student.arshaka.edu' },
      { name: 'Siti Aminah', email: 'siti@student.arshaka.edu' },
      { name: 'Budi Santoso', email: 'budi@student.arshaka.edu' },
      { name: 'Dewi Lestari', email: 'dewi@student.arshaka.edu' }
    ];
  }

  // 5. Daftarkan Siswa ke Kelas Virtual Arshaka
  for (const student of studentsToEnroll) {
    // Cari siswa berdasarkan email di database
    let existingUser = await db.query.users.findFirst({
      where: eq(users.email, student.email)
    });

    if (!existingUser) {
      // Jika siswa belum terdaftar di Arshaka, buat akun dummy untuk mereka
      const created = await db.insert(users).values({
        name: student.name,
        email: student.email,
        role: 'student',
        isOnboarded: true
      }).returning({ id: users.id });
      existingUser = { id: created[0].id } as any;
    }

    // Daftarkan siswa ke kelas
    if (existingUser?.id) {
      const enrollCheck = await db.query.classroomEnrollments.findFirst({
        where: and(
          eq(classroomEnrollments.classroomId, classroomId),
          eq(classroomEnrollments.studentId, existingUser.id)
        )
      });
      if (!enrollCheck) {
        await db.insert(classroomEnrollments).values({
          classroomId: classroomId,
          studentId: existingUser.id
        });
      }
    }
  }

  revalidatePath('/dashboard');
  return { success: true };
}


