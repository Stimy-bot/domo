export interface User {
    id: string;
    fullName: string;
    role: string[];
    profilePicture?: string;
    _id?: string;
    firstName?: string;
    data?: {
        profilePicture?: string;
        _id?: string;
    };
}
interface AuthState {
    user: User | null;
    setUser: (u: User | null) => void;
    clearUser: () => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export type AuthStoreState = ReturnType<typeof useAuthStore.getState>;
export {};
//# sourceMappingURL=auth.store.d.ts.map