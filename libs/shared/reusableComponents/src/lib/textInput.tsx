// libs/shared/reusableComponents/src/lib/textInput.tsx

import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';
import { BaseInput } from './baseInput';

export interface TextInputProps extends Omit<ComponentProps<'input'>, 'field' | 'type'> {
  field?: AnyFieldApi;
  label?: string;
}

const TextInput = ({ field, label = '', ...rest }: TextInputProps) => (
  <BaseInput field={field} label={label} type='text' {...rest} />
);

export { TextInput };
