import api from "./api";

export const getGoals = () => api.get("/api/goals");
export const createGoal = (data) => api.post("/api/goals", data);
export const updateGoal = (id, data) => api.put(`/api/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/api/goals/${id}`);