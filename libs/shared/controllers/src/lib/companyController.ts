// libs/shared/controllers/src/lib/companyController.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Db } from 'mongodb';
import { ObjectId } from 'mongodb';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from '@domo/types';
import { catchErrors, appAssert } from '@domo/utils';
import { CompanyService } from '@domo/services';
import { CompanyModel } from '@domo/models';
import { createCompanySchema, updateCompanySchema } from '@domo/schemas';
import z from 'zod';

const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);

// Augment request type to recognize @fastify/mongodb decorations
type AuthenticatedRequest<T extends Record<string, unknown> = Record<string, never>> = FastifyRequest<{
  Params: T;
}> & {
  mongo?: {
    db?: Db;
  };
  user?: {
    _id?: ObjectId | string;
    email?: string;
    fullName?: string;
  };
  auditLog?: {
    type: string;
    actor: { _id?: ObjectId | string; email?: string; fullName?: string };
    target: { _id: ObjectId };
    metadata?: Record<string, unknown>;
  };
};

// Accept any AuthenticatedRequest parameter variant
const getDbInstance = (req: AuthenticatedRequest<any>): Db => {
  const db = req.mongo?.db || (req.server as unknown as { mongo?: { db?: Db } }).mongo?.db;
  appAssert(db, BAD_REQUEST, 'Database connection unavailable');
  return db;
};

export const getCompaniesHandler = catchErrors(
  async (req: AuthenticatedRequest, reply: FastifyReply) => {
    const db = getDbInstance(req);
    const companies = await CompanyService.getCompanies(db);
    return reply.code(OK).send(companies);
  }
);

export const getCompanyHandler = catchErrors(
  async (req: AuthenticatedRequest<{ id: string }>, reply: FastifyReply) => {
    const companyId = mongoIdSchema.parse(req.params.id);
    const user = req.user;
    appAssert(user, UNAUTHORIZED, 'Unauthorized');

    const db = getDbInstance(req);
    const company = await CompanyService.getCompanyById(db, companyId);
    appAssert(company, NOT_FOUND, 'Company not found');

    return reply.code(OK).send(company);
  }
);

export const companyHandler = catchErrors(
  async (req: AuthenticatedRequest, reply: FastifyReply) => {
    const parsed = createCompanySchema.parse(req.body);
    const { company_email, company_name } = parsed;
    const user = req.user;

    appAssert(user, UNAUTHORIZED, 'Unauthorized');
    const userId = user._id;
    appAssert(userId, UNAUTHORIZED, 'Unauthorized');
    appAssert(company_name, BAD_REQUEST, 'Company name is required');
    appAssert(company_email, BAD_REQUEST, 'Company email is required');

    const db = getDbInstance(req);

    // 1. Check for duplicate company via model helper
    const existingCompany = await CompanyModel.findByEmail(db, company_email);
    appAssert(!existingCompany, BAD_REQUEST, 'Company already exists');

    // 2. Create Company
    const savedCompany = await CompanyService.createCompany(
      db,
      { ...parsed, company_name, company_email },
      userId.toString()
    );

    // 3. Attach Audit Log
    const targetId = savedCompany._id instanceof ObjectId
      ? savedCompany._id
      : new ObjectId(savedCompany._id);

    req.auditLog = {
      type: 'create_company',
      actor: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      target: {
        _id: targetId,
      },
      metadata: {
        companyName: savedCompany.company_name,
      },
    };

    return reply.code(CREATED).send(savedCompany);
  }
);

export const updateCompanyHandler = catchErrors(
  async (req: AuthenticatedRequest<{ id: string }>, reply: FastifyReply) => {
    const updateData = updateCompanySchema.parse(req.body);
    const companyId = mongoIdSchema.parse(req.params.id);
    const user = req.user;

    appAssert(user, UNAUTHORIZED, 'Unauthorized');
    const userId = user._id;
    appAssert(userId, UNAUTHORIZED, 'Unauthorized');

    const db = getDbInstance(req);
    const updatedCompany = await CompanyService.updateCompany(db, companyId, updateData);
    appAssert(updatedCompany, NOT_FOUND, 'Company not found');

    req.auditLog = {
      type: 'update_company',
      actor: { _id: userId, email: user.email, fullName: user.fullName },
      target: { _id: new ObjectId(companyId) },
      metadata: { companyName: updatedCompany.company_name },
    };

    return reply.code(OK).send(updatedCompany);
  }
);

export const deleteCompanyHandler = catchErrors(
  async (req: AuthenticatedRequest<{ id: string }>, reply: FastifyReply) => {
    const companyId = mongoIdSchema.parse(req.params.id);
    const user = req.user;

    appAssert(user, UNAUTHORIZED, 'Unauthorized');
    const userId = user._id;
    appAssert(userId, UNAUTHORIZED, 'Unauthorized');

    const db = getDbInstance(req);
    const result = await CompanyService.deleteCompany(db, companyId);
    appAssert(result, NOT_FOUND, 'Company not found');

    req.auditLog = {
      type: 'delete_company',
      actor: { _id: userId, email: user.email, fullName: user.fullName },
      target: { _id: new ObjectId(companyId) },
      metadata: { message: 'Company deleted' },
    };

    return reply.code(OK).send({ message: 'Company deleted successfully' });
  }
);