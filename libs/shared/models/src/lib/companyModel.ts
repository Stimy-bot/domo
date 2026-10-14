import { ObjectId, type Db } from 'mongodb';
import { companyCategoryEnum } from '@domo/schemas';

export type CompanyCategoryType = (typeof companyCategoryEnum.options)[number];

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  post_zip_code: string;
}

export interface CompanyInput {
  userId: ObjectId | string;
  company_name: string;
  company_email: string;
  company_category: string;
  company_description?: string;
  company_phone?: string;
  company_website?: string;
  logo_url?: string;
  date_founded?: Date | string;
  address?: Partial<Address>;
}

// Raw MongoDB document structure
export interface CompanyEntity {
  _id: ObjectId;
  userId: ObjectId;
  company_name: string;
  company_email: string;
  company_description: string;
  company_category: string;
  company_phone: string;
  company_website: string;
  logo_url: string;
  date_founded?: Date;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

// Formatted structure for API responses
export type SafeCompany = Omit<CompanyEntity, '_id' | 'userId'> & {
  _id: string;
  userId: string;
};

// --- Sanitization Helper ---

export function sanitizeCompany(company: CompanyEntity): SafeCompany {
  const { _id, userId, ...rest } = company;
  return {
    ...rest,
    _id: _id.toString(),
    userId: userId.toString(),
  };
}

// --- Factory for Creating Company Documents ---

export function buildCompanyDocument(
  input: CompanyInput,
): Omit<CompanyEntity, '_id'> {
  const now = new Date();

  const defaultAddress: Address = {
    street: input.address?.street?.trim() ?? '',
    city: input.address?.city?.trim() ?? '',
    state: input.address?.state?.trim() ?? '',
    country: input.address?.country?.trim() ?? '',
    post_zip_code: input.address?.post_zip_code?.trim() ?? '',
  };

  const parsedUserId =
    typeof input.userId === 'string' ? new ObjectId(input.userId) : input.userId;

  const parsedDateFounded = input.date_founded
    ? new Date(input.date_founded)
    : undefined;

  return {
    userId: parsedUserId,
    company_name: input.company_name.trim(),
    company_email: input.company_email.toLowerCase().trim(),
    company_description: input.company_description?.trim() ?? '',
    company_category: input.company_category,
    company_phone: input.company_phone?.trim() ?? '',
    company_website: input.company_website?.trim() ?? '',
    logo_url:
      input.logo_url?.trim() ||
      'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png',
    ...(parsedDateFounded && { date_founded: parsedDateFounded }),
    address: defaultAddress,
    createdAt: now,
    updatedAt: now,
  };
}

// --- Collection Index Setup ---

export async function ensureCompanyIndexes(db: Db): Promise<void> {
  const collection = db.collection<CompanyEntity>('companies');

  await collection.createIndexes([
    { key: { company_email: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { company_category: 1 } },
  ]);
}