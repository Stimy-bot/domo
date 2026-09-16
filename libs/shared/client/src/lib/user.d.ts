import type { QueryFunctionContext } from "@tanstack/react-query";
import type { GetUsersData, User, Role } from "@domo/types";
export declare const getUser: () => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
type UserUpdateData = Partial<User> & {
    password?: string;
    confirmPassword?: string;
};
export declare const update: (id: string, data: UserUpdateData) => Promise<User>;
export declare const deleteAccount: (userId: string, data: Record<string, unknown>) => Promise<User>;
export declare function fetchUserByRole(role: Role): Promise<{
    role: Role;
}>;
export declare function fetchCurrentUser(): Promise<User>;
export declare function fetchUserById({ queryKey, }: QueryFunctionContext<["userById", string]>): Promise<User>;
export declare function toggleUserStatus(userId: string, active: boolean): Promise<User>;
export declare const getUsers: (data?: GetUsersData) => Promise<import("axios").AxiosResponse<any, any, {}, GetUsersData>>;
export declare const getCurrentUser: () => Promise<User>;
export {};
//# sourceMappingURL=user.d.ts.map