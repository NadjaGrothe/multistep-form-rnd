export const FORM_STEPS = {
  USER: 'user',
  ADDRESS: 'address',
  ACCOUNTING: 'accounting',
  CONFIRMATION: 'confirmation',
} as const;

export type FormStep = (typeof FORM_STEPS)[keyof typeof FORM_STEPS];
