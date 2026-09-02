// client/src/components/Layouts/Forms/AppQuote.tsx 
import EmailInput from "./shared/EmailInput"
import FormFactory, { type FieldConfig, type SubmissionResult } from "./shared/FormFactory"
import SelectInput from "./shared/SelectInput"
import TextArea from "./shared/TextArea"
import TextInput from "./shared/TextInput"
import type React from "react"
import { emailRegex, phoneRegex, urlRegex } from "@/constants/regex"
import MainLayout from "../MainLayout"
import PhoneNumberInput from "./shared/PhoneNumberInput"
import { exportQuoteToCSV } from "@/utils/exportCsv";
import { useState } from "react"
import { Button } from "@/components/ReusableComponents/Button"
import API from "@/config/apiClient"

interface ApiResponse {
  status: string;
  message: string;
}

// Define the structure for the quote form values
type QuoteFormValues = {
  email: string
  companyName: string
  firstName: string
  lastName: string
  serviceType: string
  priceRange: string
  quoteDetails: string
  phone?: string // Optional
  website?: string // Optional
}

export default function AppQuote() {
  const [data, setData] = useState<QuoteFormValues[]>([]);

  const handleExport = () => {
    exportQuoteToCSV(data);
  };

  const quoteFormOptions = {
    defaultValues: {
      companyName: "",
      email: "",
      firstName: "",
      lastName: "",
      serviceType: "",
      priceRange: "",
      quoteDetails: "",
      phone: "",
      website: ""
    },
  }

  const handleQuoteSubmit = async ({ value }: { value: QuoteFormValues }): Promise<SubmissionResult> => {
    try {
      const response = await API.post<any, ApiResponse>("/sendMail", value) as unknown as ApiResponse;

      setData((prevData) => [...prevData, value]);

      // API client already returns response.data
      return {
        success: true,
        message: response.message || "Message sent successfully!",
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

  const PRICE_RANGE_OPTIONS = [
    { value: "0-500", label: "$0 - $500" },
    { value: "500-2000", label: "$500 - $2,000" },
    { value: "2000-5000", label: "$2,000 - $5,000" },
    { value: "5000+", label: "$5,000+" }
  ];

  const SERVICE_TYPE_OPTIONS = [
    { value: "web-dev", label: "Web Development" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "design", label: "UI/UX Design" },
    { value: "marketing", label: "Digital Marketing" },
    { value: "printing", label: "Printing" },
    { value: "graphics", label: "Graphics" },
    { value: "other", label: "Other" }
  ];

  const quoteFieldsConfig: FieldConfig<QuoteFormValues>[] = [
    {
      name: "companyName",
      label: "Company Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? "Company name is required" : undefined)
      }
    },
    {
      name: "firstName",
      label: "First Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? "First name is required" : undefined)
      }
    },
    {
      name: "lastName",
      label: "Last Name",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? "Last name is required" : undefined)
      }
    },
    {
      name: "email",
      label: "Email",
      component: EmailInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          if (!value) {
            return "Email is required";
          }
          // Use the imported emailRegex for validation
          return emailRegex.test(value) ? undefined : "Invalid email address format";
        }
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
      name: "serviceType",
      label: "Type of Service",
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: SERVICE_TYPE_OPTIONS,
        placeholder: "Select type of service..."
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          (!value ? "Type of service" : undefined)
      }
    },
    {
      name: "priceRange",
      label: "Target Price Range",
      component: SelectInput as React.ComponentType<any>,
      props: {
        options: PRICE_RANGE_OPTIONS,
        placeholder: "Select your budget..."
      },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => (!value ? "Please select a price range" : undefined)
      }
    },
    {
      name: "quoteDetails",
      label: "Project Description",
      component: TextArea as React.ComponentType<any>,
      props: { rows: 5 },
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) =>
          value.length < 20 ? "Description must be at least 20 characters" : undefined
      }
    },

    {
      name: "website",
      label: "Existing Website URL (Optional)",
      component: TextInput as React.ComponentType<any>,
      validators: {
        onChangeAsyncDebounceMs: 500,
        onChangeAsync: ({ value }: { value: string }) => {
          // Allow empty string for optional field
          if (!value) return undefined;
          // Use the imported urlRegex
          return urlRegex.test(value) ? undefined : "Invalid URL format (Must include http:// or https://)";
        }
      }
    }
  ]

  return (

    <MainLayout>
     <div className="container md:w-150 mx-auto py-20">
        <div className="w-full m-w-sm mx-auto">
          <h2 className="font-roboto text-4xl font-bold text-center text-dark-hard dark:text-dark-light">
              Request a Quote
            </h2>
            <FormFactory
              formOptions={quoteFormOptions}
              fieldsConfig={quoteFieldsConfig}
              onValidSubmit={handleQuoteSubmit}
              submitButtonText="Request Quote"
            />
            <span className="flex flex-col items-center text-sm font-bold text-center text-dark-hard dark:text-dark-light mb-8">
              <Button onClick={handleExport}
                className="w-3/4 mx-auto text-white text-lg font-extrabold bg-yellow-400 hover:bg-yellow-500">
                Export CSV
              </Button>
              You will receive an email with the quote within 24 hours!<br />
              You can also click the button above to download the quote as a CSV!
            </span>
          {/* </main> */}
        </div>
      </div>
    </MainLayout>
  );
}
