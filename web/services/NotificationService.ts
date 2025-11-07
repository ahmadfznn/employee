import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const NotificationService = {
  async getAllNotifications() {
    return api.get("/notification");
  },

  async getNotificationById(id: string) {
    return api.get(`/notification/${id}`);
  },

  async createNotification(data: Record<string, unknown>) {
    const res = api.post("/notification", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateNotification(id: string, data: Record<string, unknown>) {
    return api.put(`/notification/${id}/read`, data);
  },

  async deleteNotification(id: string) {
    return api.delete(`/notification/${id}`);
  },
};
