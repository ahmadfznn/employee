import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const PayrollService = {
  async getAllPayrolls() {
    return api.get("/payroll");
  },

  async getPayrollById(id: string) {
    return api.get(`/payroll/${id}`);
  },

  async createPayroll(data: Record<string, unknown>) {
    const res = api.post("/payroll", data);
    const status = (await res).status;
    return status == 200;
  },

  async updatePayroll(id: string, data: Record<string, unknown>) {
    return api.put(`/payroll/${id}`, data);
  },

  async deletePayroll(id: string) {
    return api.delete(`/payroll/${id}`);
  },

  // Metode baru untuk generate payroll
  async generateAllPayrolls(month: string) {
    return api.post("/payroll/generate-all", { month });
  },
};
