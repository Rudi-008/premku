import { api } from "@/lib/api";

export const createOrder = async (productId: string) => {
  const res = await api.post("/checkout/create", { productId });
  return res.data;
};

export const payOrder = async (orderId: string) => {
  const res = await api.post("/checkout/pay", { orderId });
  return res.data;
};

export const getSubscriptions = async () => {
  const res = await api.get("/checkout/subscriptions");
  return res.data;
};