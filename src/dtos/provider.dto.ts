import { z } from 'zod';

export const CreateProviderDTO = z.object({
  name: z.string().min(1, 'Provider name is required'),
  type: z.enum(['stripe', 'conekta']).refine((val) => ['stripe', 'conekta'].includes(val), {
    message: 'Invalid provider type',
  }),
  config: z.record(z.unknown()),
});

export const UpdateProviderDTO = CreateProviderDTO.partial();

export const UpdateProviderPriorityDTO = z.object({
  priority: z.number().int().min(1, 'Priority must be a positive integer'),
});

export const AssignProviderDTO = z.object({
  providerId: z.string().uuid('Invalid provider ID format'),
  priority: z.number().int().min(1, 'Priority must be a positive integer'),
});

export const UpdateDefaultProviderDTO = z.object({
  defaultProvider: z.enum(['stripe', 'conekta']).refine((val) => ['stripe', 'conekta'].includes(val), {
    message: 'Invalid provider type',
  }),
});

export type CreateProviderInput = z.infer<typeof CreateProviderDTO>;
export type UpdateProviderInput = z.infer<typeof UpdateProviderDTO>;
export type UpdateProviderPriorityInput = z.infer<typeof UpdateProviderPriorityDTO>;
export type AssignProviderInput = z.infer<typeof AssignProviderDTO>;
export type UpdateDefaultProviderInput = z.infer<typeof UpdateDefaultProviderDTO>;
