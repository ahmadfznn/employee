import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const ProfileService = {
  async getAllProfile() {
    return api.get("/me");
  },

  async updateProfile(id: string, data: Record<string, unknown>) {
    return api.put(`/employee/${id}`, data);
  },

  async deleteProfile(id: number) {
    return api.delete(`/employee/${id}`);
  },
};
