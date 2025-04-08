import { Request, Response } from 'express';
import { login, getUserPermissions } from '../services/AuthService';
import { LoginDTO } from '../dtos/auth.dto';
import { logger } from '../utils/logger';

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const validation = LoginDTO.safeParse(req.body);
    if (!validation.success) {
      logger.error('Validation error:', validation.error.format());
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const { email, password } = validation.data;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      logger.error('Login failed:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
};

export const handleGetUserPermissions = async (req: Request, res: Response) => {
  try {
    const result = await getUserPermissions(req.user!.id);
    res.json(result);
  } catch (error) {
    logger.error('Failed to fetch user permissions:', error);
    res.status(500).json({ error: 'Failed to fetch user permissions' });
  }
};
