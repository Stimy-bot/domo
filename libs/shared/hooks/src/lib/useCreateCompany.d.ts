export declare const useCreateCompany: () => import("@tanstack/react-query").UseMutationResult<any, Error, Omit<{
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
}, "userId">, unknown>;
//# sourceMappingURL=useCreateCompany.d.ts.map