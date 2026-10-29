// ------------------------------ Format INR Currency ------------------------------
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
