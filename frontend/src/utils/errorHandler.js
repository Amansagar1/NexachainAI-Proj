/**
 * Extract clean error message from API response or Error
 */
export const extractErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (typeof error === 'string') return error;

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};
