export declare function fetchAuditLogs(params?: Record<string, any>): Promise<unknown[]>;
export declare function getAuditLogById(id: string): Promise<Record<string, unknown>>;
export declare function createAuditLog(input: any): Promise<Record<string, unknown>>;
export declare function deleteAuditLogById(id: string): Promise<any>;
export declare function deleteAuditLogs(params?: {
    type?: string;
    actorId?: string;
    startDate?: string;
    endDate?: string;
    confirm?: boolean;
}): Promise<any>;
//# sourceMappingURL=audit.d.ts.map