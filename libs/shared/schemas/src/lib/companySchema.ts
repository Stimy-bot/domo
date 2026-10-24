// libs/shared/schemas/src/lib/companySchema.ts
import { z } from 'zod';

export const usZipCode = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format' });

// 🔖 Category Enum: extracted for reuse in UI/forms/etc
export const companyCategoryEnum = z.enum([
  'Sale',
  'Service',
  'Manufacturing',
  'Transportation',
  'Retail',
  'Healthcare',
  'Education',
  'Technology',
  'Finance',
  'Government',
  'Non-profit',
  'Design',
  'Web Development',
  'Management',
  'Marketing',
  'Information Technology',
  'Accounting',
  'Legal',
  'Media',
  'Agriculture',
  'Construction',
  'Energy',
  'Other',
]);

export type CompanyCategory = z.infer<typeof companyCategoryEnum>;

// 🧱 Address Schema: reusable block
// 2) Address subschema
export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  post_zip_code: usZipCode.optional(),
});

// 3) Base company payload
export const baseCompany = z.object({
  userId: z.string(),
  company_name: z.string().min(3).optional(),
  company_email: z.email().max(255).optional(),
  company_description: z.string().optional(),
  company_phone: z.string().max(20).optional(),
  company_website: z.url().optional(),
  logo_url: z.url().optional(),
  date_founded: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  address: addressSchema.optional(),
  company_category: companyCategoryEnum,
});

export const companySchema = baseCompany.extend({ address: addressSchema });

export const updateCompanySchema = baseCompany.partial();

export const createCompanySchema = baseCompany.extend({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;
export type Company = z.infer<typeof companySchema>;
