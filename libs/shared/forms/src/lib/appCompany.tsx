// libs/shared/forms/src/lib/appCompany.tsx

import { emailRegex, phoneRegex, urlRegex } from '@domo/constants';
import { useAuth, useCreateCompany } from '@domo/hooks';
import {
  EmailInput,
  type FieldConfig,
  FormFactory,
  MainLayout,
  PhoneNumberInput,
  SelectInput,
  StyledDatePicker,
  type SubmissionResult,
  TextArea,
  TextInput,
} from '@domo/reusableComponents';
import { type addressSchema, type CreateCompany, companyCategoryEnum } from '@domo/schemas';
import { formatNameToTitle } from '@domo/utils';
import { format } from 'date-fns';
import type React from 'react';
import type z from 'zod';

// Define the structure for the company form values (matching your schema)
type CompanyFormValues = {
  email: string;
  company_name: string;
  firstName: string;
  lastName: string;
  company_email: string;
  company_description: string;
  company_category: z.infer<typeof companyCategoryEnum> | '';
  logo_url: string;
  company_phone: string;
  company_website: string;
  date_founded: string;
  address: z.infer<typeof addressSchema> | '';
};

// Helper to determine the type used by the mutation
type CreateCompanyPayload = CreateCompany;
// Options for the SelectInput component
const categoryOptions = companyCategoryEnum.options.map((value) => ({
  value,
  label: formatNameToTitle(value),
}));

function AppCompany() {
  const { user } = useAuth();
  const createCompanyMutation = useCreateCompany();

  const companyFormOptions = {
    defaultValues: {
      email: user?.data?.email || '', // Pre-fill if auth is used
      company_name: '',
      firstName: user?.data?.firstName || '',
      lastName: user?.data?.lastName || '',
      company_email: '',
      company_description: '',
      company_category: '',
      logo_url: 'https://', // Default to https://
      company_phone: '',
      company_website: 'https://', // Default to https://
      date_founded: new Date().toISOString().split('T')[0], // Default today
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        post_zip_code: '',
      },
    } as CompanyFormValues,
  };

  // === REFACTORED SUBMISSION HANDLER ===
  const handleCompanySubmit = async ({
    value,
  }: {
    value: CompanyFormValues;
  }): Promise<SubmissionResult> => {
    try {
      // 1. Data Pre-processing and Formatting (Same logic as original component)
      const formattedDate = format(new Date(value.date_founded), 'MM-dd-yyyy');

      const payload: CreateCompanyPayload = {
        ...value,
        date_founded: formattedDate,
        userId: user?.data?._id ?? '',
        company_name: formatNameToTitle(value.company_name),
        company_email: value.company_email.toLowerCase(),
        company_description: formatNameToTitle(value.company_description),
        company_category: value.company_category as z.infer<typeof companyCategoryEnum>,
        company_phone: value.company_phone,
        company_website: value.company_website.toLowerCase(),
        logo_url: value.logo_url.toLowerCase(),
        address: value.address as z.infer<typeof addressSchema>,
      };

      // 2. Perform the Mutation
      await createCompanyMutation.mutateAsync(payload);

      // 3. Return success object
      return {
        success: true,
        message: 'Company profile created successfully!',
        redirect: '/',
      };
    } catch (err) {
      console.error('Submission failed:', err);
      // 4. Handle mutation errors (API error, network error, etc.)
      return {
        success: false,
        message: 'Failed to create company. Please check your data and try again.',
      };
    }
  };

  const companyFormConfig: FieldConfig<CompanyFormValues>[] = [
    // --- User/Contact Details ---
    {
      name: 'firstName',
      label: 'First Name',
      component: TextInput as React.ComponentType<any>,
      section: 'Contact Person',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'First name is required' : undefined,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      component: TextInput as React.ComponentType<any>,
      section: 'Contact Person',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Last name is required' : undefined,
      },
    },
    {
      name: 'email', // Personal/Contact Email
      label: 'Contact Email',
      component: EmailInput as React.ComponentType<any>,
      section: 'Contact Person',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'Email is required';
          return emailRegex.test(value) ? undefined : 'Invalid email format';
        },
      },
    },

    // --- Company Details ---
    {
      name: 'company_name',
      label: 'Company Name',
      component: TextInput as React.ComponentType<any>,
      section: 'Company Details',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Company name is required' : undefined,
      },
    },
    {
      name: 'company_email',
      label: 'Company Email',
      component: EmailInput as React.ComponentType<any>,
      section: 'Company Details',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'Company email is required';
          return emailRegex.test(value) ? undefined : 'Invalid email format';
        },
      },
    },
    {
      name: 'company_description',
      label: 'Company Description',
      component: TextArea as React.ComponentType<any>,
      section: 'Company Details',
      validators: {
        onChangeDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Description is required' : undefined,
      },
    },
    {
      name: 'company_category',
      label: 'Company Category',
      component: SelectInput as React.ComponentType<any>,
      section: 'Company Details',
      props: {
        options: [{ value: '', label: 'Select Category' }, ...categoryOptions],
      },
      validators: {
        onChangeDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Category is required' : undefined,
      },
    },
    {
      name: 'company_phone',
      label: 'Company Phone (Optional)',
      component: PhoneNumberInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return 'Phone number is required';
          }
          if (!phoneRegex.test(value)) {
            return 'Invalid phone number';
          }
          return undefined;
        },
      },
    },
    {
      name: 'company_website',
      label: 'Website (https://)',
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return undefined; // Optional field
          return urlRegex.test(value) ? undefined : 'Invalid URL format';
        },
      },
    },
    {
      name: 'logo_url',
      label: 'Logo URL (https://)',
      component: TextInput as React.ComponentType<any>,
      section: 'Company Details',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return undefined; // Optional field, adjust if required
          return urlRegex.test(value) ? undefined : 'Invalid URL format';
        },
      },
    },
    {
      name: 'date_founded',
      label: 'Date Founded',
      component: StyledDatePicker as React.ComponentType<any>,
      section: 'Company Details',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Date founded is required' : undefined,
      },
    },

    // --- Address Details ---
    {
      name: 'address.street',
      label: 'Street',
      component: TextInput as React.ComponentType<any>,
      section: 'Address',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Street is required' : undefined,
      },
    },
    {
      name: 'address.city',
      label: 'City',
      component: TextInput as React.ComponentType<any>,
      section: 'Address',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? 'City is required' : undefined),
      },
    },
    {
      name: 'address.state',
      label: 'State/Province',
      component: TextInput as React.ComponentType<any>,
      section: 'Address',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? 'State is required' : undefined),
      },
    },
    {
      name: 'address.country',
      label: 'Country',
      component: TextInput as React.ComponentType<any>,
      section: 'Address',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Country is required' : undefined,
      },
    },
    {
      name: 'address.post_zip_code',
      label: 'Zip/Post Code',
      component: TextInput as React.ComponentType<any>,
      section: 'Address',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Zip Code is required' : undefined,
      },
    },
  ];

  return (
    <MainLayout>
      <hgroup className='pt-20'>
        <h2 className='flex justify-center font-roboto text-4xl font-bold text-center text-dark-hard mb-2 dark:text-dark-light'>
          Join Directory
        </h2>
        <p className='font-roboto text-md font-bold text-center text-dark-hard mb-2 dark:text-dark-light'>
          Please provide your information below
        </p>
      </hgroup>
      <div className='min-h-screen grid place-content-center px-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <FormFactory<CompanyFormValues>
          formOptions={companyFormOptions}
          fieldsConfig={companyFormConfig}
          onValidSubmit={handleCompanySubmit}
          submitButtonText={
            createCompanyMutation.isPending ? 'Creating Company...' : 'Create Company'
          }
        />
      </div>
    </MainLayout>
  );
}

export { AppCompany };
