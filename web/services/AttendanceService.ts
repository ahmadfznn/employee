import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const AttendanceService = {
  async getAllAttendances() {
    return api.get("/attendance/date/2025-08-20");
  },

  async getAttendanceById(id: string) {
    return api.get(`/attendance/${id}`);
  },

  async createAttendance(data: Record<string, unknown>) {
    const res = api.post("/attendance", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateAttendance(id: string, data: Record<string, unknown>) {
    return api.put(`/attendance/${id}`, data);
  },

  async deleteAttendance(id: string) {
    return api.delete(`/attendance/${id}`);
  },
};
