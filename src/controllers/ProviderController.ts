import { Request, Response } from 'express';
import {
  createProvider,
  updateProvider,
  deleteProvider,
  getProviders,
  getProviderById,
} from '../services/ProviderService';
import { CreateProviderDTO, UpdateProviderDTO } from '../dtos/provider.dto';

export const handleCreateProvider = async (req: Request, res: Response) => {
  try {
    const validation = CreateProviderDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const provider = await createProvider(validation.data);
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create provider' });
  }
};

export const handleUpdateProvider = async (req: Request, res: Response) => {
  try {
    const validation = UpdateProviderDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const provider = await updateProvider(req.params.id, validation.data);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update provider' });
  }
};

export const handleDeleteProvider = async (req: Request, res: Response) => {
  try {
    const success = await deleteProvider(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete provider' });
  }
};

export const handleGetProviders = async (_req: Request, res: Response) => {
  try {
    const providers = await getProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
};

export const handleGetProvider = async (req: Request, res: Response) => {
  try {
    const provider = await getProviderById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
};
