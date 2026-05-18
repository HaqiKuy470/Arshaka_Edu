import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, grade } = body;

    // Validasi input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Nama, email, dan password wajib diisi.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter.' },
        { status: 400 }
      );
    }

    // Cek email sudah terdaftar
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Buat user baru
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        grade: grade ?? null,
        role: 'student',
      })
      .returning({ id: users.id, email: users.email, name: users.name });

    return NextResponse.json(
      { message: 'Akun berhasil dibuat.', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
