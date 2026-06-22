import api from "./api";

export const getSummary = (month) =>
  api.get("/api/dashboard/summary", { params: { ...(month ? { month } : {}) } });