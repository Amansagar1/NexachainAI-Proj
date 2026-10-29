import apiClient from '../../services/apiClient';

export const authApi = {
  login: (data) => apiClient.post('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.patch('/auth/profile', data),
  updateSettings: (data) => apiClient.patch('/auth/settings', data),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
  logout: () => apiClient.post('/auth/logout'),
};
