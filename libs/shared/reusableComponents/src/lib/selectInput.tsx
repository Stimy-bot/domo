// libs/shared/reusableComponents/src/lib/selectInput.tsx
import type React from 'react';

// 1. Refined Field Interface (Assuming value should be string for select)
interface Field {
  name: string;
  state: {
    value: string;
    meta: {
      errors?: string[]; // Assuming meta.errors is an optional string array
      // ... other meta properties
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  field: Field;
  label: string;
  options: Option[];
  placeholder?: string;
}

// 2. Use React.FC and destructure props directly
const SelectInput: React.FC<SelectInputProps> = ({
  field,
  label,
  options,
  placeholder = 'Select an option',
}) => {
  const { name, state, handleBlur, handleChange } = field;
  const { value, meta } = state;
  const displayValue = Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
  return (
    <div className='py-4'>
      <label htmlFor={name} className='block font-semibold mb-2'>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={displayValue}
        onBlur={handleBlur}
        onChange={(e) => handleChange(e.target.value)}
        className=''
      >
        <option value='' disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.errors && meta.errors.length > 0 ? (
        <em className='text-red-500 text-xs italic'>{meta.errors.join(', ')}</em>
      ) : null}
    </div>
  );
};

export { SelectInput };
