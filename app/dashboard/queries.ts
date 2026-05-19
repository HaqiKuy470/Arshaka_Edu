'use server';

import { db } from '@/lib/db';
import { classrooms, classroomEnrollments, assignments, submissions, users, simulations } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';

// Fetch classrooms taught by the teacher
export async function getTeacherClassrooms(teacherId: string) {
  return await db
    .select({
      id: classrooms.id,
      code: classrooms.code,
      name: classrooms.name,
      subject: classrooms.subject,
      createdAt: classrooms.createdAt,
    })
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacherId));
}

// Fetch classrooms enrolled by the student
export async function getStudentClassrooms(studentId: string) {
  return await db
    .select({
      id: classrooms.id,
      code: classrooms.code,
      name: classrooms.name,
      subject: classrooms.subject,
      teacherName: users.name,
    })
    .from(classroomEnrollments)
    .innerJoin(classrooms, eq(classrooms.id, classroomEnrollments.classroomId))
    .innerJoin(users, eq(users.id, classrooms.teacherId))
    .where(eq(classroomEnrollments.studentId, studentId));
}

// Fetch active tasks for teacher (assignments created by this teacher)
export async function getTeacherAssignments(teacherId: string) {
  return await db
    .select({
      id: assignments.id,
      title: assignments.title,
      instructions: assignments.instructions,
      dueDate: assignments.dueDate,
      createdAt: assignments.createdAt,
      classroomName: classrooms.name,
      simulationTitle: simulations.title,
    })
    .from(assignments)
    .innerJoin(classrooms, eq(classrooms.id, assignments.classroomId))
    .innerJoin(simulations, eq(simulations.id, assignments.simulationId))
    .where(eq(classrooms.teacherId, teacherId));
}

// Fetch tasks for student (assignments from enrolled classes)
export async function getStudentAssignments(studentId: string) {
  return await db
    .select({
      id: assignments.id,
      title: assignments.title,
      instructions: assignments.instructions,
      dueDate: assignments.dueDate,
      createdAt: assignments.createdAt,
      classroomName: classrooms.name,
      simulationTitle: simulations.title,
      simulationSlug: simulations.slug,
      submissionStatus: submissions.status,
      submissionGrade: submissions.grade,
    })
    .from(assignments)
    .innerJoin(classrooms, eq(classrooms.id, assignments.classroomId))
    .innerJoin(simulations, eq(simulations.id, assignments.simulationId))
    .innerJoin(classroomEnrollments, eq(classroomEnrollments.classroomId, classrooms.id))
    .leftJoin(
      submissions,
      and(
        eq(submissions.assignmentId, assignments.id),
        eq(submissions.studentId, studentId)
      )
    )
    .where(eq(classroomEnrollments.studentId, studentId));
}
// Fetch student count per classroom for the teacher
export async function getClassroomStudentCounts(teacherId: string) {
  const teacherClasses = await db.select({ id: classrooms.id }).from(classrooms).where(eq(classrooms.teacherId, teacherId));
  const counts: Record<string, number> = {};
  
  for (const cls of teacherClasses) {
    const res = await db
      .select({ count: count() })
      .from(classroomEnrollments)
      .where(eq(classroomEnrollments.classroomId, cls.id));
    counts[cls.id] = res[0]?.count ?? 0;
  }
  return counts;
}

// Fetch list of active simulations for selecting in assignments
export async function getActiveSimulationsList() {
  return await db
    .select({
      id: simulations.id,
      title: simulations.title,
      subject: simulations.subject,
    })
    .from(simulations)
    .where(eq(simulations.isActive, true));
}

// Fetch all students enrolled across all classrooms taught by the teacher
export async function getTeacherClassroomStudents(teacherId: string) {
  return await db
    .select({
      classroomId: classroomEnrollments.classroomId,
      studentId: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(classroomEnrollments)
    .innerJoin(users, eq(users.id, classroomEnrollments.studentId))
    .innerJoin(classrooms, eq(classrooms.id, classroomEnrollments.classroomId))
    .where(eq(classrooms.teacherId, teacherId));
}

