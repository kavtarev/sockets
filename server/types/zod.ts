import { z } from 'zod';

export const schema = z.object({
  isPrivate: z.boolean().optional(),
  to: z.string().optional(),
  text: z.string(),
});

export type Message = z.infer<typeof schema>;
