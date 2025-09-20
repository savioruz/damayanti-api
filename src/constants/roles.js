// User role constants
const USER_ROLES = {
  USER: 0,
  ADMIN: 1
};

// Role names for display purposes
const ROLE_NAMES = {
  [USER_ROLES.USER]: 'User',
  [USER_ROLES.ADMIN]: 'Admin'
};

// Helper functions
const isAdmin = (role) => role === USER_ROLES.ADMIN;
const isUser = (role) => role === USER_ROLES.USER;
const getRoleName = (role) => ROLE_NAMES[role] || 'Unknown';

module.exports = {
  USER_ROLES,
  ROLE_NAMES,
  isAdmin,
  isUser,
  getRoleName
};