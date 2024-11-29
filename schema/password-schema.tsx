import { z, ZodSchema } from 'zod';

export function passwordSchema(): ZodSchema {
  const schema = z.object({
    password: z
      .string()
      .min(5, 'Your password must be at least 5 characters.')
      .regex(/[0-9]/, 'Your password must include a number.')
      .regex(/[A-Z]/, 'Your password must include an uppercase letter.'),
  });

  return schema;
}
