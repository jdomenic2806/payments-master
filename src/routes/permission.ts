import { Router } from 'express';
import {
  handleCreatePermission,
  handleUpdatePermission,
  handleDeletePermission,
  handleGetPermissions,
  handleAssignPermissions,
  handleRemovePermissions,
} from '../controllers/PermissionController';
import { validateJWT, checkPermission } from '../middlewares/auth';

const router = Router();

// All routes require JWT authentication and admin permissions
router.use(validateJWT);
router.use(checkPermission('manage_permissions'));

router.post('/', handleCreatePermission);
router.put('/:id', handleUpdatePermission);
router.delete('/:id', handleDeletePermission);
router.get('/', handleGetPermissions);
router.post('/assign', handleAssignPermissions);
router.post('/remove', handleRemovePermissions);

export default router;
