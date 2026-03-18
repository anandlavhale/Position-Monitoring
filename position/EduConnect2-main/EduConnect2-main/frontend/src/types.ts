export interface TimeSlot {
  subject: string;
  class: string;
  avail: "AVAILABLE" | "UNAVAILABLE";
  loc: string;
}

export interface DaySchedule {
  [timeSlot: string]: TimeSlot;
}

export interface Timetable {
  [day: string]: DaySchedule;
}

export interface Teacher {
  name: string;
  id: string;
  password: string;
  timetable: Timetable;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export type UserRole = "student" | "teacher" | null;

export interface Appointment {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  day: string;
  timeSlot: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}