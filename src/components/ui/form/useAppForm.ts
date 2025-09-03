import { createFormHook } from '@tanstack/react-form';
import { FormInput } from './FormInput';
import { fieldContext, formContext } from './context';

export const { useAppForm, withFieldGroup, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormInput,
  },
  formComponents: {},
});
