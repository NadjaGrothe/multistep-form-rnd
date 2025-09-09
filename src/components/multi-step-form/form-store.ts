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

//TODO: this will have to change, not sure how yet
const stepOrder = ['user', 'address', 'accounting', 'confirmation'] as const;

export const store = createMultiStepFormStore(defaultValues, stepOrder);
