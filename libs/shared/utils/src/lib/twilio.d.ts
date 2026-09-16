export declare const startVerification: (phone: string) => Promise<import("twilio/lib/rest/verify/v2/service/verification").VerificationInstance | {
    sid: string;
    status: string;
}>;
export declare const checkVerification: (phone: string, otp: string | number) => Promise<import("twilio/lib/rest/verify/v2/service/verificationCheck").VerificationCheckInstance | {
    status: string;
}>;
//# sourceMappingURL=twilio.d.ts.map