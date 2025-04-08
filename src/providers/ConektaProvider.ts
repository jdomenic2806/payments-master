import axios from 'axios';
import { PaymentProcessorOptions } from '@/interfaces';
import { logger } from '../utils/logger';

const CONEKTA_API_URL = 'https://api.conekta.io';
const CONEKTA_API_VERSION = '2.1.0';

interface ConektaError {
  type: string;
  details: Array<{
    debug_message: string;
    message: string;
    code: string;
  }>;
}

export const processConektaPayment = async ({
  amount,
  currency,
  paymentMethod, // Token desde el frontend
  metadata = {},
  customer = {
    name: 'Anonymous Customer',
    email: 'anonymous@example.com',
    phone: '+5215555555555',
  },
}: PaymentProcessorOptions & {
  metadata?: Record<string, unknown>;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}) => {
  try {
    logger.info('Processing Conekta payment with token', {
      amount,
      currency,
      token: paymentMethod,
    });

    // Crear la orden con Axios
    const response = await axios.post(
      `${CONEKTA_API_URL}/orders`,
      {
        currency,
        customer_info: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
        line_items: [
          {
            name: 'Payment',
            unit_price: Math.round(amount * 100), // Conekta espera montos en centavos
            quantity: 1,
          },
        ],
        charges: [
          {
            payment_method: {
              type: 'card',
              token_id: paymentMethod,
            },
          },
        ],
        metadata,
      },
      {
        headers: {
          Accept: `application/vnd.conekta-v${CONEKTA_API_VERSION}+json`,
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.CONEKTA_PRIVATE_KEY || '',
          password: '', // No se necesita contraseña para autenticación básica con Conekta
        },
      },
    );

    const order = response.data;

    logger.info('Conekta payment processed successfully', {
      orderId: order.id,
      status: order.payment_status,
    });

    // Mapear el estado de Conekta a nuestro estado
    let status: 'pending' | 'succeeded' | 'failed';
    switch (order.payment_status) {
      case 'paid':
        status = 'succeeded';
        break;
      case 'pending_payment':
        status = 'pending';
        break;
      default:
        status = 'failed';
    }

    return {
      provider: 'conekta',
      transactionId: order.id,
      status,
      details: {
        paymentMethod: order.charges.data[0].payment_method.type,
        currency: order.currency,
        amount: order.amount / 100, // Convertir de centavos a decimal
        conektaStatus: order.payment_status,
        metadata: order.metadata,
        last4: order.charges.data[0].payment_method.last4,
        brand: order.charges.data[0].payment_method.brand,
      },
    };
  } catch (error) {
    console.log('error', error);

    if (axios.isAxiosError(error) && error.response) {
      const conektaError = error.response.data as ConektaError;
      const errorMessage =
        conektaError.details?.[0]?.message || conektaError.details?.[0]?.debug_message || 'Unknown Conekta error';

      throw new Error(errorMessage);
    }

    throw new Error('Failed to process Conekta payment');
  }
};
