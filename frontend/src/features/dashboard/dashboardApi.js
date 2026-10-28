import apiClient from '../../services/apiClient';

export const dashboardApi = {
  getSummary: () => apiClient.get('/dashboard/summary'),
  getEarnings: (period = '30d') => apiClient.get(`/dashboard/earnings?period=${period}`),
};
