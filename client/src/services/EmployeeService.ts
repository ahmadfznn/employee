import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const EmployeeService = {
  async getAllEmployees() {
    return api.get("/employee");
  },

  async getEmployeeById(id: string) {
    return api.get(`/employee/${id}`);
  },

  async createEmployee(data: Record<string, unknown>) {
    const res = api.post("/employee", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateEmployee(id: string, data: Record<string, unknown>) {
    return api.put(`/employee/${id}`, data);
  },

  async deleteEmployee(id: string) {
    return api.delete(`/employee/${id}`);
  },
};
