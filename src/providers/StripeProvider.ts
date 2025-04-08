import Stripe from 'stripe';
import { PaymentProcessorOptions } from '../interfaces';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const processStripePayment = async ({ amount, currency, paymentMethod }: PaymentProcessorOptions) => {
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethod,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    return {
      provider: 'stripe',
      transactionId: paymentIntent.id,
      status: paymentIntent.status,
      details: {
        paymentMethod: paymentIntent.payment_method,
        currency: paymentIntent.currency,
        amount: paymentIntent.amount / 100, // Convert back to decimal
      },
    };
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe payment failed: ${error.message}`);
    }
    throw error;
  }
};
