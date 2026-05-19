import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  primaryKey,
  real,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ================================================================
// TABEL USERS
// ================================================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  password: text('password'), // hashed, null jika pakai OAuth
  role: text('role', { enum: ['student', 'teacher', 'admin'] })
    .notNull()
    .default('student'),
  isOnboarded: boolean('is_onboarded').default(false).notNull(),
  grade: text('grade'), // jenjang: SD, SMP, SMA, Kuliah, Umum
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ================================================================
// TABEL ACCOUNTS (untuk OAuth providers — NextAuth)
// ================================================================
export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

// ================================================================
// TABEL SESSIONS (NextAuth)
// ================================================================
export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// ================================================================
// TABEL VERIFICATION TOKENS (NextAuth email verification)
// ================================================================
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// ================================================================
// TABEL SIMULATIONS (katalog simulasi)
// ================================================================
export const simulations = pgTable('simulations', {
  id: text('id').primaryKey(), // e.g. "gerak-lurus", "hukum-newton"
  title: text('title').notNull(),
  description: text('description'),
  subject: text('subject').notNull(), // fisika, kimia, matematika, dst.
  grade: text('grade').notNull(),     // SD, SMP, SMA, Kuliah
  slug: text('slug').notNull().unique(),
  thumbnail: text('thumbnail'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ================================================================
// TABEL SIMULATION PROGRESS (progres belajar per user)
// ================================================================
export const simulationProgress = pgTable('simulation_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  simulationId: text('simulation_id')
    .notNull()
    .references(() => simulations.id, { onDelete: 'cascade' }),
  completionRate: real('completion_rate').default(0).notNull(), // 0.0 - 1.0
  timeSpentSeconds: integer('time_spent_seconds').default(0).notNull(),
  lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),
  sessionData: jsonb('session_data'), // state simulasi tersimpan (opsional)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ================================================================
// TABEL SIMULATION HISTORY (riwayat setiap sesi)
// ================================================================
export const simulationHistory = pgTable('simulation_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  simulationId: text('simulation_id')
    .notNull()
    .references(() => simulations.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
  durationSeconds: integer('duration_seconds'),
  metadata: jsonb('metadata'), // data tambahan (skor, parameter, dll)
});

// ================================================================
// TABEL BADGES (pencapaian / gamifikasi)
// ================================================================
export const badges = pgTable('badges', {
  id: text('id').primaryKey(), // e.g. "first-simulation", "physics-master"
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // emoji atau URL icon
  condition: text('condition').notNull(), // deskripsi kondisi unlock
  subject: text('subject'), // null = lintas mapel
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ================================================================
// TABEL USER BADGES (badge yang dimiliki user)
// ================================================================
export const userBadges = pgTable(
  'user_badges',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    badgeId: text('badge_id')
      .notNull()
      .references(() => badges.id, { onDelete: 'cascade' }),
    earnedAt: timestamp('earned_at').defaultNow().notNull(),
  },
  (ub) => ({
    compoundKey: primaryKey({ columns: [ub.userId, ub.badgeId] }),
  })
);

// ================================================================
// TABEL CLASSROOMS (Kelas Virtual)
// ================================================================
export const classrooms = pgTable('classrooms', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(), // e.g. "IP1-8930"
  name: text('name').notNull(),          // e.g. "Kelas 10 IPA 1"
  subject: text('subject').notNull(),    // e.g. "Fisika"
  teacherId: uuid('teacher_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ================================================================
// TABEL CLASSROOM ENROLLMENTS (Siswa Terdaftar di Kelas)
// ================================================================
export const classroomEnrollments = pgTable(
  'classroom_enrollments',
  {
    classroomId: uuid('classroom_id')
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    studentId: uuid('student_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
  },
  (ce) => ({
    compoundKey: primaryKey({ columns: [ce.classroomId, ce.studentId] }),
  })
);

// ================================================================
// TABEL ASSIGNMENTS (Tugas Kelas Virtual)
// ================================================================
export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  classroomId: uuid('classroom_id')
    .notNull()
    .references(() => classrooms.id, { onDelete: 'cascade' }),
  simulationId: text('simulation_id')
    .notNull()
    .references(() => simulations.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  instructions: text('instructions'),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ================================================================
// TABEL SUBMISSIONS (Pemberian Tugas / Nilai)
// ================================================================
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => assignments.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['pending', 'completed'] }).default('pending').notNull(),
  grade: integer('grade'), // Nilai dari guru (0-100)
  feedback: text('feedback'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ================================================================
// RELASI
// ================================================================
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  simulationProgress: many(simulationProgress),
  simulationHistory: many(simulationHistory),
  userBadges: many(userBadges),
  classroomsTeacher: many(classrooms), // Kelas yang diajarkan
  enrollments: many(classroomEnrollments), // Kelas yang diikuti
  submissions: many(submissions),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classrooms.teacherId],
    references: [users.id],
  }),
  enrollments: many(classroomEnrollments),
  assignments: many(assignments),
}));

export const classroomEnrollmentsRelations = relations(
  classroomEnrollments,
  ({ one }) => ({
    classroom: one(classrooms, {
      fields: [classroomEnrollments.classroomId],
      references: [classrooms.id],
    }),
    student: one(users, {
      fields: [classroomEnrollments.studentId],
      references: [users.id],
    }),
  })
);

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  classroom: one(classrooms, {
    fields: [assignments.classroomId],
    references: [classrooms.id],
  }),
  simulation: one(simulations, {
    fields: [assignments.simulationId],
    references: [simulations.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

export const simulationsRelations = relations(simulations, ({ many }) => ({
  progress: many(simulationProgress),
  history: many(simulationHistory),
  assignments: many(assignments),
}));

export const simulationProgressRelations = relations(
  simulationProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [simulationProgress.userId],
      references: [users.id],
    }),
    simulation: one(simulations, {
      fields: [simulationProgress.simulationId],
      references: [simulations.id],
    }),
  })
);

export const simulationHistoryRelations = relations(
  simulationHistory,
  ({ one }) => ({
    user: one(users, {
      fields: [simulationHistory.userId],
      references: [users.id],
    }),
    simulation: one(simulations, {
      fields: [simulationHistory.simulationId],
      references: [simulations.id],
    }),
  })
);

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}));

// ================================================================
// TYPE EXPORTS
// ================================================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Simulation = typeof simulations.$inferSelect;
export type SimulationProgress = typeof simulationProgress.$inferSelect;
export type SimulationHistory = typeof simulationHistory.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type Classroom = typeof classrooms.$inferSelect;
export type ClassroomEnrollment = typeof classroomEnrollments.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;
export type Submission = typeof submissions.$inferSelect;

// ================================================================
// TABEL WHITELISTED EMAILS (untuk domain/email sekolah terverifikasi)
// ================================================================
export const whitelistedEmails = pgTable('whitelisted_emails', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type WhitelistedEmail = typeof whitelistedEmails.$inferSelect;


