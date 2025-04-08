import UserProviderModel from '../models/UserProvider';
import PaymentProviderModel from '../models/PaymentProvider';

export const updateUserProviderPriority = async (userId: string, providerId: string, priority: number) => {
  const userProvider = await UserProviderModel.findOne({
    where: { userId, providerId },
  });

  if (!userProvider) return null;

  // If setting as primary (priority 1), remove any existing primary
  if (priority === 1) {
    await UserProviderModel.update({ priority: 2 }, { where: { userId, priority: 1 } });
  }

  await userProvider.update({ priority });
  return userProvider.toJSON();
};

export const getUserProviders = async (userId: string) => {
  const providers = await UserProviderModel.findAll({
    where: { userId },
    include: [PaymentProviderModel],
    order: [['priority', 'ASC']],
  });
  return providers.map((provider) => provider.toJSON());
};

export const assignProviderToUser = async (userId: string, providerId: string, priority: number) => {
  // If setting as primary, update existing primary
  if (priority === 1) {
    await UserProviderModel.update({ priority: 2 }, { where: { userId, priority: 1 } });
  }

  const [userProvider] = await UserProviderModel.findOrCreate({
    where: { userId, providerId },
    defaults: { userId, providerId, priority, isActive: true },
  });

  if (userProvider.priority !== priority) {
    await userProvider.update({ priority });
  }

  return userProvider.toJSON();
};

export const removeProviderFromUser = async (userId: string, providerId: string) => {
  const deleted = await UserProviderModel.destroy({
    where: { userId, providerId },
  });
  return deleted > 0;
};
