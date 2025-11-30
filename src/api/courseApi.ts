// ...existing code...
import { httpClient } from "./httpClient";

export interface Course {
  id: number;
  title: string;
  description?: string | null;
  instructorName: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string | null;
  order: number;
}

export interface Assignment {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  maxPoints: number;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  assignments: Assignment[];
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
}

export interface CreateLessonRequest {
  title: string;
  content?: string;
  order?: number;
}

export interface CreateAssignmentRequest {
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  maxPoints: number;
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

export async function fetchCourses(): Promise<Course[]> {
  const token = getStoredToken();

 // console.log("Using token present:", !!token);

  const { data } = await httpClient.get<Course[]>("/courses", {
    // send bearer token if present
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // removed withCredentials because we're sending Bearer token in header
  });

  return data;
}


export async function fetchCourseDetail(id: number): Promise<Course> {
  const token = getStoredToken();
  const { data } = await httpClient.get<Course>(`/courses/${id}`,{
    // send bearer token if present
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // removed withCredentials because we're sending Bearer token in header
  });
  return data;
}



export async function createCourse(payload: CreateCourseRequest): Promise<Course> {
  const token = getStoredToken();

  const { data } = await httpClient.post<Course>("/courses", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return data;
}


export async function createLesson( courseId: number,  payload: CreateLessonRequest) {
  const token = getStoredToken();
  const { data } = await httpClient.post(`/courses/${courseId}/lessons`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return data;
}

export async function createAssignment(courseId: number, payload: CreateAssignmentRequest) {
  const token = getStoredToken();
  const { data } = await httpClient.post(`/courses/${courseId}/assignments`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return data;
}

// 


//export default fetchCourseById;
// ...existing code...