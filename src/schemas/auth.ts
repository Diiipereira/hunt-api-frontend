import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'O e-mail é obrigatório' })
        .email({ message: 'E-mail inválido' }),
    password: z
        .string({ required_error: 'A senha é obrigatória' })
        .min(6, { message: 'Mínimo de 6 caracteres' })
});

export const registerSchema = z
    .object({
        username: z
            .string({ required_error: 'O usuário é obrigatório' })
            .min(3, { message: 'Mínimo de 3 caracteres' }),
        email: z
            .string({ required_error: 'O e-mail é obrigatório' })
            .email({ message: 'E-mail inválido' }),
        password: z
            .string({ required_error: 'A senha é obrigatória' })
            .min(6, { message: 'Mínimo de 6 caracteres' }),
        confirmPassword: z.string({ required_error: 'Confirmação obrigatória' })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword']
    });

export const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: 'O e-mail é obrigatório' })
        .email({ message: 'E-mail inválido' })
});

export const resetPasswordSchema = z
    .object({
        token: z.string(),
        password: z
            .string({ required_error: 'A senha é obrigatória' })
            .min(6, { message: 'Mínimo de 6 caracteres' }),
        confirmPassword: z.string({ required_error: 'Confirmação obrigatória' })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword']
    });

export const updatePasswordSchema = z
    .object({
        currentPassword: z.string({ required_error: 'Senha atual obrigatória' }),
        newPassword: z
            .string({ required_error: 'Nova senha obrigatória' })
            .min(6, { message: 'Mínimo de 6 caracteres' }),
        confirmPassword: z.string({ required_error: 'Confirmação obrigatória' })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword']
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'A nova senha deve ser diferente da atual',
        path: ['newPassword']
    });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
