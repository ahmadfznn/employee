import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const DepartmentService = {
  async getAllDepartments() {
    return api.get("/department");
  },

  async getDepartmentById(id: string) {
    return api.get(`/department/${id}`);
  },

  async createDepartment(data: Record<string, unknown>) {
    const res = api.post("/department", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateDepartment(id: string, data: Record<string, unknown>) {
    return api.put(`/department/${id}`, data);
  },

  async deleteDepartment(id: string) {
    return api.delete(`/department/${id}`);
  },
};
