import { api } from "@/lib/api";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const updateOrder = async (id: string, status: string) => {
  const res = await api.put(`/orders/${id}`, { status });
  return res.data;
};