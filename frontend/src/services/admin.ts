import { api } from "@/lib/api";

export const getAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data;
};