// libs/shared/reusableComponents/src/lib/textArea.tsx

import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';
import { BaseInput } from './baseInput';

export interface TextAreaProps extends Omit<ComponentProps<'textarea'>, 'field' | 'type'> {
  field?: AnyFieldApi;
  label?: string;
}

const TextArea = ({ field, label = '', ...rest }: TextAreaProps) => (
  <BaseInput field={field as AnyFieldApi} label={label} type='textarea' {...rest} />
);

export { TextArea };
