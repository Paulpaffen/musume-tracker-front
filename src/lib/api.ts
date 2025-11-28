import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Character API
export const characterAPI = {
  getAll: () => api.get('/characters'),
  getOne: (id: string) => api.get(`/characters/${id}`),
  create: (data: any) => api.post('/characters', data),
  update: (id: string, data: any) => api.patch(`/characters/${id}`, data),
  delete: (id: string) => api.delete(`/characters/${id}`),
};

// Run API
export const runAPI = {
  getAll: (characterTrainingId?: string) =>
    api.get('/runs', { params: { characterTrainingId } }),
  getOne: (id: string) => api.get(`/runs/${id}`),
  create: (data: any) => api.post('/runs', data),
  update: (id: string, data: any) => api.patch(`/runs/${id}`, data),
  delete: (id: string) => api.delete(`/runs/${id}`),
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getCharacter: (id: string) => api.get(`/stats/character/${id}`),
};
