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
        return formApi.parseValuesWithSchema(
          personalDetailsSchema as typeof multiStepFormSchema
        );
      }
      if (value.step === formStepEnum.ADDRESS) {
        return formApi.parseValuesWithSchema(
          addressDetailsSchema as typeof multiStepFormSchema
        );
      }
      if (value.step === formStepEnum.ACCOUNTING) {
        return formApi.parseValuesWithSchema(
          accountingDetailsSchema as typeof multiStepFormSchema
        );
      }
      if (value.step === formStepEnum.CONFIRMATION) {
        return formApi.parseValuesWithSchema(multiStepFormSchema);
      }
    },
    
    //Changes validation mode to 'change' once a form step has been 'submitted' (meaning, if the user goes back and i.e. removes a required field, the validation will trigger immediately)
    onDynamic: ({ value, formApi }) => {
      if (value.step === formStepEnum.PERSONAL) {
        return formApi.parseValuesWithSchema(
          personalDetailsSchema as typeof multiStepFormSchema
        );
      }
      if (value.step === formStepEnum.ADDRESS) {
        return formApi.parseValuesWithSchema(
          addressDetailsSchema as typeof multiStepFormSchema
        );
      }
      if (value.step === formStepEnum.ACCOUNTING) {
        return formApi.parseValuesWithSchema(
          accountingDetailsSchema as typeof multiStepFormSchema
        );
      }
    },
  },
});
