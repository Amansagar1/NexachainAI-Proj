import apiClient from '../../services/apiClient';

export const investmentsApi = {
  getPlans: () => apiClient.get('/investments/plans'),
  createInvestment: (data) => apiClient.post('/investments', data),
  getInvestments: (params = {}) => apiClient.get('/investments', { params }),
  getInvestmentById: (id) => apiClient.get(`/investments/${id}`),
};
