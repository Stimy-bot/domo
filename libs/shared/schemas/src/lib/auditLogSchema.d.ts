import { z } from 'zod';
export declare const userRefSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$strip>;
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
    all_accounts_deletion: "all_accounts_deletion";
    dashboard_visit: "dashboard_visit";
    otp_verification: "otp_verification";
    otp_request: "otp_request";
    otp_failed: "otp_failed";
    otp_resend: "otp_resend";
    sms_delivery_callback: "sms_delivery_callback";
    user_register_conflict: "user_register_conflict";
}>;
export type AuditEventType = z.infer<typeof auditEventTypeSchema>;
export declare const otp_resendMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        timeout: "timeout";
        forced: "forced";
    }>;
}, z.core.$catchall<z.ZodUnknown>>;
export declare const otp_failedMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        timeout: "timeout";
        forced: "forced";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const otpRequestMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        timeout: "timeout";
        forced: "forced";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const smsDeliveryCallbackMetadataSchema: z.ZodObject<{
    status: z.ZodString;
    deliveryId: z.ZodString;
    phoneNumber: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const dashboardVisitMetadataSchema: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    referrer: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    section: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>;
    effectiveRoles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    userAgent: z.ZodOptional<z.ZodString>;
    ip: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const userRegisterConflictMetadataSchema: z.ZodObject<{
    email: z.ZodString;
    existingUserId: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    existingUserEmail: z.ZodOptional<z.ZodString>;
    existingUserFullName: z.ZodOptional<z.ZodString>;
    attemptedUserAgent: z.ZodOptional<z.ZodString>;
    attemptedIp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const roleChangeMetadataSchema: z.ZodObject<{
    previousRole: z.ZodString;
    newRole: z.ZodString;
    changedBy: z.ZodPreprocess<z.ZodString, unknown>;
}, z.core.$strip>;
export declare const accountDeletionMetadataSchema: z.ZodObject<{
    reason: z.ZodEnum<{
        user_request: "user_request";
        admin_action: "admin_action";
        inactivity: "inactivity";
    }>;
    deletedBy: z.ZodPreprocess<z.ZodString, unknown>;
}, z.core.$strip>;
export declare const userLoginMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        user_login_failed: "user_login_failed";
        password: "password";
        oauth: "oauth";
        magic_link: "magic_link";
    }>;
    userAgent: z.ZodOptional<z.ZodString>;
    success: z.ZodBoolean;
}, z.core.$strip>;
export declare const userLogoutMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        timeout: "timeout";
        forced: "forced";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const userRegisterMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        oauth: "oauth";
        invite: "invite";
        sms: "sms";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const emailVerificationMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        link_click: "link_click";
        code_entry: "code_entry";
    }>;
    verificationId: z.ZodString;
    email: z.ZodString;
}, z.core.$strip>;
export declare const passwordResetMetadataSchema: z.ZodObject<{
    resetMethod: z.ZodEnum<{
        email: "email";
        sms: "sms";
    }>;
    resetToken: z.ZodString;
    success: z.ZodBoolean;
}, z.core.$strip>;
export declare const userUpdateMetadataSchema: z.ZodObject<{
    method: z.ZodEnum<{
        manual: "manual";
        oauth: "oauth";
        sms: "sms";
        link_click: "link_click";
        webhook: "webhook";
        passwordless: "passwordless";
    }>;
    sessionId: z.ZodOptional<z.ZodString>;
    success: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const customEventMetadataSchema: z.ZodRecord<z.ZodString, z.ZodAny>;
export declare const userGetProfileMetadataSchema: z.ZodObject<{
    success: z.ZodBoolean;
}, z.core.$strip>;
export declare const createCompanyMetadataSchema: z.ZodObject<{
    companyName: z.ZodString;
    companyId: z.ZodPreprocess<z.ZodString, unknown>;
}, z.core.$strip>;
export declare const updateCompanyMetadataSchema: z.ZodObject<{
    companyId: z.ZodPreprocess<z.ZodString, unknown>;
    updatedFields: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const deleteCompanyMetadataSchema: z.ZodObject<{
    companyId: z.ZodPreprocess<z.ZodString, unknown>;
    companyName: z.ZodString;
}, z.core.$strip>;
export declare const userStatusChangeMetadataSchema: z.ZodObject<{
    previousStatus: z.ZodOptional<z.ZodBoolean>;
    newStatus: z.ZodOptional<z.ZodBoolean>;
    changedBy: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const allAccountsDeletionMetadataSchema: z.ZodObject<{
    method: z.ZodOptional<z.ZodString>;
    success: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
    deletedCount: z.ZodNumber;
}, z.core.$strip>;
export declare const otpVerificationMetadataSchema: z.ZodObject<{
    method: z.ZodOptional<z.ZodString>;
    success: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DashboardVisitMetadata = z.infer<typeof dashboardVisitMetadataSchema>;
export type UserLoginMetadata = z.infer<typeof userLoginMetadataSchema>;
export declare const createAuditLogInputSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"role_change" | "user_register" | "account_deletion" | "user_login" | "user_logout" | "email_verification" | "password_reset" | "custom_event" | "user_get_profile" | "user_update" | "user_login_failed" | "create_company" | "update_company" | "delete_company" | "user_status_change" | "all_accounts_deletion" | "dashboard_visit" | "otp_verification" | "otp_request" | "otp_failed" | "otp_resend" | "sms_delivery_callback" | "user_register_conflict">;
    metadata: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    actor: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    target: z.ZodOptional<z.ZodObject<{
        _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
        email: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
        fullName: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    }, z.core.$strip>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>], "type">;
export type CreateAuditLogInput = z.infer<typeof createAuditLogInputSchema>;
export declare const auditLogSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>], "type">;
export type AuditLog = z.infer<typeof auditLogSchema>;
export declare const auditLogListSchema: z.ZodArray<z.ZodPreprocess<z.ZodDiscriminatedUnion<[z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>, z.ZodObject<{
    readonly [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    _id: z.ZodPreprocess<z.ZodString, unknown>;
    createdAt: z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>;
}, z.core.$strip>], "type">, unknown>>;
export type AuditLogList = z.infer<typeof auditLogListSchema>;
export declare const auditLogFilterSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    actorId: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    targetId: z.ZodOptional<z.ZodPreprocess<z.ZodString, unknown>>;
    type: z.ZodOptional<z.ZodEnum<{
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
        all_accounts_deletion: "all_accounts_deletion";
        dashboard_visit: "dashboard_visit";
        otp_verification: "otp_verification";
        otp_request: "otp_request";
        otp_failed: "otp_failed";
        otp_resend: "otp_resend";
        sms_delivery_callback: "sms_delivery_callback";
        user_register_conflict: "user_register_conflict";
    }>>;
    ip: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodOptional<z.ZodObject<{
        gt: z.ZodOptional<z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>>;
        gte: z.ZodOptional<z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>>;
        lt: z.ZodOptional<z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>>;
        lte: z.ZodOptional<z.ZodPipe<z.ZodCoercedDate<unknown>, z.ZodTransform<string, Date>>>;
    }, z.core.$strip>>;
    limit: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type AuditLogFilter = z.infer<typeof auditLogFilterSchema>;
//# sourceMappingURL=auditLogSchema.d.ts.map