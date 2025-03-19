import { z } from 'zod';

export const SignInSchema = z.object({
  identifier: z.string(), // email or username
  password: z.string(),
});
