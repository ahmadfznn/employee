import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const companySettingService = {
  async getCompany() {
    return api.get("/company");
  },

  async createCompany(data: Record<string, unknown>) {
    const res = api.post("/company", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateCompany(data: Record<string, unknown>) {
    return api.put(`/company`, data);
  },

  async deleteCompany() {
    return api.delete(`/company`);
  },
};
