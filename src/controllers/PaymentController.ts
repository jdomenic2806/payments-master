import { Request, Response } from 'express';
import {
  processPayment,
  handleStripeWebhook,
  handleConektaWebhook,
  checkPaymentStatus,
  createPaymentIntent,
} from '../services/PaymentService';
import { ProcessPaymentDTO, CheckPaymentDTO, CreatePaymentIntentDTO } from '../dtos/payment.dto';

export const handleProcessPayment = async (req: Request, res: Response) => {
  try {
    const validation = ProcessPaymentDTO.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validation.error.format(),
      });
    }

    const { amount, currency, paymentMethod, provider } = validation.data;
    const transaction = await processPayment(req.user!.id, amount, currency, paymentMethod, provider);

    res.json(transaction);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};

export const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const sig = Array.isArray(req.headers['stripe-signature'])
    ? req.headers['stripe-signature'][0]
    : req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature found' });
  }

  try {
    const event = await handleStripeWebhook(req.body, sig);
    res.json({ received: true, type: event.type });
  } catch (error) {
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
};

export const handleConektaWebhookEvent = async (req: Request, res: Response) => {
  const sig = Array.isArray(req.headers['conekta-signature'])
    ? req.headers['conekta-signature'][0]
    : req.headers['conekta-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'No signature found' });
  }

  try {
    const event = await handleConektaWebhook(req.body, sig);
    res.json({ received: true, type: event.type });
  } catch (error) {
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
};

export const handleCheckPayment = async (req: Request, res: Response) => {
  try {
    const validation = CheckPaymentDTO.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validation.error.format(),
      });
    }

    const { transactionId } = validation.data;

    try {
      const result = await checkPaymentStatus(transactionId);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Payment verification timeout') {
        res.status(408).json({
          error: 'Payment verification timeout',
          status: 'failed',
          transactionId,
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to check payment status' });
  }
};

export const handleCreatePaymentIntent = async (req: Request, res: Response) => {
  try {
    const validation = CreatePaymentIntentDTO.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: validation.error.format(),
      });
    }

    const { amount, currency } = validation.data;
    const paymentIntent = await createPaymentIntent(req.user!.id, amount, currency);

    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};
