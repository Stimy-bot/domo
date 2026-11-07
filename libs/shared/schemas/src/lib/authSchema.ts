// lids/schemas/src/lib/authSchema.ts
import { z } from 'zod';

// ─────────────────────────────────────────────
//  Basic validators
// ─────────────────────────────────────────────

export const emailSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

export const firstNameSchema = z.string().trim().min(3).max(32);
export const lastNameSchema = z.string().trim().min(3).max(32);

export const passwordSchema = z
  .string()
  .trim()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(32)
  .regex(/^(?=.*\d)(?=.*[@#\-_$%^&+=§!?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!?]+$/, {
    message: 'Password must contain uppercase, lowercase, number, and special char',
  });

export const isAdminSchema = z.boolean();
export const profilePictureSchema = z.string();
export const activeSchema = z.boolean();
export const roleSchema = z
  .union([
    z.enum(['user', 'admin', 'superAdmin']),
    z.array(z.enum(['user', 'admin', 'superAdmin'])),
  ])
  .optional();
export const rolesArraySchema = z.array(roleSchema);
const companySchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId format' });
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, {
    message: 'Invalid phone number format (E.164)',
  })
  .transform((val) => (val.startsWith('+') ? val : `+${val}`));
export const carrierSchema = z.enum(['att', 'verizon', 'tmobile']);
export const otpSchema = z
  .string()
  .trim()
  .length(6, { message: 'OTP must be 6 digits' })
  .regex(/^\d{6}$/, { message: 'OTP must be numeric' });

export const bioSchema = z.string().trim().max(255).optional();

export const genderSchema = z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional();

export const calculateAge = (birthDate: Date | string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const birthDateSchema = z
  .union([z.string(), z.number(), z.date()], {
    message: 'Birth date is required',
  })
  .pipe(z.coerce.date({ message: 'Invalid date format' }))
  .refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid date format',
  })
  .refine((date) => calculateAge(date) >= 18, {
    message: 'You must be at least 18 years old',
  });

export const ageSchema = z.coerce.number().min(18).max(120).optional();

export const familyNameSchema = z.string().trim().min(3).max(64).optional().or(z.literal(''));

// ─────────────────────────────────────────────
//  Schemas
// ─────────────────────────────────────────────

/**
 * Verify OTP Schema
 * Used for: The final validation of the 6-digit code
 */
export const verifyOtpSchema = z.preprocess(
  (input) => {
    if (typeof input === 'object' && input !== null) {
      const obj = input as Record<string, unknown>;
      // Accept either `code` or `otp` from clients
      if (obj['code'] && !obj['otp']) obj['otp'] = obj['code'];
      if (obj['otp'] != null) obj['otp'] = String(obj['otp']);
      return obj;
    }
    return input;
  },
  z.object({
    phone: phoneSchema,
    otp: z.string().length(6, { message: 'OTP must be exactly 6 digits' }),
    userId: z.string().optional(),
  }),
);

/**
 * Request OTP Schema
 * Used for: Passwordless Login Requests & Resending Registration Codes
 */
export const requestOtpSchema = z.object({
  phone: phoneSchema,
  channel: z.enum(['sms', 'call']).default('sms').optional(),
});

/**
 * Resend OTP Schema
 * Used for: Resending Registration Codes
 */
export const resendOtpSchema = z.object({
  phone: phoneSchema,
});

/**
 * Login Schema
 * Used for: User Login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
  otp: otpSchema.optional(),
});

/** * Register Schema
 * Used for: User Registration
 */
export const registerSchema = loginSchema
  .extend({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    familyName: familyNameSchema,
    bio: bioSchema,
    age: ageSchema,
    gender: genderSchema,
    birthDate: birthDateSchema,
    profilePicture: profilePictureSchema.optional(),
    isAdmin: isAdminSchema.optional(),
    role: roleSchema.optional(),
    active: activeSchema.optional(),
    confirmPassword: passwordSchema.optional(),
    company: companySchema.optional(),
    phone: phoneSchema,
    ip: z.string().default('unknown'),
    otp: otpSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const baseUpdate = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  firstName: firstNameSchema,
  familyName: familyNameSchema,
  lastName: lastNameSchema,
  bio: bioSchema,
  gender: genderSchema,
  birthDate: birthDateSchema,
  profilePicture: z.string(),
  isAdmin: z.boolean(),
  role: roleSchema,
  active: z.boolean().optional(),
  company: companySchema,
  phone: phoneSchema,
  otp: otpSchema,
  userAgent: z.string(),
});

/** * Update Schema
 * Used for: Updating User Information
 */
export const updateSchema = baseUpdate.partial().refine(
  (data) => {
    if (data.password == null && data.confirmPassword == null) return true;
    return data.password === data.confirmPassword;
  },
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  },
);

/**
 * verify email code Schema
 * Used for: Verifying User Email
 */
export const verificationCodeSchema = z.string().min(1).max(24);

/**
 * Reset Password Schema
 * Used for: Resetting User Password
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
