import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// Lead APIs
export const getLeads = (params) => api.get('/leads', { params });
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (data) => api.post('/leads', data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const addNote = (id, data) => api.post(`/leads/${id}/notes`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);

export default api;