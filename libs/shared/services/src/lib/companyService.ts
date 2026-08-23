// src/services/companyService.ts
import { Db, ObjectId } from 'mongodb';
import {
  getCompanyCollection,
  createCompanyPayload,
  CompanyDocument,
} from '@domo/models';
import { CreateCompany, UpdateCompany } from '@domo/schemas';

export class CompanyService {
  // 1) Retrieve all companies
  public async getCompanies(db: Db): Promise<CompanyDocument[]> {
    return await getCompanyCollection(db).find().toArray();
  }

  // 2) Retrieve a single company by ID
  public async getCompanyById(
    db: Db,
    companyId: string
  ): Promise<CompanyDocument | null> {
    if (!ObjectId.isValid(companyId)) return null;

    return await getCompanyCollection(db).findOne({
      _id: new ObjectId(companyId),
    });
  }

  // 3) Create a new company
  public async createCompany(
    db: Db,
    companyData: CreateCompany,
    userId: string
  ): Promise<CompanyDocument> {
    const collection = getCompanyCollection(db);
    const { company_email, company_name } = companyData;

    if (!company_name && !company_email) {
      throw new Error('Bad Request: Must provide at least company name or email.');
    }

    if (company_email) {
      const existingCompany = await collection.findOne({
        company_email: company_email.toLowerCase().trim(),
      });
      if (existingCompany) {
        throw new Error('Bad Request: Company with this email already exists.');
      }
    }

const parsedDateFounded = companyData.date_founded
      ? new Date(companyData.date_founded)
      : undefined;

    const docToInsert = createCompanyPayload({
      ...companyData,
      company_name: company_name ?? '',
      company_email: company_email ?? '',
      date_founded: parsedDateFounded,
      userId: new ObjectId(userId),
    });    
    
    const result = await collection.insertOne(docToInsert as CompanyDocument);

    return {
      _id: result.insertedId,
      ...docToInsert,
    };
  }

  // 4) Update a company by ID
  public async updateCompany(
    db: Db,
    companyId: string,
    updateData: UpdateCompany
  ): Promise<CompanyDocument> {
    if (!ObjectId.isValid(companyId)) {
      throw new Error('Not Found: Invalid company ID.');
    }

    const collection = getCompanyCollection(db);

    // Normalize input fields if present
    const fieldsToUpdate: Record<string, any> = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (updateData.company_email) {
      fieldsToUpdate['company_email'] = updateData.company_email.toLowerCase().trim();
    }
    if (updateData.company_name) {
      fieldsToUpdate['company_name'] = updateData.company_name.trim();
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(companyId) },
      { $set: fieldsToUpdate },
      { returnDocument: 'after' }
    );

    if (!result) {
      throw new Error('Not Found: Company not found.');
    }

    return result;
  }

  // 5) Delete a company by ID
  public async deleteCompany(
    db: Db,
    companyId: string
  ): Promise<{ message: string }> {
    if (!ObjectId.isValid(companyId)) {
      throw new Error('Not Found: Invalid company ID.');
    }

    const result = await getCompanyCollection(db).deleteOne({
      _id: new ObjectId(companyId),
    });

    if (result.deletedCount === 0) {
      throw new Error('Not Found: Company not found.');
    }

    return { message: 'Company deleted successfully' };
  }
}

export default new CompanyService();