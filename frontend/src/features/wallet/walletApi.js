import apiClient from '../../services/apiClient';

export const walletApi = {
  getOverview: () => apiClient.get('/wallet/overview'),
  getTransactions: (params = {}) => apiClient.get('/wallet/transactions', { params }),
  deposit: (data) => apiClient.post('/wallet/deposit', data),
  withdraw: (data) => apiClient.post('/wallet/withdraw', data),
};

