import { v4 as uuidv4 } from 'uuid';
import ProviderConfig from '../models/ProviderConfig';
import { logger } from '../utils/logger';

export const getDefaultProvider = async () => {
  try {
    const config = await ProviderConfig.findOne({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });

    if (!config) {
      // Create default config if none exists
      return await ProviderConfig.create({
        id: uuidv4(),
        defaultProvider: 'stripe',
        isActive: true,
      });
    }

    return config.toJSON();
  } catch (error) {
    logger.error('Error fetching default provider:', error);
    throw error;
  }
};

export const updateDefaultProvider = async (defaultProvider: 'stripe' | 'conekta') => {
  try {
    // Deactivate all existing configs
    await ProviderConfig.update({ isActive: false }, { where: { isActive: true } });

    // Create new active config
    const config = await ProviderConfig.create({
      id: uuidv4(),
      defaultProvider,
      isActive: true,
    });

    logger.info('Default provider updated:', { defaultProvider });
    return config.toJSON();
  } catch (error) {
    logger.error('Error updating default provider:', error);
    throw error;
  }
};
