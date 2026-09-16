export type Role = "user" | "admin" | "superAdmin";
export interface GetUsersData {
    q?: string;
    page?: number;
    limit?: number;
    search?: string;
    role?: string | string[];
    status?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    bio?: string;
    phone?: string;
    fullName?: string;
    createdAt?: string;
    updatedAt?: string;
    profilePicture?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    isVerified?: boolean;
    isAdmin?: boolean;
    permission?: string;
    active?: boolean;
}
export interface UpdateApiPayload {
    id: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    gender?: string;
    birthDate?: string;
    bio?: string;
    phone?: string;
    role?: Role[] | Role;
    active?: boolean;
    verified?: boolean;
    company?: string;
}
export interface User {
    id?: string;
    _id?: string;
    company?: string;
    email?: string;
    phone?: string;
    gender?: string;
    birthDate?: Date;
    bio?: string;
    firstName: string;
    password?: string;
    confirmPassword?: string;
    lastName: string;
    fullName?: string;
    profilePicture?: string;
    isAdmin: boolean;
    role: Role[];
    active: boolean;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    otp?: string;
    __v?: number;
}
//# sourceMappingURL=user.types.d.ts.map