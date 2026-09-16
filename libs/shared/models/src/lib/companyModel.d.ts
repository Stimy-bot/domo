import { Db, ObjectId, Collection } from 'mongodb';
import { companyCategoryEnum } from '@domo/schemas';
export interface CompanyAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    post_zip_code?: string;
}
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
export declare const getCompanyCollection: (db: Db) => Collection<CompanyDocument>;
export declare function initCompanyIndexes(db: Db): Promise<void>;
export declare function createCompanyPayload(payload: Partial<CompanyDocument> & {
    userId: ObjectId;
    company_name: string;
    company_email: string;
    company_category: typeof companyCategoryEnum.options[number];
}): Omit<CompanyDocument, '_id'>;
export declare class CompanyModel {
    /**
     * Find a company by ID
     */
    static findById(db: Db, id: string | ObjectId): Promise<CompanyDocument | null>;
    /**
     * Find a company by email (case-insensitive lookups should pass lowercased email)
     */
    static findByEmail(db: Db, email: string): Promise<CompanyDocument | null>;
    /**
     * List all companies
     */
    static findAll(db: Db): Promise<CompanyDocument[]>;
    /**
     * Insert a new company using formatted payload
     */
    static create(db: Db, payload: Partial<CompanyDocument> & {
        userId: ObjectId;
        company_name: string;
        company_email: string;
        company_category: typeof companyCategoryEnum.options[number];
    }): Promise<CompanyDocument>;
    /**
     * Update an existing company by ID
     */
    static updateById(db: Db, id: string | ObjectId, updateData: Partial<CompanyDocument>): Promise<CompanyDocument | null>;
    /**
     * Delete a company by ID
     */
    static deleteById(db: Db, id: string | ObjectId): Promise<boolean>;
}
export default CompanyModel;
//# sourceMappingURL=companyModel.d.ts.map