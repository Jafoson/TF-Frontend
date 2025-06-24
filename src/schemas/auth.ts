import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'usernameMinLength')
    .max(50, 'usernameMaxLength')
    .regex(/^[a-zA-Z0-9_-]+$/, 'usernameRegex'),
  
  email: z.string()
    .email('emailInvalid')
    .max(255, 'emailMaxLength'),
  
  password: z.string()
    .min(8, 'passwordMinLength')
    .regex(/[A-Z]/, 'passwordUppercase')
    .regex(/[a-z]/, 'passwordLowercase')
    .regex(/[0-9]/, 'passwordNumber')
    .regex(/[^A-Za-z0-9]/, 'passwordSpecial'),

    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsDoNotMatch',
    path: ['confirmPassword']
  })

export type RegisterSchema = z.infer<typeof registerSchema>; 