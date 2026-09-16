import { z } from 'zod';
export declare const isoDateSchema: z.ZodPreprocess<z.ZodDate, unknown>;
export declare const auditEventTypes: readonly ["role_change", "account_deletion", "user_login", "user_logout", "user_register", "email_verification", "password_reset", "custom_event", "user_update", "user_get_profile", "create_company", "update_company", "delete_company", "user_status_change", "dashboard_visit", "user_login_failed"];
export declare const auditEventTypeSchema: z.ZodEnum<{
    role_change: "role_change";
    user_register: "user_register";
    account_deletion: "account_deletion";
    user_login: "user_login";
    user_logout: "user_logout";
    email_verification: "email_verification";
    password_reset: "password_reset";
    custom_event: "custom_event";
    user_get_profile: "user_get_profile";
    user_update: "user_update";
    user_login_failed: "user_login_failed";
    create_company: "create_company";
    update_company: "update_company";
    delete_company: "delete_company";
    user_status_change: "user_status_change";
    dashboard_visit: "dashboard_visit";
}>;
export type AuditEventType = z.infer<typeof auditEventTypeSchema>;
export declare const baseLogFields: z.ZodObject<{
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    createdAt: z.ZodPreprocess<z.ZodDate, unknown>;
    ip: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$strip>;
export declare const dashboardVisitMetadataSchema: z.ZodObject<{
    path: z.ZodString;
    referrer: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    section: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    role: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>>;
    effectiveRoles: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    userAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ip: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    timestamp: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const roleChangeMetadataSchema: z.ZodObject<{
    previousRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    newRole: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const userLoginMetadataSchema: z.ZodObject<{
    method: z.ZodDefault<z.ZodEnum<{
        user_login_failed: "user_login_failed";
        password: "password";
        oauth: "oauth";
        magic_link: "magic_link";
    }>>;
    success: z.ZodDefault<z.ZodBoolean>;
    ipAddress: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    userAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$catchall<z.ZodAny>>;
export declare const userUpdateMetadataSchema: z.ZodObject<{
    fieldsChanged: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
}, z.core.$catchall<z.ZodAny>>;
export declare const emailVerificationMetadataSchema: z.ZodObject<{
    method: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"link">, z.ZodLiteral<"code">, z.ZodLiteral<"link_click">]>>>;
    verificationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const updateCompanyMetadataSchema: z.ZodObject<{
    fieldsChanged: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    companyId: z.ZodPreprocess<z.ZodString, unknown>;
}, z.core.$catchall<z.ZodAny>>;
export declare const customEventMetadataSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
export declare const auditEventMetadataMap: Record<AuditEventType, z.ZodTypeAny>;
export declare const auditLogSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    createdAt: z.ZodPreprocess<z.ZodDate, unknown>;
    ip: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$catchall<z.ZodAny>>, ...z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    createdAt: z.ZodPreprocess<z.ZodDate, unknown>;
    ip: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$catchall<z.ZodAny>>[]], "type">;
export declare const auditLogListSchema: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    createdAt: z.ZodPreprocess<z.ZodDate, unknown>;
    ip: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$catchall<z.ZodAny>>, ...z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    createdAt: z.ZodPreprocess<z.ZodDate, unknown>;
    ip: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$catchall<z.ZodAny>>[]], "type">>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export declare const createAuditLogInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
}, z.core.$strip>, ...z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "dashboard_visit">;
    metadata: z.ZodTypeAny<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
    target: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>>;
}, z.core.$strip>[]], "type">;
export type CreateAuditLogInput = z.infer<typeof createAuditLogInputSchema>;
//# sourceMappingURL=auditSchema.d.ts.map