import type { CompleteFormData } from './schema';
import { createMultiStepFormStore } from './store';

const defaultValues: CompleteFormData = {
  user: {
    nameFirst: '',
    nameLast: '',
    email: '',
  },
  address: {
    address1: '',
    postcode: '',
    townCity: '',
  },
  accounting: {
    taxNumber: '',
    legalCompanyName: '',
  },
};

export const store = createMultiStepFormStore(defaultValues, {
  extraSteps: ['confirmation'] as const,
});

export type StoreStep = ReturnType<
  typeof store.getState
>['currentStep']['value'];
