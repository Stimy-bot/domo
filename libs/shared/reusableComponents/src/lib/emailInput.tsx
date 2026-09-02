import { AnyFieldApi } from "@tanstack/react-form";
import { BaseInput } from "./baseInput";

const EmailInput = ({ 
  field, 
  label, 
  ...rest 
}: { 
  field: AnyFieldApi; 
  label: string; 
} & Record<string, any>) => (
  <BaseInput 
    field={field} 
    label={label} 
    type="email" 
    {...rest} 
  />
);

export { EmailInput };