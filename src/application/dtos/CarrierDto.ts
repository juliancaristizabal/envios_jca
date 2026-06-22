import { z } from 'zod';

export const CreateCarrierSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos'),
  vehicleType: z.enum(['moto', 'van', 'camion'], {
    errorMap: () => ({ message: 'Tipo de vehículo inválido. Use: moto, van o camion' }),
  }),
  capacityKg: z.number().positive('La capacidad en kg debe ser mayor a 0'),
  capacityM3: z.number().positive('La capacidad en m³ debe ser mayor a 0'),
});

export type CreateCarrierDto = z.infer<typeof CreateCarrierSchema>;
