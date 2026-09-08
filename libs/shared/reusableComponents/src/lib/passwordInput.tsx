// libs/shared/reusableComponents/src/lib/passwordInput.tsx
import { AnyFieldApi } from "@tanstack/react-form";
import { BaseInput } from "./baseInput";

// Use AnyFieldApi and a rest spread for the extra props
const PasswordInput = ({ 
  field, 
  label, 
  ...rest 
}: { 
  field: AnyFieldApi; 
  label: string; 
  [key: string]: any; 
}) => (
  <BaseInput 
    field={field} 
    label={label} 
    type="password" 
    {...rest} 
  />
);

export { PasswordInput };