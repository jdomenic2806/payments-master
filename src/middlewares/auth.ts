import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '@/models/User';
import RoleModel from '../models/Role';
import { validateApiKey as validateKey } from '../services/AuthService';
import config from '../config/auth';
import { logger } from '../utils/logger';

export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.error('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await UserModel.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'roleId'],
      include: [
        {
          model: RoleModel,
          attributes: ['permissions'],
        },
      ],
    });
    if (!user) {
      logger.error('User not found');
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = {
      id: user.get('id'),
      roleId: user.get('roleId'),
      permissions: (user.get('Role') as any).permissions,
    };
    next();
  } catch (error) {
    logger.error('Invalid token', { token });
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    logger.error('API key is required');
    return res.status(401).json({ error: 'API key is required' });
  }

  try {
    const validApiKey = await validateKey(apiKey as string);
    if (!validApiKey.User) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    req.user = {
      id: validApiKey.User.id,
      roleId: validApiKey.User.roleId,
      permissions: validApiKey.User.Role.permissions,
    };
    return next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid API key' });
  }
};

export const checkPermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.permissions) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
