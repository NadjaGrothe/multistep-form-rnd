import * as z from 'zod';

// Step 1 schema - Personal Information
export const userSchema = z.object({
  nameFirst: z.string().min(1, 'First name is required'),
  nameLast: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
});

// Step 2 schema - Address Information
export const addressSchema = z.object({
  address1: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  townCity: z.string().min(1, 'Town/City is required'),
});

// Step 3 schema - Accounting Information
export const accountingSchema = z.object({
  taxNumber: z.string().min(1, 'Tax number is required'),
  legalCompanyName: z.string().min(1, 'Legal company name is required'),
});

// Complete form schema (combination of all steps)
export const formSchema = z.object({
  user: userSchema,
  address: addressSchema,
  accounting: accountingSchema,
});

// Type exports
export type UserFormData = z.infer<typeof userSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type AccountingFormData = z.infer<typeof accountingSchema>;
export type CompleteFormData = z.infer<typeof formSchema>;
