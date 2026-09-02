// client/src/components/Layouts/Forms/AppRegister.tsx
import MainLayout from "@/components/Layouts/MainLayout";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { register } from "@/api/auth";
import FormFactory, { type FieldConfig, type SubmissionResult } from "@/components/Layouts/Forms/shared/FormFactory";
import TextInput from "@/components/Layouts/Forms/shared/TextInput";
import EmailInput from "@/components/Layouts/Forms/shared/EmailInput";
import PasswordInput from "@/components/Layouts/Forms/shared/PasswordInput";
import { phoneRegex, pwRegex } from "@/constants/regex";
import OtpVerificationForm from "@/components/Layouts/Forms/OtpVerificationForm";
import { navigate } from "@/lib/navigation";
import PhoneNumberInput from "./shared/PhoneNumberInput";
import React, { useState } from "react";
import StyledDatePicker from "./shared/StyledDatePicker";


type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export default function AppRegister() {
  const [step, setStep] = useState<"register" | "otp">("register");
  const [phone, setPhone] = useState<string>("");

  const registerFormOptions = {
    defaultValues: {
      firstName: "",
      lastName: "",
      confirmPassword: "",
      email: "",
      phone: "",
      password: "",
      birthDate: "",
    },
  }
  // Use mutateAsync to integrate cleanly with FormFactory's awaitable submission
  const { mutateAsync: registerAsync } = useMutation({
    mutationFn: register,
  });

  // Centralized submission handler for FormFactory
  const handleRegisterSubmit = async ({ value }: { value: RegisterFormValues }): Promise<SubmissionResult> => {
    try {
      // 1. Perform the Mutation
      await registerAsync(value as any);

      setPhone(value.phone);

      // Switch to OTP step
      setStep("otp");
      // 2. Return success object for FormFactory to show toast and navigate
      return {
        success: true,
        message: "Account created successfully",
        // redirect: "/",
      };

    } catch (error) {
      // 3. Handle mutation errors (e.g., failed API call, invalid data)
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please check your information.";
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  // --- Field Configuration Array ---
  const registerFieldsConfig: FieldConfig<RegisterFormValues>[] = [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Enter First Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return "First and last name required";
          if (value.length < 3)
            return "First name must be at least 3 characters long";
          return undefined;
        },
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter Last Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return "First and last name required";
          if (value.length < 3)
            return "Last name must be at least 3 characters long";
          return undefined;
        },
      },
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "Enter phone number",
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
      name: "email",
      label: "Email address",
      placeholder: "Enter email",
      component: EmailInput,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) return "Email is required";
          if (!value.includes("@")) return "Invalid email"; // Basic check, ideally use proper emailRegex
          return undefined;
        },
      },
    },
{
  name: "birthDate",
  label: "Your Date of Birth",
  component: StyledDatePicker as React.ComponentType<any>,
  props: { type: "date" },
  validators: {
    onChangeAsync: ({ value }: { value: string }) => {
      if (!value) return "Date of birth is required";
      
      // Frontend Age Calculation
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if (age < 18) return "You must be at least 18 years old";
      return undefined;
    },
  },
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
  ];


  return (
    <MainLayout>
      <section className="container h-full md:w-150 w-full mx-auto px-5 py-20">
        <div className="w-full h-full mx-auto">
          <h2 className="font-roboto text-4xl font-bold text-center text-dark-hard dark:text-[#5a7184]">
            {step === "register" ? "Create an account" : "Verify your phone"}
          </h2>
          <div className="p-8 rounded-lg border-solid border-dark-light shadow-2xl pt-10">

            {step === "register" ? (
              <>
                <FormFactory
                  formOptions={registerFormOptions}
                  fieldsConfig={registerFieldsConfig}
                  onValidSubmit={handleRegisterSubmit}
                  submitButtonText="Register"
                />
                <p className="text-dark-hard text-sm text-center  dark:text-dark-light">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400 font-bold hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-center mb-4 text-dark-light">
                  We sent a code to <strong>{phone}</strong>
                </p>
                <OtpVerificationForm
                  phone={phone}
                  onSuccess={() => navigate("/")}
                />
                <button
                  onClick={() => setStep("register")}
                  className="relative mt-4 text-sm text-blue-500 hover:underline"
                >
                  ← Back to registration
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    </MainLayout>
  );
}