import { z } from 'zod';

export const schema = z.object({
  isPrivate: z.boolean().optional(),
  to: z.string().optional(),
  text: z.string(),
  type: z.enum(['image', 'text']),
});

export const idSchema = z.string().uuid();

export type Message = z.infer<typeof schema>;
