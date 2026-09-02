// src/components/Layouts/Forms/shared/PhoneNumberInput.tsx
import  ReactPhoneInput  from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = (ReactPhoneInput as any).default || ReactPhoneInput;

interface SimpleField {
  name: string;
  state: {
    value: string;
    meta: { errors: string[]; isValidating: boolean }
  };
  handleChange: (val: string) => void;
  handleBlur: () => void;
}

interface PhoneNumberInputProps {
  field: SimpleField;
  label: string;
  placeholder?: string;
}

export default function PhoneNumberInput({
  field,
  label,
  placeholder = "",
}: PhoneNumberInputProps) {
  const { value, meta } = field.state;

  return (
    <div className="text-dark-light flex flex-col mb-3">
      <label htmlFor={field.name} className="text-dark-light mb-2 font-semibold block">{label}</label>
      <PhoneInput
        country="us"
        value={value}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        inputProps={{ name: field.name, id: field.name }}
        inputStyle={{
          width: "100%",
          padding: "",
          marginTop: ".375rem ",
          marginBottom: ".375rem",
          borderRadius: ".385rem",
          border: "1px solid black",
          height: "3.5rem",
        }}
      />
      {meta.errors[0] && (
        <p className="text-red-500 text-xs">{meta.errors[0]}</p>
      )}
    </div>
  );
}