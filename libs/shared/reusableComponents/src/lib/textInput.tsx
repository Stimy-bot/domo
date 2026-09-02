// client/src/components/Layouts/Forms/shared/TextInput.tsx
import { BaseInput } from "./baseInput"
import { AnyFieldApi } from "@tanstack/react-form"; 

// interface Field {
//   name: string;
//   state: {
//     value: string;
//     meta: {
//       errors: (string | undefined | null)[]; 
//       isValidating: boolean;
//     };
//   };
//   handleChange: (value: string) => void;
//   handleBlur: () => void;
// }

const TextInput = ({ field, label, ...rest }: { field: AnyFieldApi; label: string }) => (
  <BaseInput field={field} label={label} type="text" {...rest} />
);

export { TextInput };