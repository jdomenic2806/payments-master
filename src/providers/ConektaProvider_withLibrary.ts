/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import conekta from 'conekta';
import { PaymentProcessorOptions } from '../interfaces';

// Initialize Conekta
conekta.api_key = process.env.CONEKTA_PUBLIC_KEY || '';
conekta.api_version = '2.0.0';

export const processConektaPayment = async ({ amount, currency, paymentMethod }: PaymentProcessorOptions) => {
  try {
    // Create order with Conekta
    const order = await conekta.Order.create({
      currency,
      customer_info: {
        name: 'Anonymous Customer',
        phone: '+5215555555555',
        email: 'anonymous@example.com',
      },
      line_items: [
        {
          name: 'Payment',
          unit_price: Math.round(amount * 100), // Conekta expects amounts in cents
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
    });

    // Map Conekta status to our status
    let status: 'pending' | 'completed' | 'failed';
    switch (order.payment_status) {
      case 'paid':
        status = 'completed';
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
        paymentMethod: order.charges[0].payment_method.type,
        currency: order.currency,
        amount: order.amount / 100, // Convert back to decimal
        conektaStatus: order.payment_status,
      },
    };
  } catch (error: any) {
    throw new Error(`Conekta payment failed: ${error.message}`);
  }
};
