import { formOptions, revalidateLogic } from '@tanstack/react-form';
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
  validationLogic: revalidateLogic({
    mode: 'submit',
    modeAfterSubmission: 'change',
  }),
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
      if (value.step === formStepEnum.CONFIRMATION) {
        const parsed = formApi.parseValuesWithSchema(multiStepFormSchema);
        return parsed;
      }
    },
    //Changes validation mode to 'change' once a form step has been 'submitted' (meaning, if the user goes back and i.e. removes a required field, the validation will trigger immediately)
    onDynamic: ({ value, formApi }) => {
      if (value.step === formStepEnum.PERSONAL) {
        const parsed = formApi.parseValuesWithSchema(
          personalDetailsSchema as typeof multiStepFormSchema
        );
        return parsed;
      }
      if (value.step === formStepEnum.ADDRESS) {
        const parsed = formApi.parseValuesWithSchema(
          addressDetailsSchema as typeof multiStepFormSchema
        );
        return parsed;
      }
      if (value.step === formStepEnum.ACCOUNTING) {
        const parsed = formApi.parseValuesWithSchema(
          accountingDetailsSchema as typeof multiStepFormSchema
        );
        return parsed;
      }
    },
  },
});
