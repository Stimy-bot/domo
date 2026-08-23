export const ROLES = ['user', 'admin', 'superAdmin'] as const;
export type RoleType = typeof ROLES[number];
export type Role = 'user' | 'admin' | 'superAdmin';
