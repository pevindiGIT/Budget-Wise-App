import api from "./api";

export const getIncome = (params) => api.get("/api/income", { params });
export const createIncome = (data) => api.post("/api/income", data);
export const updateIncome = (id, data) => api.put(`/api/income/${id}`, data);
export const deleteIncome = (id) => api.delete(`/api/income/${id}`);