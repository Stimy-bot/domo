export * from './lib/schemas.js';
export * from './lib/authSchema.js';
export * from './lib/userSchema.js';
export * from './lib/companySchema.js';
export * from './lib/auditMongoSchema.js';
export * from './lib/auditLogSchema.js';
// export * from './lib/auditSchema'
export * from './lib/primitives.js'
export type RoleType = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'admin' | 'superAdmin';
export const RoleType = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;