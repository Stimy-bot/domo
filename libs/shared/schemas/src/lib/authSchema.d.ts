import { z } from 'zod';
export declare const emailSchema: z.ZodString;
export declare const firstNameSchema: z.ZodString;
export declare const lastNameSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const isAdminSchema: z.ZodBoolean;
export declare const profilePictureSchema: z.ZodString;
export declare const activeSchema: z.ZodBoolean;
export declare const roleSchema: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    user: "user";
    admin: "admin";
    superAdmin: "superAdmin";
}>, z.ZodArray<z.ZodEnum<{
    user: "user";
    admin: "admin";
    superAdmin: "superAdmin";
}>>]>>;
export declare const rolesArraySchema: z.ZodArray<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    user: "user";
    admin: "admin";
    superAdmin: "superAdmin";
}>, z.ZodArray<z.ZodEnum<{
    user: "user";
    admin: "admin";
    superAdmin: "superAdmin";
}>>]>>>;
export declare const phoneSchema: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
export declare const carrierSchema: z.ZodEnum<{
    att: "att";
    verizon: "verizon";
    tmobile: "tmobile";
}>;
export declare const otpSchema: z.ZodString;
export declare const bioSchema: z.ZodOptional<z.ZodString>;
export declare const genderSchema: z.ZodOptional<z.ZodEnum<{
    male: "male";
    female: "female";
    other: "other";
    prefer_not_to_say: "prefer_not_to_say";
}>>;
export declare const calculateAge: (birthDate: Date | string) => number;
export declare const birthDateSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodDate]>, z.ZodCoercedDate<string | number | Date>>;
export declare const ageSchema: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
export declare const familyNameSchema: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
/**
 * Verify OTP Schema
 * Used for: The final validation of the 6-digit code
 */
export declare const verifyOtpSchema: z.ZodPreprocess<z.ZodObject<{
    phone: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    otp: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, unknown>;
/**
 * Request OTP Schema
 * Used for: Passwordless Login Requests & Resending Registration Codes
 */
export declare const requestOtpSchema: z.ZodObject<{
    phone: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    channel: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        sms: "sms";
        call: "call";
    }>>>;
}, z.core.$strip>;
/**
 * Resend OTP Schema
 * Used for: Resending Registration Codes
 */
export declare const resendOtpSchema: z.ZodObject<{
    phone: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strip>;
/**
 * Login Schema
 * Used for: User Login
 */
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    userAgent: z.ZodOptional<z.ZodString>;
    otp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** * Register Schema
 * Used for: User Registration
 */
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    userAgent: z.ZodOptional<z.ZodString>;
    firstName: z.ZodString;
    lastName: z.ZodString;
    familyName: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    bio: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
        prefer_not_to_say: "prefer_not_to_say";
    }>>;
    birthDate: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodDate]>, z.ZodCoercedDate<string | number | Date>>;
    profilePicture: z.ZodOptional<z.ZodString>;
    isAdmin: z.ZodOptional<z.ZodBoolean>;
    role: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        user: "user";
        admin: "admin";
        superAdmin: "superAdmin";
    }>, z.ZodArray<z.ZodEnum<{
        user: "user";
        admin: "admin";
        superAdmin: "superAdmin";
    }>>]>>>;
    active: z.ZodOptional<z.ZodBoolean>;
    confirmPassword: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    phone: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    ip: z.ZodDefault<z.ZodString>;
    otp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** * Update Schema
 * Used for: Updating User Information
 */
export declare const updateSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    confirmPassword: z.ZodOptional<z.ZodString>;
    firstName: z.ZodOptional<z.ZodString>;
    familyName: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    lastName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
        prefer_not_to_say: "prefer_not_to_say";
    }>>>;
    birthDate: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodDate]>, z.ZodCoercedDate<string | number | Date>>>;
    profilePicture: z.ZodOptional<z.ZodString>;
    isAdmin: z.ZodOptional<z.ZodBoolean>;
    role: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
        user: "user";
        admin: "admin";
        superAdmin: "superAdmin";
    }>, z.ZodArray<z.ZodEnum<{
        user: "user";
        admin: "admin";
        superAdmin: "superAdmin";
    }>>]>>>;
    active: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    company: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    otp: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * verify email code Schema
 * Used for: Verifying User Email
 */
export declare const verificationCodeSchema: z.ZodString;
/**
 * Reset Password Schema
 * Used for: Resetting User Password
 */
export declare const resetPasswordSchema: z.ZodObject<{
    password: z.ZodString;
    verificationCode: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=authSchema.d.ts.map