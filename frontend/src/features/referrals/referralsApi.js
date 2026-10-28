import apiClient from '../../services/apiClient';

export const referralsApi = {
  getDirectReferrals: () => apiClient.get('/referrals/direct'),
  getReferralTree: () => apiClient.get('/referrals/tree'),
  getReferralIncome: (params = {}) => apiClient.get('/referrals/income', { params }),
};
