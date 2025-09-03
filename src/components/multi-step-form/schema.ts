import * as z from 'zod';

export const formSchema = z.object({
  nameFirst: z.string().min(1, 'First name is required'),
  nameLast: z.string().min(1, 'Last name is required'),
  email: z.email(),
  address1: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  townCity: z.string().min(1, 'Town/City is required'),
});
