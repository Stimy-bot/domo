// libs/shared/forms/src/lib/appQuote.tsx
import { emailRegex, phoneRegex, urlRegex } from '@domo/constants';
import {
  EmailInput,
  type FieldConfig,
  FormFactory,
  PhoneNumberInput,
  SelectInput,
  type SubmissionResult,
  TextArea,
  TextInput,
} from '@domo/reusableComponents';
import { UiButton } from '@domo/ui-buttons';
import { sendQuoteFn } from '@domo/utils';
import { exportQuoteToCSV } from '@domo/utils';
import type React from 'react';
import { useState } from 'react';

// Define the structure for the quote form values
type QuoteFormValues = {
  email: string;
  companyName: string;
  firstName: string;
  lastName: string;
  serviceType: string;
  priceRange: string;
  quoteDetails: string;
  phone?: string;
  website?: string;
};

function Quote() {
  const [data, setData] = useState<QuoteFormValues[]>([]);

  const handleExport = () => {
    exportQuoteToCSV(data);
  };

  const quoteFormOptions = {
    defaultValues: {
      companyName: '',
      email: '',
      firstName: '',
      lastName: '',
      serviceType: '',
      priceRange: '',
      quoteDetails: '',
      phone: '',
      website: '',
    },
  };

  const handleQuoteSubmit = async ({
    value,
  }: {
    value: QuoteFormValues;
  }): Promise<SubmissionResult> => {
    try {
      // Invoke TanStack Start server function directly
      await sendQuoteFn({ data: value });

      setData((prevData) => [...prevData, value]);

      return {
        success: true,
        message: 'Quote request submitted successfully!',
        redirect: '/thank-you',
      };
    } catch (err: any) {
      console.error('Quote submission error:', err);
      return {
        success: false,
        message: err.message || 'Failed to submit quote. Please try again.',
      };
    }
  };

  const PRICE_RANGE_OPTIONS = [
    { value: '0-500', label: '$0 - $500' },
    { value: '500-2000', label: '$500 - $2,000' },
    { value: '2000-5000', label: '$2,000 - $5,000' },
    { value: '5000+', label: '$5,000+' },
  ];

  const SERVICE_TYPE_OPTIONS = [
    { value: 'web-dev', label: 'Web Development' },
    { value: 'mobile-app', label: 'Mobile App Development' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'printing', label: 'Printing' },
    { value: 'graphics', label: 'Graphics' },
    { value: 'other', label: 'Other' },
  ];

  const quoteFieldsConfig: FieldConfig<QuoteFormValues>[] = [
    {
      name: 'companyName',
      label: 'Company Name',
      props: { className: 'demo-input' },
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Company name is required' : undefined,
      },
    },
    {
      name: 'firstName',
      label: 'First Name',
      props: { className: 'demo-input' },
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'First name is required' : undefined,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      props: { className: 'demo-input' },
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Last name is required' : undefined,
      },
    },
    {
      name: 'email',
      label: 'Email',
      props: { className: 'demo-input' },
      component: EmailInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return 'Email is required';
          }
          return emailRegex.test(value) ? undefined : 'Invalid email address format';
        },
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      props: { className: 'demo-input' },
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
      name: 'serviceType',
      label: 'Type of Service',
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: SERVICE_TYPE_OPTIONS,
        placeholder: 'Select type of service...',
        className: 'demo-input demo-select',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Type of service is required' : undefined,
      },
    },
    {
      name: 'priceRange',
      label: 'Target Price Range',
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: PRICE_RANGE_OPTIONS,
        placeholder: 'Select your budget...',
        className: 'demo-input demo-select',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Please select a price range' : undefined,
      },
    },
    {
      name: 'quoteDetails',
      label: 'Project Description',
      component: TextArea as React.ComponentType<any>,
      props: { rows: 5, className: 'demo-input demo-textarea' },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value.length < 20 ? 'Description must be at least 20 characters' : undefined,
      },
    },
    {
      name: 'website',
      label: 'Existing Website URL (Optional)',
      props: { className: 'demo-input' },
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return undefined;
          return urlRegex.test(value)
            ? undefined
            : 'Invalid URL format (Must include http:// or https://)';
        },
      },
    },
  ];

  return (
    <div className='relative island-shell rise-in flex h-vh justify-center overflow-hidden p-4 pb-15 mb-4'>
      <main className='island-shell rise-in flex flex-col items-center justify-center max-w-400 px-4 rounded-lg'>
        <div className='pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />
        <h2 className='p-5 font-roboto text-4xl font-bold text-center'>Request a Quote</h2>
        <FormFactory
          formOptions={quoteFormOptions}
          fieldsConfig={quoteFieldsConfig}
          onValidSubmit={handleQuoteSubmit}
          submitButtonText='Request Quote'
        />

        <UiButton
          onClick={handleExport}
          className='demo-button w-3/4 mb-4'
        >
          Export CSV
        </UiButton>
        <span>You will receive an email with the quote within 24 hours!</span>
        <span className='pb-3'>
          You can also click the button above to download the quote as a CSV!
        </span>
      </main>
    </div>
  );
}

export { Quote };
