// server/src/models/companyModel.ts
import { Db, ObjectId, Collection, IndexDescription } from 'mongodb';
import { companyCategoryEnum } from '@domo/schemas';

// 1) Address Interface
export interface CompanyAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  post_zip_code?: string;
}

// 2) Company Document Interface
export interface CompanyDocument {
  _id?: ObjectId;
  userId: ObjectId;
  company_name: string;
  company_email: string;
  company_description?: string;
  company_category: typeof companyCategoryEnum.options[number];
  company_phone?: string;
  company_website?: string;
  logo_url?: string;
  date_founded?: Date;
  address?: CompanyAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_LOGO_URL =
  'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png';

// 3) Collection Accessor Helper
export const getCompanyCollection = (
  db: Db
): Collection<CompanyDocument> => {
  return db.collection<CompanyDocument>('companies');
};

// 4) Index Initialization Setup
export async function initCompanyIndexes(db: Db): Promise<void> {
  const collection = getCompanyCollection(db);

  const indexes: IndexDescription[] = [
    { key: { company_email: 1 }, unique: true, name: 'uniq_company_email' },
    { key: { userId: 1 }, name: 'idx_company_userId' },
  ];

  await collection.createIndexes(indexes);
}

// 5) Default Document Formatter Helper
export function createCompanyPayload(
  payload: Partial<CompanyDocument> & {
    userId: ObjectId;
    company_name: string;
    company_email: string;
    company_category: typeof companyCategoryEnum.options[number];
  }
): Omit<CompanyDocument, '_id'> {
  const now = new Date();

  return {
    userId: payload.userId,
    company_name: payload.company_name.trim(),
    company_email: payload.company_email.trim().toLowerCase(),
    company_description: payload.company_description?.trim() ?? '',
    company_category: payload.company_category,
    company_phone: payload.company_phone?.trim() ?? '',
    company_website: payload.company_website?.trim() ?? '',
    logo_url: payload.logo_url?.trim() || DEFAULT_LOGO_URL,
    date_founded: payload.date_founded,
    address: {
      street: payload.address?.street?.trim() ?? '',
      city: payload.address?.city?.trim() ?? '',
      state: payload.address?.state?.trim() ?? '',
      country: payload.address?.country?.trim() ?? '',
      post_zip_code: payload.address?.post_zip_code?.trim() ?? '',
    },
    createdAt: now,
    updatedAt: now,
  };
}