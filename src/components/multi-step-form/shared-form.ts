import { formOptions } from '@tanstack/react-form';
import {
  accountingDetailsSchema,
  addressDetailsSchema,
  formStepEnum,
  multiStepFormSchema,
  personalDetailsSchema,
  type MultiStepFormSchema,
} from './schema';

const defaultValues: MultiStepFormSchema = {
  step: formStepEnum.PERSONAL,
  personalDetails: {
    nameFirst: '',
    nameLast: '',
    email: '',
  },
  addressDetails: {
    address1: '',
    postcode: '',
    townCity: '',
  },
  accountingDetails: {
    taxNumber: '',
    legalCompanyName: '',
  },
};

export const multiStepFormOptions = formOptions({
  defaultValues,
  validators: {
    onSubmit: ({ value, formApi }) => {
      if (value.step === formStepEnum.PERSONAL) {
        const parsed = formApi.parseValuesWithSchema(
          personalDetailsSchema as typeof multiStepFormSchema
        );
        if (!parsed) formApi.setFieldValue('step', formStepEnum.ADDRESS);
        return parsed;
      }
      if (value.step === formStepEnum.ADDRESS) {
        const parsed = formApi.parseValuesWithSchema(
          addressDetailsSchema as typeof multiStepFormSchema
        );
        if (!parsed) formApi.setFieldValue('step', formStepEnum.ACCOUNTING);
        return parsed;
      }
      if (value.step === formStepEnum.ACCOUNTING) {
        const parsed = formApi.parseValuesWithSchema(
          accountingDetailsSchema as typeof multiStepFormSchema
        );
        if (!parsed)
          //Need timeout to prevent the onSubmit in the confirmation step to trigger immediately - not very elegant but works for now
          setTimeout(
            () => formApi.setFieldValue('step', formStepEnum.CONFIRMATION),
            100
          );
        return parsed;
      }
    },
  },
});
