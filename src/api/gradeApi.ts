import { httpClient } from "./httpClient";

export interface MyGrade {
  courseId: number;
  courseTitle: string;
  assignmentId: number;
  assignmentTitle: string;
  grade?: number | null;
  maxPoints: number;
  submittedAt: string;
}

export interface CourseGradebookEntry {
  studentId: number;
  studentUsername: string;
  assignmentId: number;
  assignmentTitle: string;
  grade?: number | null;
  maxPoints: number;
  submittedAt: string;
}

function getStoredToken(): string | null {
  const raw = localStorage.getItem("lms_auth");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed?.token ?? (typeof parsed === "string" ? parsed : null);
  } catch {
    return raw;
  }
}

export async function fetchMyGrades(): Promise<MyGrade[]> {
    const token = getStoredToken();
    const { data } = await httpClient.get<MyGrade[]>("/grades/my", {
    // send bearer token if present
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // removed withCredentials because we're sending Bearer token in header
  });

  return data;
}

export async function fetchCourseGradebook(courseId: number): Promise<CourseGradebookEntry[]> {
  const token = getStoredToken();
  const { data } = await httpClient.get<CourseGradebookEntry[]>(
    `/grades/course/${courseId}`, {
    // send bearer token if present
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // removed withCredentials because we're sending Bearer token in header
  });


  return data;
}

export default fetchCourseGradebook;
