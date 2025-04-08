import { Request, Response } from 'express';
import {
  updateUserProviderPriority,
  getUserProviders,
  assignProviderToUser,
  removeProviderFromUser,
} from '../services/UserProviderService';
import { UpdateProviderPriorityDTO, AssignProviderDTO } from '../dtos/provider.dto';

export const handleUpdatePriority = async (req: Request, res: Response) => {
  try {
    const validation = UpdateProviderPriorityDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const { userId, providerId } = req.params;
    const { priority } = validation.data;

    const updated = await updateUserProviderPriority(userId, providerId, priority);
    if (!updated) {
      return res.status(404).json({ error: 'User provider association not found' });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update priority' });
  }
};

export const handleGetUserProviders = async (req: Request, res: Response) => {
  try {
    const providers = await getUserProviders(req.params.userId);
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user providers' });
  }
};

export const handleAssignProvider = async (req: Request, res: Response) => {
  try {
    const validation = AssignProviderDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const { userId } = req.params;
    const { providerId, priority } = validation.data;

    const assigned = await assignProviderToUser(userId, providerId, priority);
    res.status(201).json(assigned);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign provider' });
  }
};

export const handleRemoveProvider = async (req: Request, res: Response) => {
  try {
    const { userId, providerId } = req.params;
    const success = await removeProviderFromUser(userId, providerId);

    if (!success) {
      return res.status(404).json({ error: 'User provider association not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove provider' });
  }
};
