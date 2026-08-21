import { ROUTES } from '@domo/constants'

export interface NavLink {
  title: string
  link: string
  role: string[]
}

export const navlinks: NavLink[] = [

  // Authenticated
  { title: 'About', link: ROUTES.ABOUT, role: ['user', 'admin', 'superAdmin'] },
  { title: 'Contact', link: ROUTES.CONTACT, role: ['user', 'admin', 'superAdmin'] },
    { title: 'Profile', link: ROUTES.PROFILE, role: ['user', 'admin', 'superAdmin'] },
  { title: 'Dashboard', link: ROUTES.DASHBOARD, role: ['user', 'admin', 'superAdmin'] },
  { title: 'Quote', link: ROUTES.QUOTES, role: ['user', 'admin', 'superAdmin'] },
  { title: 'Projects', link: ROUTES.PROJECTS, role: ['user', 'admin', 'superAdmin'] },
  { title: 'Companies', link: ROUTES.COMPANIES, role: ['user', 'admin', 'superAdmin'] },

  // Admins and SuperAdmins
  { title: 'Settings', link: ROUTES.SETTINGS, role: ['admin', 'superAdmin'] },

  // SuperAdmin only
  { title: 'Super Admin', link: ROUTES.SUPER_ADMIN, role: ['superAdmin'] },


  // Guest-only
    { title: 'Comments', link: ROUTES.COMMENTS, role: [] },
]