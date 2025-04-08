import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IRole } from '../interfaces';
import UserModel from '../models/User';
import RoleModel from '../models/Role';
import ApiKeyModel from '../models/ApiKey';
import config from '../config/auth';

export const validateApiKey = async (key: string) => {
  const apiKey = await ApiKeyModel.findOne({
    where: { key, isActive: true },
    include: [
      {
        model: UserModel,
        attributes: ['id', 'email', 'roleId'],
        include: [
          {
            model: RoleModel,
            attributes: ['permissions'],
          },
        ],
      },
    ],
  });

  if (!apiKey) {
    throw new Error('Invalid or inactive API key');
  }

  await apiKey.update({ lastUsed: new Date() });
  return apiKey;
};

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({
    where: { email },
    include: [
      {
        model: RoleModel,
        attributes: ['name', 'permissions'],
      },
    ],
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: '24h',
  });

  // Prepare user data without sensitive information
  const userData = {
    id: user.get('id'),
    email: user.get('email'),
    roleId: user.get('roleId'),
    role: user.get('Role'),
    permissions: (user.get('Role') as IRole).permissions,
  };

  return { user: userData, token };
};

export const getUserPermissions = async (userId: string) => {
  const user = await UserModel.findOne({
    where: { id: userId },
    include: [
      {
        model: RoleModel,
        attributes: ['name', 'permissions'],
      },
    ],
    attributes: ['id', 'email'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.get('Role'),
      permissions: (user.get('Role') as IRole).permissions,
    },
  };
};
