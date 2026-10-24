// libs/shared/reusableComponents/src/lib/styledDatePicker.tsx
import { CustomDatePicker } from './customDatePicker';

interface Field {
  name: string;
  state: {
    value: string;
    meta: any;
  };
  handleBlur: () => void;
  handleChange: (value: any) => void;
}

const StyledDatePicker = ({
  field,
  label,
  placeholder = 'YYYY-DD-MM',
}: {
  field: Field;
  label: string;
  placeholder?: string;
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block font-semibold text-dark-light mb-1">
        {label}
      </label>
      <CustomDatePicker
        selected={field.state.value ? new Date(field.state.value) : null}
        onChange={(date: Date | null) => field.handleChange(date ? date.toISOString() : null)}
        onBlur={field.handleBlur}
        placeholderText={placeholder}
      />
      {field.state.meta.errors?.length > 0 && (
        <p className="text-red-500 text-xs italic mt-1">{field.state.meta.errors.join(', ')}</p>
      )}
    </div>
  );
};

export { StyledDatePicker };
