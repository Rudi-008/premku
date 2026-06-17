import axios from "axios";

export const api = axios.create({
  baseURL: "https://premku-production.up.railway.app/api",
  withCredentials: true,
});