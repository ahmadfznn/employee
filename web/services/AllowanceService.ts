import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const AllowanceService = {
  async getAllAllowances() {
    return api.get("/allowance");
  },

  async getAllowanceById(id: string) {
    return api.get(`/allowance/${id}`);
  },

  async createAllowance(data: Record<string, unknown>) {
    const res = api.post("/allowance", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateAllowance(id: string, data: Record<string, unknown>) {
    return api.put(`/allowance/${id}`, data);
  },

  async deleteAllowance(id: string) {
    return api.delete(`/allowance/${id}`);
  },
};
