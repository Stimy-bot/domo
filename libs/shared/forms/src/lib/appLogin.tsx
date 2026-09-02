// client/src/components/Layouts/Forms/AppLogin.tsx
import MainLayout from "@/components/Layouts/MainLayout";
import EmailInput from "@/components/Layouts/Forms/shared/EmailInput";
import FormFactory, { type FieldConfig, type SubmissionResult } from "@/components/Layouts/Forms/shared/FormFactory";
import { login } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import PasswordInput from "./shared/PasswordInput";
import { emailRegex, pwRegex } from "@/constants/regex";
import getGoogleOAuthURL from "@/utils/getGoogleURL";


export interface LoginResponse {
  message: string;
  userId?: string;     // This is the one you need!
  accessToken?: string;
  refreshToken?: string;
}
type LoginFormValues = {
  email: string;
  password: string;
};

export default function AppLogin() {
  const loginFormOptions = {
    defaultValues: {
      email: "",
      password: "",
    },
  }

  const { mutateAsync: loginAsync } = useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: async (variables) => {
      const response = await login(variables);
      // If 'login' returns the Axios object, extract .data here
      return (response as any).data;
    },
  });


  // Centralized submission handler for FormFactory

  const handleLoginSubmit = async ({ value }: { value: LoginFormValues }): Promise<SubmissionResult> => {
    try {
      // This calls the mutation, which calls 'login' in auth.ts
      const response = await loginAsync(value);

      // SUCCESS CASE 1: 2FA Required
      if (response?.userId) {
        sessionStorage.setItem("pending_otp_user_id", response.userId);
        return {
          success: true,
          message: "Step 1 complete: OTP sent to your phone.",
          redirect: "/verify-otp",
        };
      }

      // SUCCESS CASE 2: Direct Login (if 2FA is off)
      return {
        success: true,
        message: "You signed in successfully",
       redirect: "/", 
      };

    } catch (error: any) {
      // ERROR CASE: This catches the 400 Bad Request
      // Your API client rejects with { status, message, ... }
      const errorMessage = error.message || "Invalid email or password";

      return {
        success: false,
        message: errorMessage // This will now show "Phone number or carrier not configured..."
      };
    }
  };

  const loginFieldsConfig: FieldConfig<LoginFormValues>[] = [
    {
      name: "email",
      label: "Email address",
      placeholder: "Enter email",
      component: EmailInput, // Use the shared email component
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return "Email is required";
          }
          if (!emailRegex.test(value)) {
            return "Invalid email";
          }
          return undefined;
        },
      },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter password",
      // ✅ Component updated to PasswordInput
      component: PasswordInput,
      props: {
        type: "password", // Pass the type prop to render a password field
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return "Password is required";
          }
          // ✅ New Regex validation implemented
          if (!pwRegex.test(value)) {
            return "Password must be at least 8 characters and include: 1 Uppercase, 1 Lowercase, 1 Number, and 1 Special Character.";
          }
          return undefined;
        },
      },
    },
  ];

  return (
    <MainLayout>
      <div className="container md:w-150 mx-auto py-20">
        <div className="w-full m-w-sm mx-auto">
          <h2 className="font-roboto text-4xl font-bold text-center text-dark-hard dark:text-dark-light">
            Sign in to your account
          </h2>
          <div className="p-8 rounded-lg border-solid border-dark-light shadow-2xl">

            {/* The FormFactory handles form rendering, submission, and validation */}
            <FormFactory
              formOptions={loginFormOptions}
              fieldsConfig={loginFieldsConfig}
              onValidSubmit={handleLoginSubmit}
              submitButtonText="Sign in"
            />
            {/* Links and secondary buttons are placed outside the FormFactory */}
            <div className="flex flex-col mb-6 w-full">
              <a href={getGoogleOAuthURL()} className='bg-red-600 text-white text-center font-bold py-4 px-8 rounded-lg hover:opacity-75'>Login with Google</a>
              <Link
                to="/password/forgot"
                className="text-red-600 text-center font-semibold block mt-4"
              >
                Forgot password?
              </Link>
              <p className="text-dark-hard text-sm text-center dark:text-dark-light mt-4">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-bold text-blue-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}