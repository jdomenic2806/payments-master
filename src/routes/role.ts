import { Router } from 'express';
import {
  handleCreateRole,
  handleUpdateRole,
  handleDeleteRole,
  handleGetRoles,
  handleGetRole,
} from '../controllers/RoleController';
import { validateJWT, checkPermission } from '../middlewares/auth';

const router = Router();

// All routes require JWT authentication and manage_permissions permission
router.use(validateJWT);
router.use(checkPermission('manage_permissions'));

router.post('/', handleCreateRole);
router.put('/:id', handleUpdateRole);
router.delete('/:id', handleDeleteRole);
router.get('/', handleGetRoles);
router.get('/:id', handleGetRole);

export default router;
