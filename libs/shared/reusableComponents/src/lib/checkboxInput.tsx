// libs/shared/reusableComponents/src/lib/checkboxInput.tsx
interface Field {
  name: string;
  state: {
    meta: any;
    value: boolean;
  };
  handleBlur: () => void;
  handleChange: (value: boolean) => void;
}

const CheckboxInput = ({ field, label }: { field: Field; label: string }) => (
  <div className="mb-4 flex items-center">
    <input
      id={field.name}
      name={field.name}
      type="checkbox"
      checked={field.state.value}
      onBlur={field.handleBlur}
      onChange={e => field.handleChange(e.target.checked)}
      className="mr-2 leading-tight"
    />
    <label htmlFor={field.name} className="text-sm text-dark-hard font-bold">
      {label}
    </label>
    {field.state.meta.errors ? (
      <em className="text-red-500 text-xs italic ml-2">{field.state.meta.errors.join(', ')}</em>
    ) : null}
  </div>
);

export default CheckboxInput;
