export declare const useOtpVerification: (phone: string) => {
    handleVerify: (code: string) => Promise<void>;
    handleResend: () => Promise<void>;
    resetStatus: () => void;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
    timer: number;
    canResend: boolean;
};
//# sourceMappingURL=useOtpVerification.d.ts.map