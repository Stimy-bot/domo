import type { CreateCompany } from '@domo/schemas';
interface GetCompaniesParams {
    [key: string]: unknown;
}
export declare const createCompany: (data: CreateCompany) => Promise<import("axios").AxiosResponse<any, {
    company_category: "Sale" | "Service" | "Manufacturing" | "Transportation" | "Retail" | "Healthcare" | "Education" | "Technology" | "Finance" | "Government" | "Non-profit" | "Design" | "Web Development" | "Management" | "Marketing" | "Information Technology" | "Accounting" | "Legal" | "Media" | "Agriculture" | "Construction" | "Energy" | "Other";
    userId: string;
    company_name?: string | undefined;
    company_email?: string | undefined;
    company_description?: string | undefined;
    company_phone?: string | undefined;
    company_website?: string | undefined;
    logo_url?: string | undefined;
    date_founded?: string | undefined;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        post_zip_code?: string | undefined;
    } | undefined;
}, {}, any>>;
export declare const getCompanies: (params: GetCompaniesParams) => Promise<import("axios").AxiosResponse<any, any, {}, GetCompaniesParams>>;
export declare const getCompany: (companyId: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
export declare const updateCompany: (companyId: string, data: Partial<CreateCompany>) => Promise<import("axios").AxiosResponse<any, Partial<{
    company_category: "Sale" | "Service" | "Manufacturing" | "Transportation" | "Retail" | "Healthcare" | "Education" | "Technology" | "Finance" | "Government" | "Non-profit" | "Design" | "Web Development" | "Management" | "Marketing" | "Information Technology" | "Accounting" | "Legal" | "Media" | "Agriculture" | "Construction" | "Energy" | "Other";
    userId: string;
    company_name?: string | undefined;
    company_email?: string | undefined;
    company_description?: string | undefined;
    company_phone?: string | undefined;
    company_website?: string | undefined;
    logo_url?: string | undefined;
    date_founded?: string | undefined;
    address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        post_zip_code?: string | undefined;
    } | undefined;
}>, {}, any>>;
export declare const deleteCompany: (companyId: string) => Promise<import("axios").AxiosResponse<any, any, {}, any>>;
export {};
//# sourceMappingURL=company.d.ts.map