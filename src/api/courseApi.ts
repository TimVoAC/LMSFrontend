// ...existing code...
import { httpClient } from "./httpClient";

export interface Course {
  id: number;
  title: string;
  description?: string | null;
  instructorName: string;
}

export async function fetchCourses(): Promise<Course[]> {
  // read token set at login (update key if different)
  const raw = localStorage.getItem("lms_auth");
  let token: string | null = null;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // accept either { token: "..." } or a plain string stored
      token = parsed?.token ?? (typeof parsed === "string" ? parsed : null);
    } catch {
      // not JSON, assume raw token string
      token = raw;
    }
  }

  console.log("Using token present:", !!token);

  const { data } = await httpClient.get<Course[]>("/courses", {
    // send bearer token if present
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    // removed withCredentials because we're sending Bearer token in header
  });

  return data;
}

export default fetchCourses;
// ...existing code...