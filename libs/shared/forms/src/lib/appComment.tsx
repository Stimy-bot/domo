// libs/shared/forms/src/lib/appComment.tsx
import { FormFactory, type SubmissionResult, type FieldConfig, EmailInput, TextArea, TextInput, MainLayout } from "@domo/reusableComponents";
import {API} from "@domo/config";

interface ApiResponse {
  status: string;
  message: string;
}

type CommentFormValues = {
  fullName: string;
  email: string;
  comment: string;
};
function AppComment() {
  const commentFormOptions = {
    defaultValues: {
      fullName: "",
      email: "",
      comment: "",
    },
  };

const handleCommentSubmit = async ({ value }: { value: CommentFormValues }): Promise<SubmissionResult> => {
  try {
    const response = await API.post<any,ApiResponse>("/sendMail", value);
    
    // API client already returns response.data
    return {
      success: true,
      message:  response.message || "Message sent successfully!",
      redirect: "/thank-you",
    };
  } catch (err: any) {
    console.error("Submission error:", err);
    return { 
      success: false, 
      // If backend sends a specific error (like "Unverified domain"), show it!
      message: err.message || "Something went wrong. Please try again." 
    };
  }
};

  const commentFieldsConfig: FieldConfig<CommentFormValues>[] = [
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter Full Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) => {
          if (value.length < 7) return "Full name must be first and last name";
          if (!/^[A-Za-z]{3,}\s[A-Za-z]{3,}$/.test(value)) {
            return "Full Name must contain first and last name, letters only";
          }
          return undefined;
        },
      },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter Email",
      component: EmailInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          !value.includes("@") ? "Invalid email address" : undefined,
      },
    },
    {
      name: "comment",
      label: "Comment",
      placeholder: "Enter Comment",
      component: TextArea as React.ComponentType<any>,
      props: {
        rows: 5,
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          value.length > 500
            ? "Comment cannot exceed 500 characters"
            : undefined,
      },
    },
  ];

  return (
    <MainLayout>
      <div className="dark:bg-dark-hard w-full max-w-2xl min-h-full py-20 px-4 mx-auto">
        <div className="dark:bg-dark-hard rounded-lg  md:shadow-2xl bg-white dark:bg-dark-bg">
          <main className="dark:bg-dark-hard ">
            <h2 className="font-roboto text-3xl md:text-4xl font-bold text-center text-dark-hard mb-6 md:mb-8 dark:text-dark-light">
              Leave a Comment
            </h2>
           
            <FormFactory
              formOptions={commentFormOptions}
              fieldsConfig={commentFieldsConfig}
              onValidSubmit={handleCommentSubmit}
              submitButtonText={"Submit Comment"}
            />
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
 
export { AppComment };