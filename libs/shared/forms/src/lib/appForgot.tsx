import MainLayout from "../MainLayout";
import EmailInput from "./shared/EmailInput";
import FormFactory, { type FieldConfig, type SubmissionResult } from "./shared/FormFactory";
import { sendPasswordResetEmail } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

type ForgotFormValues = {
  email: string;
}

export default function AppForgot() {
  const forgotFormOptions = {
    defaultValues: {
      email: ""
    },
  };
  // Use mutateAsync so we can await the result and return a SubmissionResult
  const { mutateAsync: sendPasswordReset } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  const handleForgotSubmit = async ({ value }: { value: ForgotFormValues }): Promise<SubmissionResult> => {
    try {
      // Trigger the mutation
      await sendPasswordReset(value.email);

      // Return success: FormFactory will show the toast and redirect to login
      return {
        success: true,
        message: "Check your inbox for a reset link!",
        redirect: "/login",
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to send reset email.";

      console.error("Submission error:", errorMessage);

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const forgotFieldsConfig: FieldConfig<ForgotFormValues>[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      component: EmailInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          !value.includes("@") ? "Invalid email address" : undefined,
      },
    },
  ];

  return (
    <MainLayout>
      <div className="container md:w-150 mx-auto py-20">
        <div className="w-full m-w-sm mx-auto">
          <div className="w-150 h-full py-20 m-w-sm mx-auto dark:text-dark-light">
            <div className="p-8 rounded-lg border-solid border-dark-light shadow-2xl">
              <main>
                <h2 className="font-roboto text-4xl font-bold text-center text-dark-hard mb-8 dark:text-dark-light">
                  Forgot Password
                </h2>
                <FormFactory
                  formOptions={forgotFormOptions}
                  fieldsConfig={forgotFieldsConfig}
                  onValidSubmit={handleForgotSubmit}
                  submitButtonText="Send Reset Link"
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
