export * from './lib/schemas';
export * from './lib/authSchema';
export * from './lib/userSchema';
export * from './lib/companySchema';
export * from './lib/auditMongoSchema';
export * from './lib/auditLogSchema';
export * from './lib/primitives'
export type RoleType = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'admin' | 'superAdmin';
export const RoleType = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;