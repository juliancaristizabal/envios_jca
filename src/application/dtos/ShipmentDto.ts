import { z } from 'zod';

export const PRODUCT_TYPES = ['electronica', 'ropa', 'alimentos', 'documentos', 'fragil', 'peligroso'] as const;

export const CreateShipmentSchema = z.object({
  weight: z.number().positive('El peso debe ser mayor a 0'),
  width: z.number().positive('El ancho debe ser mayor a 0'),
  height: z.number().positive('El alto debe ser mayor a 0'),
  length: z.number().positive('El largo debe ser mayor a 0'),
  productType: z.enum(PRODUCT_TYPES, {
    error: `Tipo de producto inválido. Valores permitidos: ${PRODUCT_TYPES.join(', ')}`,
  }),
  destAddress: z.string().min(5, 'La dirección de destino es requerida'),
  destCity: z.string().min(2, 'La ciudad de destino es requerida'),
  destCountry: z.string().min(2, 'El país de destino es requerido'),
  destZip: z
    .string()
    .regex(/^\d{4,10}$/, 'El código postal debe contener entre 4 y 10 dígitos'),
});

export const AssignShipmentSchema = z.object({
  carrierId: z.number().int().positive('ID de transportista inválido'),
  routeId: z.number().int().positive('ID de ruta inválido'),
});

export type CreateShipmentDto = z.infer<typeof CreateShipmentSchema>;
export type AssignShipmentDto = z.infer<typeof AssignShipmentSchema>;
