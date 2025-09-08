import * as z from 'zod';

// Step 1 schema - Personal Information
export const personalDetailsSchema = z.object({
  nameFirst: z.string().min(1, 'First name is required'),
  nameLast: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
});

// Step 2 schema - Address Information
export const addressDetailsSchema = z.object({
  address1: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  townCity: z.string().min(1, 'Town/City is required'),
});

// Step 3 schema - Accounting Information
export const accountingDetailsSchema = z.object({
  taxNumber: z.string().min(1, 'Tax number is required'),
  legalCompanyName: z.string().min(1, 'Legal company name is required'),
});

// Complete form schema (combination of all steps)
export const formSchema = z.object({
  ...personalDetailsSchema.shape,
  ...addressDetailsSchema.shape,
  ...accountingDetailsSchema.shape,
});

// Type exports
export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;
export type AccountingDetailsFormData = z.infer<typeof accountingDetailsSchema>;
export type CompleteFormData = z.infer<typeof formSchema>;
