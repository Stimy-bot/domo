// libs/shared/reusableComponents/src/lib/numberInput.tsx
import { BaseInput, type FieldValue } from './baseInput';

interface Field {
  name: string;
  state: {
    value: string;
    meta: {
      errors: string[];
      isValidating: boolean;
    };
  };
  handleChange: (value: FieldValue) => void;
  handleBlur: () => void;
}

const NumberInput = ({ field, label }: { field: Field; label: string }) => (
  <BaseInput field={field} label={label} type='number' />
);

export { NumberInput };
