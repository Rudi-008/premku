import { api } from "@/lib/api";

export const getMySubscriptions = async () => {
  const res = await api.get("/subscriptions/me");
  return res.data;
};