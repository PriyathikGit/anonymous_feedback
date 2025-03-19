import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(2, 'username must be atleast 2 characters')
  .max(16, 'username must be less than 16 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'username can only contain letters, numbers, and underscores'
  );
export const SignUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'password must be atleast 6 characters' }),
});
