import { api } from "@/lib/api";

export const register = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: any) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// =========================
// FIXED LOGOUT (IMPORTANT)
// =========================
export const logout = async () => {
  try {
    await api.post("/auth/logout");

    // IMPORTANT: hard client cleanup fallback
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.removeItem("auth-storage");
    sessionStorage.clear();

    return true;
  } catch (err) {
    // tetap cleanup walaupun backend gagal
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.removeItem("auth-storage");
    sessionStorage.clear();

    return false;
  }
};

export const me = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};