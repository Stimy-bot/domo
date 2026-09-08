import { useMutation } from '@tanstack/react-query';
import {useAuth} from './useAuth';
import { createCompany } from '@domo/client';
import { createCompanySchema, type CreateCompany } from '@domo/schemas';
import { validateZod } from '@domo/validates';

export const useCreateCompany = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (formData: Omit<CreateCompany, 'userId'>) => {
      if (!user) throw new Error('User is not authenticated');

      const enrichedData: CreateCompany = {
        ...formData,
        userId: user._id,
      };

      const validation = await validateZod(createCompanySchema, enrichedData);

      if (!validation.success) {
        throw new Error(JSON.stringify(validation.errors));
      }

      const response = await createCompany(validation.data);
      return response.data;
    },
  });
};