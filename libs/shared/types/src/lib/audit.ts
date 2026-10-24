// libs/shared/types/src/lib/audit.ts

// Keep shared types independent from the schemas package to avoid a circular
// dependency through the constants package.
export type Actor = {
  id: string;
  [key: string]: unknown;
};
export type Target = Actor;

export type AuditLog = {
  type: string;
  [key: string]: unknown;
};

export type AuditEventType = AuditLog['type'];
