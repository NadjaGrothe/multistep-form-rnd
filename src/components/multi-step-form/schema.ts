import * as z from 'zod';

export const personalDetailsSchema = z.object({
  personalDetails: z.object({
    nameFirst: z.string().min(1, 'First name is required'),
    nameLast: z.string().min(1, 'Last name is required'),
    email: z.email('Please enter a valid email address'),
  }),
});

export const addressDetailsSchema = z.object({
  addressDetails: z.object({
    address1: z.string().min(1, 'Address is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    townCity: z.string().min(1, 'Town/City is required'),
  }),
});

export const accountingDetailsSchema = z.object({
  accountingDetails: z.object({
    taxNumber: z.string().min(1, 'Tax number is required'),
    legalCompanyName: z.string().min(1, 'Legal company name is required'),
  }),
});

export const formStepEnum = {
  PERSONAL: 'personal',
  ADDRESS: 'address',
  ACCOUNTING: 'accounting',
  CONFIRMATION: 'confirmation',
} as const;

export type FormStepEnum = (typeof formStepEnum)[keyof typeof formStepEnum];

// Step order configuration for multi-step form
export const stepOrder = [
  formStepEnum.PERSONAL, // index 0
  formStepEnum.ADDRESS, // index 1
  formStepEnum.ACCOUNTING, // index 2
  formStepEnum.CONFIRMATION, // index 3
] as const;

export const multiStepFormSchema = z.object({
  step: z.enum(Object.values(formStepEnum)),
  ...personalDetailsSchema.shape,
  ...addressDetailsSchema.shape,
  ...accountingDetailsSchema.shape,
});

export type MultiStepFormSchema = z.infer<typeof multiStepFormSchema>;
