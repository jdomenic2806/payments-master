/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import crypto from 'crypto';
import { ITransaction } from '../interfaces';
import PaymentProviderModel from '../models/PaymentProvider';
import TransactionModel from '../models/Transaction';
import { processStripePayment } from '../providers/StripeProvider';
import { processConektaPayment } from '../providers/ConektaProvider';
import { logger } from '../utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const CONEKTA_WEBHOOK_SECRET = process.env.CONEKTA_WEBHOOK_SECRET || '';
const PAYMENT_CHECK_INTERVAL = 2000; // 2 seconds
const MAX_CHECK_TIME = 120000; // 120 seconds
// const MAX_ITERATIONS = MAX_CHECK_TIME / PAYMENT_CHECK_INTERVAL; // 60 iterations

const getProviderProcessor = (type: string) => {
  switch (type) {
    case 'stripe':
      return processStripePayment;
    case 'conekta':
      return processConektaPayment;
    default:
      throw new Error(`Unsupported provider type: ${type}`);
  }
};

export const processPayment = async (
  userId: string,
  amount: number,
  currency: string,
  paymentMethod: string,
  providerType: 'stripe' | 'conekta',
): Promise<ITransaction> => {
  try {
    logger.info('Processing payment', {
      userId,
      amount,
      currency,
      providerType,
    });

    const provider = await PaymentProviderModel.findOne({
      where: {
        type: providerType,
        isActive: true,
      },
    });

    if (!provider) {
      logger.error('No active payment provider found', { providerType });
      throw new Error(`No active payment provider found for type: ${providerType}`);
    }

    const processPaymentWithProvider = getProviderProcessor(providerType);

    const paymentResult = await processPaymentWithProvider({
      amount,
      currency,
      paymentMethod,
    });

    logger.info('Payment processed successfully', {
      userId,
      transactionId: paymentResult.transactionId,
      status: paymentResult.status,
    });

    const transaction = await TransactionModel.create({
      userId,
      providerId: provider.id,
      amount,
      currency,
      status: paymentResult.status === 'succeeded' ? 'completed' : 'pending',
      paymentMethod,
      metadata: paymentResult,
    });

    return transaction.toJSON();
  } catch (error) {
    logger.error('Payment processing failed:', error);
    throw error;
  }
};

const handleSuccessfulPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  const transaction = await TransactionModel.findOne({
    where: {
      'metadata.transactionId': paymentIntent.id,
    },
  });

  if (transaction) {
    await transaction.update({
      status: 'completed',
      metadata: {
        ...transaction.metadata,
        stripeEvent: 'payment_intent.succeeded',
        paymentIntentStatus: paymentIntent.status,
      },
    });
  }
};

const handleFailedPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  const transaction = await TransactionModel.findOne({
    where: {
      'metadata.transactionId': paymentIntent.id,
    },
  });

  if (transaction) {
    await transaction.update({
      status: 'failed',
      metadata: {
        ...transaction.metadata,
        stripeEvent: 'payment_intent.payment_failed',
        paymentIntentStatus: paymentIntent.status,
        lastFailureMessage: paymentIntent.last_payment_error?.message,
      },
    });
  }
};

export const handleStripeWebhook = async (payload: any, signature: string) => {
  const event = stripe.webhooks.constructEvent(payload, signature, WEBHOOK_SECRET);

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    default:
      throw new Error(`Unsupported Stripe event type: ${event.type}`);
  }

  return event;
};

const handleConektaSuccessfulPayment = async (order: any) => {
  const transaction = await TransactionModel.findOne({
    where: {
      'metadata.transactionId': order.id,
    },
  });

  if (transaction) {
    await transaction.update({
      status: 'completed',
      metadata: {
        ...transaction.metadata,
        conektaEvent: 'order.paid',
        conektaStatus: order.payment_status,
      },
    });
  }
};

const handleConektaFailedPayment = async (order: any) => {
  const transaction = await TransactionModel.findOne({
    where: {
      'metadata.transactionId': order.id,
    },
  });

  if (transaction) {
    await transaction.update({
      status: 'failed',
      metadata: {
        ...transaction.metadata,
        conektaEvent: 'order.payment_failed',
        conektaStatus: order.payment_status,
        lastFailureMessage: order.failure_message,
      },
    });
  }
};

export const handleConektaWebhook = async (payload: any, signature: string) => {
  // Verify Conekta webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', CONEKTA_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.error('Invalid Conekta webhook signature');
    throw new Error('Invalid webhook signature');
  }

  const event = JSON.parse(payload);
  logger.info('Processing Conekta webhook', {
    type: event.type,
    id: event.data.id,
  });

  switch (event.type) {
    case 'order.paid':
      await handleConektaSuccessfulPayment(event.data);
      break;
    case 'order.payment_failed':
      await handleConektaFailedPayment(event.data);
      break;
    case 'order.pending_payment':
      // Handle pending payment - no action needed as the frontend will poll
      logger.info('Payment pending, waiting for confirmation', {
        orderId: event.data.id,
      });
      break;
    default:
      throw new Error(`Unsupported Conekta event type: ${event.type}`);
  }

  return event;
};

export const checkPaymentStatus = async (transactionId: string): Promise<ITransaction> => {
  const startTime = Date.now();

  const checkStatus = async (): Promise<ITransaction> => {
    const transaction = await TransactionModel.findByPk(transactionId);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'completed') {
      return transaction.toJSON();
    }

    if (transaction.status === 'failed') {
      return transaction.toJSON();
    }

    if (Date.now() - startTime >= MAX_CHECK_TIME) {
      await transaction.update({
        status: 'failed',
        metadata: {
          ...transaction.metadata,
          failureReason: 'Timeout waiting for payment confirmation',
        },
      });
      throw new Error('Payment verification timeout');
    }

    await new Promise((resolve) => setTimeout(resolve, PAYMENT_CHECK_INTERVAL));
    return checkStatus();
  };

  return checkStatus();
};

// Implementación alternativa usando un bucle for (solo como referencia)
// export const checkPaymentStatus2 = async (transactionId: string): Promise<Transaction> => {
//   for (let i = 0; i < MAX_ITERATIONS; i++) {
//     const transaction = await TransactionModel.findByPk(transactionId);

//     if (!transaction) {
//       throw new Error('Transaction not found');
//     }

//     if (transaction.status === 'completed') {
//       return transaction.toJSON();
//     }

//     if (transaction.status === 'failed') {
//       return transaction.toJSON();
//     }

//     if (i === MAX_ITERATIONS - 1) {
//       await transaction.update({
//         status: 'failed',
//         metadata: {
//           ...transaction.metadata,
//           failureReason: 'Timeout waiting for payment confirmation',
//         },
//       });
//       throw new Error('Payment verification timeout');
//     }

//     await new Promise((resolve) => setTimeout(resolve, PAYMENT_CHECK_INTERVAL));
//   }

//   throw new Error('Payment verification timeout');
// };

export const createPaymentIntent = async (userId: string, amount: number, currency: string) => {
  const provider = await PaymentProviderModel.findOne({
    where: {
      type: 'stripe',
      isActive: true,
    },
  });

  if (!provider) {
    throw new Error('No active Stripe provider found');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};
