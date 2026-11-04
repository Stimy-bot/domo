// libs/shared/services/src/lib/companyService.ts

import { BAD_REQUEST, NOT_FOUND } from '@domo/types';
import { appAssert } from '@domo/utils';
import { type Collection, type Db, ObjectId } from 'mongodb';

// Define the shape of your MongoDB document interface
export interface CompanyEntity {
  _id?: ObjectId;
  company_name: string;
  company_email: string;
  created_by: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export class CompanyService {
  private static getCollection({ db }: { db: Db }): Collection<CompanyEntity> {
    return db.collection<CompanyEntity>('companies');
  }

  // --- Get All Companies ---
  static async getCompanies(db: Db): Promise<CompanyEntity[]> {
    return await CompanyService.getCollection({ db }).find({}).sort({ createdAt: -1 }).toArray();
  }

  // --- Get Single Company By ID ---
  static async getCompanyById(db: Db, id: string | ObjectId): Promise<CompanyEntity> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;
    const company = await CompanyService.getCollection({ db }).findOne({ _id: objectId });

    appAssert(company, NOT_FOUND, 'Company not found');
    return company;
  }

  // --- Create Company ---
  static async createCompany(
    db: Db,
    data: Omit<CompanyEntity, '_id' | 'created_by' | 'createdAt' | 'updatedAt'> & {
      company_name: string;
      company_email: string;
    },
    userId: string | ObjectId,
  ): Promise<CompanyEntity> {
    const collection = CompanyService.getCollection({ db });

    // 1. Check duplicate company email directly on collection
    const existing = await collection.findOne({ company_email: data.company_email });
    appAssert(!existing, BAD_REQUEST, 'Company already exists');

    // 2. Prepare document with native timestamps and ObjectIds
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const now = new Date();

    const docToInsert: CompanyEntity = {
      ...data,
      created_by: userObjectId,
      createdAt: now,
      updatedAt: now,
    };

    // 3. Insert and return created document
    const result = await collection.insertOne(docToInsert);

    return {
      _id: result.insertedId,
      ...docToInsert,
    };
  }

  // --- Update Company ---
  static async updateCompany(
    db: Db,
    id: string | ObjectId,
    updateData: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    // Filter out _id or immutable fields from update set
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, ...fieldsToUpdate } = updateData;

    const result = await CompanyService.getCollection({ db }).findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...fieldsToUpdate,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' },
    );

    appAssert(result, NOT_FOUND, 'Company not found');
    return result;
  }

  // --- Delete Company ---
  static async deleteCompany(db: Db, id: string | ObjectId): Promise<boolean> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id;

    const result = await CompanyService.getCollection({ db }).deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }
}

export default CompanyService;
