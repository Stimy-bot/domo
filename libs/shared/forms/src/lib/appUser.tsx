// client/src/components/Layouts/Forms/AppUser.tsx
import EmailInput from "./shared/EmailInput"
import FormFactory, { type FieldConfig, type SubmissionResult } from "./shared/FormFactory"
import NumberInput from "./shared/NumberInput"
import PasswordInput from "./shared/PasswordInput"
import RadioGroup from "./shared/RadioGroup"
import SelectInput from "./shared/SelectInput"
import TextArea from "./shared/TextArea"
import TextInput from "./shared/TextInput"
import { useMutation } from "@tanstack/react-query"
import { register } from "@/api/auth"
import type { AnyFieldApi } from "@tanstack/react-form"
import type React from "react"
import PhoneNumberInput from "./shared/PhoneNumberInput"
import { phoneRegex, pwRegex } from "@/constants/regex"
import StyledDatePicker from "./shared/StyledDatePicker"

type UserFormValues = {
  fullName: string
  firstName: string
  lastName: string
  email: string
  age: number
  role: string[]
  password: string
  confirmPassword: string
  bio: string
  gender: string
  phone: string
  birthDate: string
}


export default function AppUser() {
  const userFormOptions = {
    defaultValues: {
      fullName: "",
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      role: [],
      password: "",
      confirmPassword: "",
      bio: "",
      gender: "",
      phone: "",
      birthDate: ""
    },
  }

  const { mutateAsync: userAsync } = useMutation({
    mutationFn: register,
  });

const handleUserSubmit = async ({ value }: { value: UserFormValues }): Promise<SubmissionResult> => {
 try {
   const { age, ...payload } = value;

    await userAsync(payload as any);

    return {
      success: true,
      message: "Account created successfully",
      redirect: "/",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed."
    };
  }
};

  const userFieldsConfig: FieldConfig<UserFormValues>[] = [
    {
      name: "fullName",
      label: "Full Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChange: ({ value }: { value: string }) =>
          value.length < 3 ? "Full name must be at least 3 characters" : undefined
      }
    },
    {
      name: "firstName",
      label: "First Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChange: ({ value }: { value: string }) =>
          value.length < 3 ? "First name must be at least 3 characters" : undefined
      }
    },
    {
      name: "lastName",
      label: "Last Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          value.length < 3 ? "Last name must be at least 3 characters" : undefined
      }
    },
    {
      name: "email",
      label: "Email",
      component: EmailInput as React.ComponentType<any>,
      props: { type: "email" },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) => (!value.includes("@") ? "Invalid email address" : undefined)
      }
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter Password",
      component: PasswordInput,
      props: { type: "password" },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return "Password is required";
          if (!pwRegex.test(value)) {
            return "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.";
          }
          return undefined;
        },
      },
    },
 {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm password",
      component: PasswordInput,
      props: { type: "password" },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeListenTo: ["password"],
        onChangeAsync: ({
          value,
          fieldApi,
        }: {
          value: string;
          fieldApi: any; // Type is simplified for FormFactory usage
        }) => {
          if (!value) return "Must enter a matching password";
          if (value !== fieldApi.form.getFieldValue("password")) {
            return "Passwords do not match";
          }
          return undefined;
        },
      },
    },
    {
      name: "age",
      label: "Age",
      component: NumberInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: number }) => (value < 18 ? "You must be at least 18 years old" : undefined)
      }
    },
    {
      name: "role",
      label: "Role",
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: [
          { value: "admin", label: "Administrator" },
          { value: "superAdmin", label: "Super Administrator" },
          { value: "user", label: "User" }
        ]
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) => (!value ? "Please select a role" : undefined)
      }
    },
    {
      name: "gender",
      label: "Gender",
      component: RadioGroup as React.ComponentType<any>,
      props: {
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "prefer-not-to-say", label: "Prefer not to say" }
        ]
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) => (!value ? "Please select your gender" : undefined)
      }
    },
    {
      name: "bio",
      label: "Bio",
      component: TextArea as React.ComponentType<any>,
      props: { rows: 5 },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) =>
          value.length > 500 ? "Bio cannot exceed 500 characters" : undefined
      }
    },
    {
      name: "phone",
      label: "Phone Number",
      component: PhoneNumberInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return "Phone number is required";
          }
          if (!phoneRegex.test(value)) {
            return "Invalid phone number";
          }
          return undefined;
        },
      }
    },
    {
      name: "birthDate",
      label: "Birth Date",
      component: StyledDatePicker as React.ComponentType<any>,
      props: {
        type: "date"
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChange: ({ value }: { value: string }) => (!value ? "Please select your birth date" : undefined)
      }
    }
  ]

  return (
    <FormFactory
      formOptions={userFormOptions}
      fieldsConfig={userFieldsConfig}
      onValidSubmit={handleUserSubmit}
      submitButtonText="Create User"
    />
  )
}
