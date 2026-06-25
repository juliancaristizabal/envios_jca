import { z } from 'zod';

export const LoginUserSchema = z.object({
  email: z.string().email('El correo no tiene un formato válido'),
  password: z.string().min(1, 'La contraseña es requerida').max(200),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
