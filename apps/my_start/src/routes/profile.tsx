import { update as updateUser } from '@domo/client';
import { emailRegex, phoneRegex, pwRegex } from '@domo/constants';
import { storage } from '@domo/firebase';
import {
  EmailInput,
  type FieldConfig,
  FormFactory,
  ImageInput,
  PasswordInput,
  PhoneNumberInput,
  RadioGroup,
  StyledDatePicker,
  type SubmissionResult,
  TextArea,
  TextInput,
} from '@domo/reusableComponents';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import type React from 'react';
import { useMemo } from 'react';
import { getUser, getUserID } from '../lib/auth-server-func';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  profilePicture?: string | File | null;
  bio?: string;
  gender?: string;
  birthDate?: string;
  phone: string;
};

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const userID = await getUserID();
    return {
      userID,
    };
  },
  loader: async ({ context }) => {
    if (!context.userID) {
      throw redirect({ to: '/' });
    }

    const user = await getUser();

    return {
      userID: context.userID,
      user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { user } = Route.useLoaderData();

  // 1. Centralized User Extraction
  const profileData = useMemo(() => {
    if (!user) return null;
    const userData = (user as any).data ? (user as any).data : user;

    return {
      id: userData.id || userData._id || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      verified: userData.verified || false,
      createdAt: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '',
      image: userData.image || null,
      bio: userData.bio || '',
      gender: userData.gender || 'prefer-not-to-say',
      birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '',
    };
  }, [user]);

  const { mutateAsync: updateAccountAsync } = useMutation({
    mutationFn: async (payload: Partial<ProfileFormValues>) => {
      const userPayload: any = { ...payload };

      if (payload.birthDate && typeof payload.birthDate === 'string') {
        userPayload.birthDate = new Date(payload.birthDate);
      }

      const res = await updateUser(profileData?.id, userPayload);

      return (res as any)?.data ?? res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'currentUser'] });
    },
  });

  if (!user || !profileData) return <div className='p-20 text-center'>Loading profile...</div>;

  // 3. Handle Submit with Firebase Upload
  const handleProfileSubmit = async ({
    value,
  }: {
    value: ProfileFormValues;
  }): Promise<SubmissionResult> => {
    try {
      let profilePictureUrl =
        typeof value.profilePicture === 'string' ? value.profilePicture : profileData.image;

      if (value.profilePicture instanceof File) {
        try {
          if (!storage) {
            console.error('Firebase storage is not initialized');
            return {
              success: false,
              message: 'Cloud storage not initialized.',
            };
          }
          const storageRef = ref(storage, `avatars/${profileData.id}-${Date.now()}`);
          const snapshot = await uploadBytes(storageRef, value.profilePicture);
          profilePictureUrl = await getDownloadURL(snapshot.ref);
        } catch (fbError) {
          console.error('Firebase Upload Error:', fbError);
          return {
            success: false,
            message: 'Cloud storage upload failed. Check your API keys.',
          };
        }
      }

      const payload = {
        ...value,
        phone: value.phone.replace(/[^+\d]/g, ''),
        profilePicture: profilePictureUrl,
      };

      if (!payload.password) {
        delete payload.password;
        delete payload.confirmPassword;
      }

      await updateAccountAsync(payload);

      return {
        success: true,
        message: 'Profile updated successfully!',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || 'Server update failed.',
      };
    }
  };

  // 4. Form Configurations
  const profileFormOptions = {
    defaultValues: {
      ...profileData,
      password: '',
      confirmPassword: '',
    },
    submitButtonLabel: 'Save Changes',
  };

  const profileFieldsConfig: FieldConfig<ProfileFormValues>[] = [
    {
      name: 'profilePicture',
      label: 'Profile Picture',
      component: ImageInput,
    },
    {
      name: 'firstName',
      label: 'First Name',
      component: TextInput as React.ComponentType<any>,
      placeholder: 'Enter First Name',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value.length < 3 ? 'First name must be at least 3 characters' : undefined,
      },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      component: TextInput as React.ComponentType<any>,
      placeholder: 'Enter Last Name',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value.length < 3 ? 'Last name must be at least 3 characters' : undefined,
      },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      component: PhoneNumberInput as React.ComponentType<any>,
      placeholder: 'Enter Phone Number',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value && !phoneRegex.test(value.replace(/[^+\d]/g, ''))
            ? 'Invalid phone number format (E.164)'
            : undefined,
      },
    },
    {
      name: 'email',
      label: 'Email',
      component: EmailInput as React.ComponentType<any>,
      placeholder: 'Enter Email',
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return 'Email is required';
          }
          return emailRegex.test(value) ? undefined : 'Invalid email address format';
        },
      },
      props: {},
    },
    {
      name: 'bio',
      label: 'Bio',
      component: TextArea as React.ComponentType<any>,
      placeholder: 'Tell us about yourself',
    },
    {
      name: 'gender',
      label: 'Gender',
      component: RadioGroup as React.ComponentType<any>,
      props: {
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' },
        ],
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          !value ? 'Please select your gender' : undefined,
      },
    },
    {
      name: 'birthDate',
      label: 'Birth Date',
      component: StyledDatePicker as React.ComponentType<any>,
      props: {
        type: 'date',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          !value ? 'Please select your birth date' : undefined,
      },
    },
    {
      name: 'password',
      label: 'New Password (optional)',
      component: PasswordInput as React.ComponentType<any>,
      placeholder: 'Enter New Password',
      props: {
        autoComplete: 'new-password',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value && !pwRegex.test(value)
            ? '8+ chars, upper, lower, number & special char'
            : undefined,
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      component: PasswordInput as React.ComponentType<any>,
      placeholder: 'Confirm New Password',
      props: {
        autoComplete: 'new-password',
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({
          value,
          fieldApi,
        }: {
          value: string;
          fieldApi: AnyFieldApi; // Use AnyFieldApi for type safety in validator context
        }) => {
          // Get the password value from the form
          const pw = fieldApi.form.getFieldValue('password');
          return pw && value !== pw ? 'Passwords do not match' : undefined;
        },
        onChangeListenTo: ['password'], // Ensure it re-validates when password changes
      },
    },
  ];

  return (
    <main className='container md:w-150 mx-auto py-20 px-4'>
      <div className='w-full m-w-sm mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-2 dark:text-white'>
          {user.name}'s Account
        </h2>
        <p className='text-center text-gray-500 text-sm mb-6'>
          Member since {profileData.createdAt}
        </p>

        {!profileData.verified && (
          <div className='p-4 mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-3'>
            <span className='text-xl'>⚠️</span>
            <Link
              to='#'
              className='text-sm font-medium hover:underline hover:text-amber-900 transition-colors'
            >
              Click here to resend verification link or enter code.
            </Link>
          </div>
        )}

        <FormFactory
          formOptions={profileFormOptions}
          fieldsConfig={profileFieldsConfig}
          onValidSubmit={handleProfileSubmit}
          submitButtonText='Update Profile'
        />
      </div>
    </main>
  );
}
