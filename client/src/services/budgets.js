import api from "./api";

export const getBudgets = (params) => api.get("/api/budgets", { params });
export const upsertBudget = (data) => api.post("/api/budgets", data);
export const deleteBudget = (id) => api.delete(`/api/budgets/${id}`);
export const getBudgetUsage = (month) =>
  api.get("/api/budgets/usage", { params: { month } });