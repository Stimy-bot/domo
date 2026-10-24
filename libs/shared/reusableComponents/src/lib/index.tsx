import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { SubmitButton } from './submitButton';

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
