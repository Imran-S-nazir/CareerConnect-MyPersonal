import api from "../api/api";

export const getInternships = async (params = {}) => {
  const res = await api.get("/internships", { params });
  return res.data;
};

export const getInternshipCategories = async () => {
  const res = await api.get("/internships/categories");
  return res.data;
};

export const getInternshipById = async (id) => {
  const res = await api.get(`/internships/${id}`);
  return res.data;
};

export default {
  getInternships,
  getInternshipCategories,
  getInternshipById,
};
