import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const RoleService = {
  async getAllRoles() {
    return api.get("/role");
  },

  async getRoleById(id: string) {
    return api.get(`/role/${id}`);
  },

  async createRole(data: Record<string, unknown>) {
    const res = api.post("/role", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateRole(id: string, data: Record<string, unknown>) {
    return api.put(`/role/${id}`, data);
  },

  async deleteRole(id: string) {
    return api.delete(`/role/${id}`);
  },
};
