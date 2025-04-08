import { Request, Response } from 'express';
import { UpdateDefaultProviderDTO } from '../dtos/provider.dto';
import { logger } from '../utils/logger';
import { getDefaultProvider, updateDefaultProvider } from '../services/ProviderConfigService';

export const handleGetDefaultProvider = async (_req: Request, res: Response) => {
  try {
    const config = await getDefaultProvider();
    res.json(config);
  } catch (error) {
    logger.error('Failed to fetch default provider:', error);
    res.status(500).json({ error: 'Failed to fetch default provider' });
  }
};

export const handleUpdateDefaultProvider = async (req: Request, res: Response) => {
  try {
    const validation = UpdateDefaultProviderDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const config = await updateDefaultProvider(validation.data.defaultProvider);
    res.json(config);
  } catch (error) {
    logger.error('Failed to update default provider:', error);
    res.status(500).json({ error: 'Failed to update default provider' });
  }
};
