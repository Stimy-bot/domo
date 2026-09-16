type RegisterData = {
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    bio?: string;
    gender?: string;
    birthDate?: Date;
    firstName: string;
    lastName: string;
};
export declare const register: (data: RegisterData) => Promise<any>;
type LoginData = {
    email: string;
    password: string;
};
export declare const login: (data: LoginData) => Promise<import("axios").AxiosResponse<any, LoginData, {}, any>>;
export declare const logout: () => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
export declare const verifyEmail: (verificationCode: string) => Promise<any>;
export declare const sendPasswordResetEmail: (email: string) => Promise<import("axios").AxiosResponse<any, {
    email: string;
}, {}, any>>;
export declare const resetPassword: ({ verificationCode, password, }: {
    verificationCode: string;
    password: string;
}) => Promise<import("axios").AxiosResponse<any, {
    verificationCode: string;
    password: string;
}, {}, any>>;
export declare const getSessions: () => Promise<any>;
export declare const deleteSession: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
export declare const getNewRefreshToken: () => Promise<{
    token: string;
}>;
export declare const verifyOtp: (phone: string, code: string) => Promise<any>;
export declare const resendOtp: (phone: string) => Promise<any>;
export {};
//# sourceMappingURL=auth.d.ts.map