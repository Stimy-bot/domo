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
//# sourceMappingURL=audit.d.ts.map