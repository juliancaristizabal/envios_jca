import { z } from 'zod';

export const LoginAdminSchema = z.object({
  email: z.string().email('El correo no tiene un formato válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export type LoginAdminDto = z.infer<typeof LoginAdminSchema>;
