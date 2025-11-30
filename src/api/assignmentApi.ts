import { httpClient } from "./httpClient";

export interface SubmitAssignmentRequest {
  content?: string;
}

export interface AssignmentSubmission {
  id: number;
  studentId: number;
  studentUsername: string;
  submittedAt: string;
  content?: string | null;
  grade?: number | null;
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
export async function submitAssignment(
  assignmentId: number,
  payload: SubmitAssignmentRequest
): Promise<void> {
  const token = getStoredToken();
  await httpClient.post(`/assignments/${assignmentId}/submit`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function fetchSubmissions(
  assignmentId: number
): Promise<AssignmentSubmission[]> {
    const token = getStoredToken();
  const { data } = await httpClient.get<AssignmentSubmission[]>(
    `/assignments/${assignmentId}/submissions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
 
  return data;
}

export async function gradeSubmission(
  assignmentId: number,
  submissionId: number,
  grade: number
): Promise<void> {
    const token = getStoredToken();
  await httpClient.put(
    `/assignments/${assignmentId}/submissions/${submissionId}/grade`,
    { grade }, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
