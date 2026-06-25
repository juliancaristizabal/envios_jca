import { z } from 'zod';

export const LoginAdminSchema = z.object({
  email: z.string().email('El correo no tiene un formato válido'),
  password: z.string().min(1, 'La contraseña es requerida').max(200),
});

export type LoginAdminDto = z.infer<typeof LoginAdminSchema>;
