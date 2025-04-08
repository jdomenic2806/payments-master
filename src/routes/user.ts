import { Router } from 'express';
import {
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  handleGetUsers,
  handleGetUser,
} from '../controllers/UserController';

const router = Router();

router.post('/', handleCreateUser);
router.put('/:id', handleUpdateUser);
router.delete('/:id', handleDeleteUser);
router.get('/', handleGetUsers);
router.get('/:id', handleGetUser);

export default router;
