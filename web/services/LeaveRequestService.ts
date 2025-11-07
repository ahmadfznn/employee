import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const LeaveRequestService = {
  async getAllLeaveRequests() {
    return api.get("/leave-request/date/2025-08-03");
  },

  async getLeaveRequestById(id: string) {
    return api.get(`/leave-request/${id}`);
  },

  async createLeaveRequest(data: Record<string, unknown>) {
    const res = api.post("/leave-request", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateLeaveRequest(id: string, data: Record<string, unknown>) {
    return api.put(`/leave-request/${id}`, data);
  },

  async deleteLeaveRequest(id: string) {
    return api.delete(`/leave-request/${id}`);
  },
};
