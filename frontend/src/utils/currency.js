/**
 * Formats a number to Indian Rupee (INR) format (e.g., ₹ 12,750 or ₹ 12,750.50)
 */
export const formatINR = (amount, includeDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹ 0';
  }

  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals && num % 1 !== 0 ? 2 : 0,
  });

  return `₹ ${formatted}`;
};
