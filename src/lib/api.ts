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
  getAll: (params?: any) => api.get('/characters', { params }),
  getOne: (id: string) => api.get(`/characters/${id}`),
  create: (data: any) => api.post('/characters', data),
  update: (id: string, data: any) => api.patch(`/characters/${id}`, data),
  delete: (id: string) => api.delete(`/characters/${id}`),
};

// Run API
export const runAPI = {
  getAll: (params?: any) =>
    api.get('/runs', { params }),
  getOne: (id: string) => api.get(`/runs/${id}`),
  create: (data: any) => api.post('/runs', data),
  update: (id: string, data: any) => api.patch(`/runs/${id}`, data),
  delete: (id: string) => api.delete(`/runs/${id}`),
};

// Stats API
export const statsAPI = {
  getDashboard: (includeArchived?: boolean) => api.get('/stats/dashboard', { params: { includeArchived } }),
  getCharacter: (id: string) => api.get(`/stats/character/${id}`),
  getTrainingData: (trackType?: string) => api.get('/stats/training-data', { params: { trackType } }),
};

// Profile API
export const profileAPI = {
  getMe: () => api.get('/profile/me'),
  updateSettings: (data: any) => api.patch('/profile/settings', data),
  getPublicProfile: (friendCode: string) => api.get(`/profile/user/${friendCode}`),
  getUserStats: (friendCode: string) => api.get(`/profile/user/${friendCode}/stats`),
  getUserCharacters: (friendCode: string) => api.get(`/profile/user/${friendCode}/characters`),
  getUserBestRuns: (friendCode: string) => api.get(`/profile/user/${friendCode}/best-runs`),
};

// Friends API
export const friendsAPI = {
  list: () => api.get('/friends'),
  listRequests: () => api.get('/friends/requests'),
  addByCode: (friendCode: string) => api.post('/friends/add', { friendCode }),
  accept: (id: string) => api.patch(`/friends/${id}/accept`),
  remove: (id: string) => api.delete(`/friends/${id}`),
};

// OCR API
export const ocrAPI = {
  scan: (formData: FormData) =>
    api.post('/ocr/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  scanStats: (formData: FormData) =>
    api.post('/ocr/scan-stats', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  scanSkills: (formData: FormData) =>
    api.post('/ocr/scan-skills', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// Skills API
export const skillsAPI = {
  getAll: (search?: string) => api.get('/skills', { params: { search } }),
  getOne: (id: string) => api.get(`/skills/${id}`),
  create: (data: { name: string; isRare?: boolean }) => api.post('/skills', data),
  update: (id: string, data: { name?: string; isRare?: boolean }) => api.patch(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
  search: (query: string, limit?: number) => api.get('/skills/search', { params: { q: query, limit } }),
  seed: () => api.post('/skills/seed'),
};

