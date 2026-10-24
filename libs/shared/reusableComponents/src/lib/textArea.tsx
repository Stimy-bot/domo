// libs/shared/reusableComponents/src/lib/textArea.tsx

interface FieldMeta {
  errors: string[];
}

interface FieldState {
  meta: FieldMeta;
  value: string;
}

interface Field {
  name: string;
  state: FieldState;
  handleBlur: () => void;
  handleChange: (value: string) => void;
}

interface TextAreaProps {
  field: Field;
  label: string;
  rows?: number;
}

const TextArea = ({ field, label, rows = 4 }: TextAreaProps) => (
  <div className="mb-5 w-full">
    <label htmlFor={field.name} className="text-dark-light font-semibold block">
      {label}
    </label>
    <textarea
      id={field.name}
      name={field.name}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={e => field.handleChange(e.target.value)}
      rows={rows}
      placeholder={label}
      // Added 'text-base' for iOS zoom prevention and 'focus:border-primary' for better UX
      className="  placeholder:text-dark-light bg-white text-dark-hard my-3 rounded-lg px-5 py-4 font-semibold block outline-none border w-full"
    ></textarea>
    {field.state.meta.errors.length > 0 ? (
      <div className="mt-1">
        {field.state.meta.errors.map((error: string, i: number) => (
          <p key={i} className="text-red-500 text-xs md:text-sm italic">
            {error}
          </p>
        ))}
      </div>
    ) : null}
  </div>
);
export { TextArea };
