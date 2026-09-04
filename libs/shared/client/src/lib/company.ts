// src/api/company.ts
import { API } from '@domo/config';
import type { CreateCompany } from '@domo/schemas';

interface GetCompaniesParams {
  [key: string]: unknown;
}

// 🏗️ Create
export const createCompany = async (data: CreateCompany) =>
  API.post('/company/company', data);

// 🗃️ List all
export const getCompanies = async (params: GetCompaniesParams) =>
  API.get('/company/companies', { params });

// 🔍 Get one
export const getCompany = async (companyId: string) =>
  API.get(`/company/${companyId}`);

// 🔄 Update
export const updateCompany = async (companyId: string, data: Partial<CreateCompany>) =>
  API.put(`/company/${companyId}`, data);

// 🗑️ Delete
export const deleteCompany = async (companyId: string) =>
  API.delete(`/company/${companyId}`);