import { z } from 'zod';

export const CreateRouteSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  originCity: z.string().min(2, 'La ciudad de origen es requerida'),
  destinationCity: z.string().min(2, 'La ciudad de destino es requerida'),
  estimatedDays: z
    .number()
    .int('Los días estimados deben ser un número entero')
    .positive('Los días estimados deben ser mayor a 0'),
});

export type CreateRouteDto = z.infer<typeof CreateRouteSchema>;
