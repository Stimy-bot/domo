// libs/shared/reusableComponents/src/lib/passwordInput.tsx
import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';
import { BaseInput } from './baseInput';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'field'> {
  field?: AnyFieldApi;
  label?: string;
}

const PasswordInput = ({ field, label = '', ...rest }: PasswordInputProps) => (
  <BaseInput field={field as AnyFieldApi} label={label} type="password" {...rest} />
);

export { PasswordInput };
