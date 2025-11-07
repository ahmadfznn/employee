import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const HolidayService = {
  async getAllHolidays() {
    return api.get("/holiday");
  },

  async getHolidayById(id: string) {
    return api.get(`/holiday/${id}`);
  },

  async createHoliday(data: Record<string, unknown>) {
    const res = api.post("/holiday", data);
    const status = (await res).status;
    return status == 200;
  },

  async updateHoliday(id: string, data: Record<string, unknown>) {
    return api.put(`/holiday/${id}`, data);
  },

  async deleteHoliday(id: string) {
    return api.delete(`/holiday/${id}`);
  },
};
