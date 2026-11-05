// libs/shared/reusableComponents/src/lib/formFactory.tsx

import { useToast } from '@domo/context';
import {
  type DeepKeys,
  type FormApi,
  type FormOptions,
  type FieldApi as TanstackFieldApi,
  useForm,
} from '@tanstack/react-form';
import type React from 'react';
import { useMemo, useState } from 'react';
import Captcha from './captcha';
import { SubmitButton } from './submitButton';

export type ConsistentFormApi<TFormValues extends Record<string, unknown>> = FormApi<
  TFormValues,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
>;

type ConsistentFieldApi<
  TFormValues extends Record<string, unknown>,
  TName extends DeepKeys<TFormValues> = DeepKeys<TFormValues>,
> = TanstackFieldApi<
  TFormValues,
  TName,
  any,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined
>;

export interface SubmissionResult {
  success: boolean;
  message: string;
  redirect?: string;
}

export interface FormFactoryProps<TFormValues extends Record<string, unknown>> {
  formOptions: Omit<
    FormOptions<TFormValues, any, any, any, any, any, any, any, any, any, any>,
    'onSubmit'
  >;
  fieldsConfig: FieldConfig<TFormValues>[];
  onValidSubmit: (props: {
    value: TFormValues;
    formApi: ConsistentFormApi<TFormValues>;
  }) => SubmissionResult | Promise<SubmissionResult>;
  submitButtonText: string;
  isSubmittingExternally?: boolean;
}

export interface FieldConfig<
  TFormValues extends Record<string, unknown>,
  TProps = Record<string, unknown>,
> {
  name: DeepKeys<TFormValues>;
  label: string;
  placeholder?: string;
  gridSpan?: string;
  component: React.ComponentType<
    {
      field: ConsistentFieldApi<TFormValues>;
      label: string;
      placeholder?: string;
    } & TProps
  >;
  validators?: unknown;
  props?: TProps;
  visible?: (form: ConsistentFormApi<TFormValues>) => boolean;
  section?: string;
}

function FormFactory<TFormValues extends Record<string, unknown>>({
  formOptions,
  fieldsConfig,
  onValidSubmit,
  submitButtonText, // Added this missing prop to the destructuring
}: FormFactoryProps<TFormValues>) {
  const { addToast } = useToast();

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  const handleCentralizedSubmit = async (props: {
    value: TFormValues;
    formApi: ConsistentFormApi<TFormValues>;
  }) => {
    if (!captchaVerified) {
      setCaptchaError('Please complete the CAPTCHA before submitting.');
      return;
    }
    setCaptchaError('');

    try {
      const result = await onValidSubmit(props);

      if (result.success) {
        addToast({ message: result.message, type: 'success' });
        if (result.redirect) {
          window.location.replace(result.redirect);
        }
      } else {
        addToast({
          message: result.message || 'Submission failed.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Form Factory Submit Error:', error);
      addToast({ message: 'A critical error occurred.', type: 'error' });
    }
  };

  const form = useForm({
    ...formOptions,
    onSubmit: handleCentralizedSubmit,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void form.handleSubmit();
  };

  const groupedFields = useMemo(() => {
    return fieldsConfig.reduce(
      (acc, field) => {
        const key = field.section ?? 'default';
        acc[key] = acc[key] ?? [];
        acc[key].push(field);
        return acc;
      },
      {} as Record<string, FieldConfig<TFormValues, any>[]>,
    );
  }, [fieldsConfig]);

  return (
    <div className="container pb-20 mx-auto px-5 dark:bg-dark-hard bg-white">
      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        {Object.entries(groupedFields).map(([section, fields]) => (
          <div key={section} className="mb-6">
            {section !== 'default' && (
              <div className="col-span-full mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {section}
                  </h3>
                  <div className="h-px grow bg-gray-200 dark:bg-zinc-800" />
                </div>
              </div>
            )}
            {fields.map(
              ({ name, label, placeholder, component: Component, validators, props, visible }) => {
                if (visible && !visible(form)) return null;
                return (
                  <form.Field key={name} name={name} validators={validators as any}>
                    {field => (
                      <Component
                        field={field as unknown as ConsistentFieldApi<TFormValues>}
                        label={label}
                        placeholder={placeholder}
                        {...(props ?? {})}
                      />
                    )}
                  </form.Field>
                );
              },
            )}
          </div>
        ))}

        <Captcha
          onVerify={isVerified => {
            setCaptchaVerified(isVerified);
            if (isVerified) setCaptchaError('');
          }}
        />

        {captchaError && (
          <p className="p-4 text-center text-red-500 text-sm mt-2 font-semibold">{captchaError}</p>
        )}

        <SubmitButton
          form={form}
          disabled={form.state.isSubmitting}
          submitButtonText={submitButtonText}
        >
          {form.state.isSubmitting ? 'Sending...' : submitButtonText}
        </SubmitButton>
      </form>
    </div>
  );
}

export { FormFactory };
