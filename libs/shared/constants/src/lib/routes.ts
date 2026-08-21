export const ROUTES = {
  ABOUT: '/about',
  CONTACT: '/contact',
  PROJECTS: '/projects',
  COMMENTS: '/comment',
  QUOTES: '/quote',
  COMPANIES: '/companies',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',

  // 🔑 FIX: Prefix SUPER_ADMIN and its sub-routes with /admin 
  // to match the TanStack Router path resolution (_admin route).
  SUPER_ADMIN: '/superAdminDashboard', 
  LOGIN: '/login',
  LOGOUT: '/logout',
  
  // Using the full path for sub-routes ensures reliable navigation
  AUDIT_LOGS: '/superAdminDashboard/audit-logs',
  USERS: '/superAdminDashboard/users',
  ROLES: '/superAdminDashboard/roles',
}