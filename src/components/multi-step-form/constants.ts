export const FORM_STEPS = {
  USER: 'user',
  ADDRESS: 'address',
  ACCOUNTING: 'accounting',
  CONFIRMATION: 'confirmation',
} as const;

export type FormStep = (typeof FORM_STEPS)[keyof typeof FORM_STEPS];

export const STEP_ORDER: readonly FormStep[] = [
  FORM_STEPS.USER,
  FORM_STEPS.ADDRESS,
  FORM_STEPS.ACCOUNTING,
  FORM_STEPS.CONFIRMATION,
] as const;
