// server/src/models/companyModel.ts

import type { companyCategoryEnum } from '@domo/schemas';
import { type Collection, type Db, type IndexDescription, ObjectId } from 'mongodb';

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
  company_category: (typeof companyCategoryEnum.options)[number];
  company_phone?: string;
  company_website?: string;
  logo_url?: string;
  date_founded?: Date;
  address?: CompanyAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

const DEFAULT_LOGO_URL = 'https://cdn.pixabay.com/photo/2017/06/13/12/53/profile-2398782_640.png';

// 3) Collection Accessor Helper
export const getCompanyCollection = (db: Db): Collection<CompanyDocument> => {
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
    company_category: (typeof companyCategoryEnum.options)[number];
  },
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
    date_founded: payload.date_founded ? new Date(payload.date_founded) : undefined,
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

// 6) Model Class / DAO Layer
export class CompanyModel {
  /**
   * Find a company by ID
   */
  static async findById(db: Db, id: string | ObjectId): Promise<CompanyDocument | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    return getCompanyCollection(db).findOne({ _id });
  }

  /**
   * Find a company by email (case-insensitive lookups should pass lowercased email)
   */
  static async findByEmail(db: Db, email: string): Promise<CompanyDocument | null> {
    return getCompanyCollection(db).findOne({
      company_email: email.trim().toLowerCase(),
    });
  }

  /**
   * List all companies
   */
  static async findAll(db: Db): Promise<CompanyDocument[]> {
    return getCompanyCollection(db).find().sort({ createdAt: -1 }).toArray();
  }

  /**
   * Insert a new company using formatted payload
   */
  static async create(
    db: Db,
    payload: Partial<CompanyDocument> & {
      userId: ObjectId;
      company_name: string;
      company_email: string;
      company_category: (typeof companyCategoryEnum.options)[number];
    },
  ): Promise<CompanyDocument> {
    const documentToInsert = createCompanyPayload(payload);
    const result = await getCompanyCollection(db).insertOne(documentToInsert);

    return {
      _id: result.insertedId,
      ...documentToInsert,
    };
  }

  /**
   * Update an existing company by ID
   */
  static async updateById(
    db: Db,
    id: string | ObjectId,
    updateData: Partial<CompanyDocument>,
  ): Promise<CompanyDocument | null> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;

    // Prevent direct modification of immutable structural fields
    delete updateData._id;
    delete updateData.createdAt;

    const setPayload: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (updateData.company_email) {
      setPayload.company_email = updateData.company_email.trim().toLowerCase();
    }

    const result = await getCompanyCollection(db).findOneAndUpdate(
      { _id },
      { $set: setPayload },
      { returnDocument: 'after' },
    );

    return result;
  }

  /**
   * Delete a company by ID
   */
  static async deleteById(db: Db, id: string | ObjectId): Promise<boolean> {
    const _id = typeof id === 'string' ? new ObjectId(id) : id;
    const result = await getCompanyCollection(db).deleteOne({ _id });
    return result.deletedCount === 1;
  }
}

export default CompanyModel;
