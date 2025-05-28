// services/auth.ts
import { api } from "./api";

export async function login(email: string, senha: string) {
  const res = await api.post("/auth/login", { email, senha });
  const token = res.data.token;
  localStorage.setItem("token", token);
  return token;
}
