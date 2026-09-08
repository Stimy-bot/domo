// libs/shared/reusableComponents/src/lib/selectInput.tsx
import React from 'react'; // Added explicit React import for completeness

// 1. Refined Field Interface (Assuming value should be string for select)
interface Field {
  name: string;
  state: {
    value: string; // Changed from 'any' to 'string'
    meta: {
      errors?: string[]; // Assuming meta.errors is an optional string array
      // ... other meta properties
    };
  };
  handleBlur: () => void;
  handleChange: (value: string) => void; // Changed from 'any' to 'string'
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
  placeholder = "Select an option"
}) => {
  const { name, state, handleBlur, handleChange } = field;
  const { value, meta } = state;
  const displayValue = Array.isArray(value)
    ? (value[0] ?? '')
    : (value ?? '');
  return (
    <div className="py-4">
      <label htmlFor={name} className="block text-dark-light font-semibold mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={displayValue} // SAFE: This is a string
        onBlur={handleBlur}
        onChange={(e) => handleChange(e.target.value)} // Correctly passes the string value
        className=" font-semibold border rounded w-full py-4.5 px-3 text-dark-light bg-white leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.errors && meta.errors.length > 0 ? (
        <em className="text-red-500 text-xs italic">{meta.errors.join(', ')}</em>
      ) : null}
    </div>
  );
};

export { SelectInput };