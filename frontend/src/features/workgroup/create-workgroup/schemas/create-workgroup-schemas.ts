import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

export const step2Schema = z.object({
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
});

export const step3Schema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
});
