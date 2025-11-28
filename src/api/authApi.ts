import { httpClient } from "./httpClient";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/login", payload);
  return data;
}
