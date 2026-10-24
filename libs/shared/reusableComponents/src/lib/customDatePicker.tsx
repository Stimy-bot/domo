// libs/shared/reusableComponents/src/lib/customDatePicker.tsx
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from './input';

// Utility for dynamic class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// Props for custom input
interface CustomDateInputProps {
  onClick?: () => void;
  value?: string;
}

// Custom input used by react-datepicker
const CustomDateInput = React.forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ onClick, value }, ref) => (
    <Input
      type="date"
      onClick={onClick}
      value={value}
      ref={ref}
      readOnly
      className={cn(
        'custom-class',
        'additional-class',
        'w-full',
        'mt-1 rounded-lg',
        'outline-none border text-dark-light font-semibold bg-white',
      )}
    />
  ),
);
CustomDateInput.displayName = 'CustomDateInput';

// Fully controlled date picker with no internal state
const CustomDatePicker: React.FC<React.ComponentProps<typeof DatePicker>> = props => {
  return (
    <DatePicker
      {...props}
      customInput={<CustomDateInput />}
      // If needed, configure defaults like dateFormat or dropdown options here
      dateFormat="yyyy-MM-dd"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
    />
  );
};

CustomDatePicker.displayName = 'CustomDatePicker';

export { CustomDatePicker };
export default CustomDatePicker;
