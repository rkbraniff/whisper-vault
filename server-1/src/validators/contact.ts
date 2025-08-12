import { z } from 'zod';

export const contactEmailSchema = z.object({
  email: z.string().email(),
  isPrimary: z.boolean().optional(),
});

export const contactPhoneSchema = z.object({
  e164: z.string().regex(/^\+\d{7,15}$/, 'Phone must be E.164, e.g. +19135551234'),
  label: z.string().max(50).optional(),
});

export const createContactSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  note: z.string().max(2000).optional(),
  emails: z.array(contactEmailSchema).max(10).optional(),
  phones: z.array(contactPhoneSchema).max(10).optional(),
});

export const updateContactSchema = createContactSchema.partial();
