export const Audience = {
  User: 'User',
  Admin: 'Admin',
  SuperAdmin: 'SuperAdmin',
} as const;

export type Audience = (typeof Audience)[keyof typeof Audience];
