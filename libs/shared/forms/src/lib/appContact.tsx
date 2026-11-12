// libs/shared/forms/src/lib/appContact.tsx

import { API } from '@domo/config';
import { emailRegex, phoneRegex } from '@domo/constants';
import {
  EmailInput,
  type FieldConfig,
  FormFactory,
  MainLayout,
  MapView,
  PhoneNumberInput,
  SelectInput,
  type SubmissionResult,
  TextInput,
} from '@domo/reusableComponents';

interface ApiResponse {
  status: string;
  message: string;
}

type ContactFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  attention: string;
  message: string;
};

function AppContact() {
;
  const contactFormOptions = {
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      website: '',
      attention: '',
      message: '',
    },
  }
  const handleContactSubmit = async ({
    value,
  }: {
    value: ContactFormValues;
  }): Promise<SubmissionResult> => {
    try {
      const response = await API.post<any, ApiResponse>('/sendMail', value);

      // API client already returns response.data
      return {
        success: true,
        message: response.message || 'Message sent successfully!',
        redirect: '/thank-you',
      };
    } catch (err: any) {
      console.error('Submission error:', err);
      return {
        success: false,
        // If backend sends a specific error (like "Unverified domain"), show it!
        message: err.message || 'Something went wrong. Please try again.',
      };
    }
  };

  const ATTENTION_OPTIONS = [
    { value: 'sales', label: 'Sales' },
    { value: 'technician', label: 'Technician' },
    { value: 'webmaster', label: 'Webmaster' },
    { value: 'other', label: 'Other' },
  ];

  const contactFieldsConfig: FieldConfig<ContactFormValues>[] = [
    {
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter First Name',
      component: TextInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'First and last name required';
          if (value.length < 3) return 'First name must be at least 3 characters long';
          return undefined;
        },
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter Last Name',
      component: TextInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'First and last name required';
          if (value.length < 3) return 'Last name must be at least 3 characters long';
          return undefined;
        },
      },
    },
    {
      name: 'email',
      label: 'Email address',
      placeholder: 'Enter email',
      component: EmailInput, // Use the shared email component
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return 'Email is required';
          }
          if (!emailRegex.test(value)) {
            return 'Invalid email';
          }
          return undefined;
        },
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
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
      name: 'website',
      label: 'Website',
      placeholder: 'Enter website',
      component: TextInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'Website is required';
          if (value.length < 3) return 'Website must be at least 3 characters long';
          return undefined;
        },
      },
    },
    {
      name: 'attention',
      label: 'Attention',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: ATTENTION_OPTIONS,
        placeholder: 'Enter Department',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value ? 'Please your attention' : undefined,
      },
    },
    {
      name: 'message',
      label: 'Message',
      placeholder: 'Enter message',
      component: TextInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return 'Message is required';
          if (value.length < 10) return 'Message must be at least 10 characters long';
          return undefined;
        },
      },
    },
  ];

  return (
    <MainLayout>
      <main className='w-full min-h-fit max-w-7xl mx-auto py-20 flex flex-col lg:grid lg:grid-cols-3 gap-12 lg:gap-0'>
        {/* SECTION 1: INFO - Added responsive padding and text alignment */}
        <section className='px-6 lg:mx-10 order-1'>
          <div className='text-center lg:text-left'>
            <span className=' font-roboto text-3xl lg:text-4xl font-bold text-dark-hard mb-4 dark:text-[rgb(90,113,132)]'>
              Contact Us
            </span>
            <h2 className='mb-6 text-sm dark:text-dark-light font-bold uppercase text-dark tracking-widest'>
              GET IN TOUCH WITH US
            </h2>
            <p className='dark:text-dark-light text-sm leading-relaxed mb-9 text-body-color'>
              We want to hear from you. Please submit any questions, suggestions, or general
              feedback. We'll get back to you as soon as we can. Thanks!
            </p>

            {/* CONTACT ITEMS - Optimized for small screens */}
            <div className='space-y-8'>
              <div className='flex items-start'>
                <div className='mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary/20'>
                  {/* <img src={images.location} alt="Location" className="w-6 h-6" /> */}
                </div>
                <div className='text-left'>
                  <h4 className='dark:text-dark-light text-lg font-bold text-dark'>Our Location</h4>
                  <p className='dark:text-dark-light text-sm text-body-color'>
                    3392 Blaine St. NE 1D Washington DC 20019
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary/20'>
                  {/* <img src={images.phone} alt="Phone" className="w-6 h-6" /> */}
                </div>
                <div className='text-left'>
                  <h4 className='dark:text-dark-light text-lg font-bold text-dark'>Phone Number</h4>
                  <p className='dark:text-dark-light text-sm text-body-color'>(+1) 202 317 2660</p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mr-4 flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary/20'>
                  {/* <img src={images.mail_icon} alt="Email" className="w-6 h-6" /> */}
                </div>
                <div className='text-left'>
                  <h4 className='dark:text-dark-light text-lg font-bold text-dark'>
                    Email Address
                  </h4>
                  <p className='dark:text-dark-light text-sm text-body-color'>
                    totaldata80@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FormFactory
          formOptions={contactFormOptions}
          fieldsConfig={contactFieldsConfig}
          onValidSubmit={handleContactSubmit}
          submitButtonText={'Contact Us'}
        />

        {/* SECTION 3: MAP - Ensure it fills space correctly on mobile */}
        <section className='w-full h-75px lg:h-full min-h-100px order-3 px-6 lg:px-0 mt-10 lg:mt-0'>
          <MapView />
        </section>
      </main>
    </MainLayout>
  );
}

export { AppContact };
