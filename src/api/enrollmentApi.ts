// ...existing code...
import { httpClient } from "./httpClient";

export interface MyCourse {
  courseId: number;
  title: string;
  description?: string | null;
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

export async function fetchMyCourses(): Promise<MyCourse[]> {
  const token = getStoredToken();
  const { data } = await httpClient.get<MyCourse[]>("/enrollments/my", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return data;
}

// Optional (for later): enroll in a course
export async function enrollInCourse(courseId: number): Promise<void> {
  const token = getStoredToken();
  await httpClient.post(
    `/enrollments/${courseId}`,
    null,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );
}