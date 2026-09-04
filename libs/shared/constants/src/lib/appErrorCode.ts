export const AppErrorCode = {
  InvalidAccessToken: 'InvalidAccessToken',
  ForbiddenAccess: 'ForbiddenAccess',
  AccountInactive: 'AccountInactive',
  BadRequest: 'BadRequest',
} as const;

export type AppErrorCode = (typeof AppErrorCode)[keyof typeof AppErrorCode];
