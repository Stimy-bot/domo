// libs/shared/reusableComponents/src/lib/radioGroup.tsx
interface Field {
  name: string;
  state: {
    value: any;
    meta: any;
  };
  handleBlur: () => void;
  handleChange: (value: any) => void;
}

interface Option {
  value: string;
  label: string;
}
const RadioGroup = ({
  field,
  label,
  options,
}: {
  field: Field;
  label: string;
  options: Option[];
}) => (
  <div className="mb-4">
    <label className="block text-dark-light text-sm font-bold mb-2">{label}</label>
    {options.map(option => (
      <div key={option.value} className="flex items-center mb-2 text-dark-light">
        <input
          type="radio"
          id={`${field.name}-${option.value}`}
          name={field.name}
          value={option.value}
          checked={field.state.value === option.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          className="mr-2 leading-tight"
        />
        <label htmlFor={`${field.name}-${option.value}`} className="text -sm text-dark-light">
          {option.label}
        </label>
      </div>
    ))}
    {field.state.meta.errors ? (
      <em className="text-red-500 text-xs italic">{field.state.meta.errors.join(', ')}</em>
    ) : null}
  </div>
);

export { RadioGroup };
