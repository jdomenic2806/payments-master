import { Router } from 'express';
import { validateApiKey, validateJWT, checkPermission } from '../middlewares/auth';
import paymentRoutes from './payment';
import userRoutes from './user';
import providerRoutes from './provider';
import userProviderRoutes from './userProvider';
import authRoutes from './auth';
import permissionRoutes from './permission';
import roleRoutes from './role';
import transactionRoutes from './transactions';

const router = Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);

// API Key protected routes (for client applications)
router.use('/payments', paymentRoutes);
router.use('/transactions', transactionRoutes);

// JWT protected routes (for admin dashboard)
router.use('/users', validateJWT, checkPermission('manage_users'), userRoutes);
router.use('/providers', validateJWT, checkPermission('manage_providers'), providerRoutes);
router.use('/permissions', validateJWT, checkPermission('manage_permissions'), permissionRoutes);
router.use('/roles', validateJWT, checkPermission('manage_permissions'), roleRoutes);

// Mixed authentication routes (supports both API Key and JWT)
router.use(
  '/user-providers',
  (req, res, next) => {
    // Check if using JWT (admin dashboard)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      return validateJWT(req, res, () => {
        checkPermission('manage_providers')(req, res, next);
      });
    }
    // Otherwise, validate API key (client applications)
    return validateApiKey(req, res, next);
  },
  userProviderRoutes,
);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
