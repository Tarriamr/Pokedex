// Helper function to remove password from user data
export const _sanitizeUserData = (user) => {
  if (!user) return null;
  // Use object destructuring to exclude the password field
  const { password, ...userData } = user;
  return userData;
};
