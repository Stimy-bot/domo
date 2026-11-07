// libs/shared/reusableComponents/src/lib/emailInput.tsx
import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';
import { BaseInput } from './baseInput';

export interface EmailInputProps extends Omit<ComponentProps<'input'>, 'field' | 'type'> {
  field?: AnyFieldApi;
  label?: string;
}

const EmailInput = ({ field, label = '', ...rest }: EmailInputProps) => (
  <BaseInput field={field as AnyFieldApi} label={label} type='email' {...rest} />
);

export { EmailInput };
