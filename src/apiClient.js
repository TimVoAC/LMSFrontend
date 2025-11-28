const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:44340/api";

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  return res.json();
}

export async function getCourses(token) {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load courses");
  }

  return res.json();
}
