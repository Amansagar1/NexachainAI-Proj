import apiClient from '../../services/apiClient';

export const roiApi = {
  getRoiHistory: (params = {}) => apiClient.get('/roi-history', { params }),
  triggerDailyRoi: (data = {}) => apiClient.post('/roi-history/process-daily', data),
};
