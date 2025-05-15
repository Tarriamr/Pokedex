// Helper to safely get a number, defaulting to a specified value (or 0)
export const safeGetNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  // Check for NaN specifically
  return isNaN(num) ? defaultValue : num;
};
