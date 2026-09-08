// libs/shared/constants/src/lib/queryKeys.ts

// Authentication
export const AUTH_QUERY_KEY = ['auth'] as const;

// Roles
export const USER_ROLES_QUERY_KEY = ['userRoles'] as const;
export const USER_ROLE_QUERY_KEY = (role: string) => ['userRole', role] as const;
export const ROLES_QUERY_KEY = ['roles'] as const;

// Users
export const USERS_QUERY_KEY = ['users'] as const;
export const USER_QUERY_KEY = ['user'] as const;
export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const;
export const USER_BY_ID_QUERY_KEY = (id: string) => ['userById', id] as const;

// Session
export const SESSION_QUERY_KEY = ['session'] as const;
export const SESSIONS_QUERY_KEY = ['sessions'] as const;

// Add other query keys here as your application grows