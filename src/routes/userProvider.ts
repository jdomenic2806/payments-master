import { Router } from 'express';
import {
  handleUpdatePriority,
  handleGetUserProviders,
  handleAssignProvider,
  handleRemoveProvider,
} from '../controllers/UserProviderController';
import { validateApiKey, checkPermission } from '../middlewares/auth';

const router = Router();

router.get('/:userId/providers', validateApiKey, handleGetUserProviders);
router.post('/:userId/providers', validateApiKey, checkPermission('manage_providers'), handleAssignProvider);
router.put(
  '/:userId/providers/:providerId/priority',
  validateApiKey,
  checkPermission('manage_providers'),
  handleUpdatePriority,
);
router.delete(
  '/:userId/providers/:providerId',
  validateApiKey,
  checkPermission('manage_providers'),
  handleRemoveProvider,
);

export default router;
