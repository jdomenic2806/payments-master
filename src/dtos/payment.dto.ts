import { z } from 'zod';

export const ProcessPaymentDTO = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  provider: z.enum(['stripe', 'conekta']).refine((val) => ['stripe', 'conekta'].includes(val), {
    message: 'Invalid payment provider',
  }),
});

export const CheckPaymentDTO = z.object({
  transactionId: z.string().uuid('Invalid transaction ID format'),
});

export const CreatePaymentIntentDTO = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
});

export type ProcessPaymentInput = z.infer<typeof ProcessPaymentDTO>;
export type CheckPaymentInput = z.infer<typeof CheckPaymentDTO>;
export type CreatePaymentIntentInput = z.infer<typeof CreatePaymentIntentDTO>;
