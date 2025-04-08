import { Request, Response } from 'express';
import { createUser, updateUser, deleteUser, getUsers, getUserById } from '../services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { logger } from '../utils/logger';

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const validation = CreateUserDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const user = await createUser(validation.data);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const validation = UpdateUserDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const user = await updateUser(req.params.id, validation.data);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const success = await deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const handleGetUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    logger.info('Users fetched successfully', { count: users.length });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
