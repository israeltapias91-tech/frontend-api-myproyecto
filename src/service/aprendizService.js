import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1/aprendiz";

export const getAprendices = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

export const getAprendizById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

export const createAprendiz = async (datos) => {
  const response = await axios.post(API_BASE, datos, { 
    headers: { "Content-Type": "application/json" } 
  });
  return response.data;
};

export const updateAprendiz = async (id, datos) => {
  const response = await axios.put(`${API_BASE}/${id}`, datos, { 
    headers: { "Content-Type": "application/json" } 
  });
  return response.data;
};

export const deleteAprendiz = async (id) => {
  const response = await axios.delete(`${API_BASE}/${id}`);
  return response.data;
};