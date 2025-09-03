import * as z from 'zod';

// Step 1 schema - Personal Information
export const step1Schema = z.object({
  nameFirst: z.string().min(1, 'First name is required'),
  nameLast: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
});

// Step 2 schema - Address Information
export const step2Schema = z.object({
  address1: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  townCity: z.string().min(1, 'Town/City is required'),
});

// Step 3 schema - Accounting Information
export const step3Schema = z.object({
  taxNumber: z.string().min(1, 'Tax number is required'),
  legalCompanyName: z.string().min(1, 'Legal company name is required'),
});

// Complete form schema (combination of all steps)
export const formSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

// Type exports
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type CompleteFormData = z.infer<typeof formSchema>;

// Aliases for backward compatibility and consistency with existing code
export type Step1Data = Step1FormData;
export type Step2Data = Step2FormData;
export type Step3Data = Step3FormData;
export type MultiStepFormData = CompleteFormData;
