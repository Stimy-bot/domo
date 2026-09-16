declare const useAuth: (opts?: {}) => {
    user: import("axios").AxiosResponse<any, any, {}, any> | undefined;
    isLoading: boolean;
    isAuthenticated: boolean;
};
export { useAuth };
//# sourceMappingURL=useAuth.d.ts.map