import { api } from "@/lib/api";

export const getInvoices = async () => {
  const res = await api.get("/billing/invoices");
  return res.data;
};