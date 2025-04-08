import { Router } from 'express';
import { handleLogin, handleGetUserPermissions } from '../controllers/AuthController';
import { validateJWT } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/login', handleLogin);

// Protected routes
router.get('/permissions', validateJWT, handleGetUserPermissions);

export default router;
