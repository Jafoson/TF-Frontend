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

export const loginSchema = z.object({
  password: z.string()
    .min(8, 'passwordMinLength')
    .regex(/[A-Z]/, 'passwordUppercase')
    .regex(/[a-z]/, 'passwordLowercase')
    .regex(/[0-9]/, 'passwordNumber')
    .regex(/[^A-Za-z0-9]/, 'passwordSpecial'),
})


export const verifyCodeSchema = z.object({
  code: z.string()
    .min(6, 'codeMinLength')
    .max(6, 'codeMaxLength'),
})

export const emailSchema = z.object({
  email: z.string()
    .email('emailInvalid')
    .max(255, 'emailMaxLength'),
})

export const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, 'newPasswordMinLength')
    .regex(/[A-Z]/, 'newPasswordUppercase')
    .regex(/[a-z]/, 'newPasswordLowercase')
    .regex(/[0-9]/, 'newPasswordNumber')
    .regex(/[^A-Za-z0-9]/, 'newPasswordSpecial'),
})

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;