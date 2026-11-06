// libs/shared/reusableComponents/src/lib/textInput.tsx

import type { AnyFieldApi } from '@tanstack/react-form';
import { BaseInput } from './baseInput';

const TextInput = ({ field, label, ...rest }: { field: AnyFieldApi; label: string }) => (
  <BaseInput field={field} label={label} type='text' {...rest} />
);

export { TextInput };
