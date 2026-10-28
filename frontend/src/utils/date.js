/**
 * Date formatting utilities
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return date.toLocaleDateString('en-US', defaultOptions);
};

export const formatShortDate = (dateString) => {
  return formatDate(dateString, { month: 'short', day: 'numeric' });
};
