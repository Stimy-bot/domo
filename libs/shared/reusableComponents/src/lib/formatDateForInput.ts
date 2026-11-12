// libs/shared/reusableComponents/src/lib/formatDateForInput.ts
import { format } from 'date-fns';

const FormatDateForInput = (date: string | number | Date | null): string => {
  if (!date) return '';

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  return format(d, 'YYYY-DD-MM');
};

export { FormatDateForInput };
