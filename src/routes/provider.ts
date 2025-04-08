import { Router } from 'express';
import {
  handleCreateProvider,
  handleUpdateProvider,
  handleDeleteProvider,
  handleGetProviders,
  handleGetProvider,
} from '../controllers/ProviderController';
import { handleGetDefaultProvider, handleUpdateDefaultProvider } from '../controllers/ProviderConfigController';
import { validateApiKey, checkPermission } from '../middlewares/auth';

const router = Router();

// Provider management routes
router.post('/', handleCreateProvider);
router.put('/:id', handleUpdateProvider);
router.delete('/:id', handleDeleteProvider);
router.get('/', handleGetProviders);
router.get('/:id', handleGetProvider);

// Default provider configuration routes
router.get('/config/default', validateApiKey, handleGetDefaultProvider);
router.put('/config/default', validateApiKey, checkPermission('manage_providers'), handleUpdateDefaultProvider);

export default router;
