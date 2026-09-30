// libs/shared/ui-header/src/lib/navbarLinks.tsx

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
export interface NavLink {
  title: string;
  link: string;
  role: string[];
}

export const navbarLinks: NavLink[] = [
  // Authenticated
  { title: 'About', link: ROUTES.ABOUT, role: ['user', 'admin', 'superAdmin'] },
  {
    title: 'Contact',
    link: ROUTES.CONTACT,
    role: ['user', 'admin', 'superAdmin'],
  },
  {
    title: 'Profile',
    link: ROUTES.PROFILE,
    role: ['user', 'admin', 'superAdmin'],
  },
  {
    title: 'Dashboard',
    link: ROUTES.DASHBOARD,
    role: ['user', 'admin', 'superAdmin'],
  },
  {
    title: 'Quote',
    link: ROUTES.QUOTES,
    role: ['user', 'admin', 'superAdmin'],
  },
  {
    title: 'Projects',
    link: ROUTES.PROJECTS,
    role: ['user', 'admin', 'superAdmin'],
  },
  {
    title: 'Companies',
    link: ROUTES.COMPANIES,
    role: ['user', 'admin', 'superAdmin'],
  },

  // Admins and SuperAdmins
  { title: 'Settings', link: ROUTES.SETTINGS, role: ['admin', 'superAdmin'] },

  // SuperAdmin only
  { title: 'Super Admin', link: ROUTES.SUPER_ADMIN, role: ['superAdmin'] },

  // Guest-only
  { title: 'Comments', link: ROUTES.COMMENTS, role: [] },
];
