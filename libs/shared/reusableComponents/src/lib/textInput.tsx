// libs/shared/reusableComponents/src/lib/textInput.tsx
import {BaseInput} from "./baseInput"
import type { AnyFieldApi } from "@tanstack/react-form"; 

const TextInput = ({ field, label, ...rest }: { field: AnyFieldApi; label: string }) => (
  <BaseInput field={field} label={label} type="text" {...rest} />
);

export { TextInput };