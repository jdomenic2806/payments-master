import express, { Router } from 'express';
import {
  handleProcessPayment,
  handleStripeWebhookEvent,
  handleConektaWebhookEvent,
  handleCheckPayment,
  handleCreatePaymentIntent,
} from '../controllers/PaymentController';
import { validateApiKey, checkPermission } from '../middlewares/auth';

const router = Router();

// Webhooks don't need API key validation
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhookEvent);

router.post('/webhook/conekta', express.raw({ type: 'application/json' }), handleConektaWebhookEvent);

// Protected routes
router.post('/process', validateApiKey, checkPermission('process_payment'), handleProcessPayment);

router.post('/check', validateApiKey, handleCheckPayment);

router.post('/create-intent', validateApiKey, checkPermission('process_payment'), handleCreatePaymentIntent);

export default router;
