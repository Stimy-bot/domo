// libs/shared-constants/src/lib/verificationCodeType.ts
const VerificationCodeType = {
  EmailVerification: 'EmailVerification',
  PasswordReset: 'PasswordReset',
  SmsOtp: 'SmsOtp',
} as const;

export { VerificationCodeType };
