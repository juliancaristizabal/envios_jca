import { z } from 'zod';

export const UpdateStatusSchema = z.object({
  status: z.enum(['in_transit', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Estado inválido. Use: in_transit, delivered o cancelled' }),
  }),
  notes: z.string().max(500).optional(),
});

export type UpdateStatusDto = z.infer<typeof UpdateStatusSchema>;
