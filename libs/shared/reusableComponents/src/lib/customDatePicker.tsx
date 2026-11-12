// libs/shared/reusableComponents/src/lib/customDatePicker.tsx
import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Utility for dynamic class names
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Custom input used by react-datepicker
const CustomDateInput = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type='text'
      className={cn('custom-class', 'additional-class', 'w-full', 'mt-1', className)}
    />
  ),
);
CustomDateInput.displayName = 'CustomDateInput';

// Fully controlled date picker with no internal state
const CustomDatePicker: React.FC<React.ComponentProps<typeof DatePicker>> = (props) => {
  return (
    <DatePicker
      {...props}
      customInput={<CustomDateInput />}
      // If needed, configure defaults like dateFormat or dropdown options here
      dateFormat='MM-dd-yyyy'
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
    />
  );
};

CustomDatePicker.displayName = 'CustomDatePicker';

export { CustomDatePicker };
export default CustomDatePicker;
