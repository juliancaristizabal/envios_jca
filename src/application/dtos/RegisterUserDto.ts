import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  email: z
    .string()
    .email('El correo no tiene un formato válido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
