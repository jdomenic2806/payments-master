import { v4 as uuidv4 } from 'uuid';
import { CreateProviderInput, UpdateProviderInput } from '../dtos/provider.dto';
import PaymentProviderModel from '../models/PaymentProvider';
import UserProviderModel from '../models/UserProvider';

export const createProvider = async (data: CreateProviderInput) => {
  const provider = await PaymentProviderModel.create({
    ...data,
    id: uuidv4(),
    isActive: true,
  });
  return provider.toJSON();
};

export const updateProvider = async (id: string, data: UpdateProviderInput) => {
  const provider = await PaymentProviderModel.findByPk(id);
  if (!provider) return null;

  await provider.update(data);
  return provider.toJSON();
};

export const deleteProvider = async (id: string) => {
  const deleted = await PaymentProviderModel.destroy({ where: { id } });
  return deleted > 0;
};

export const getProviders = async () => {
  const providers = await PaymentProviderModel.findAll();
  return providers.map((provider) => provider.toJSON());
};

export const getProviderById = async (id: string) => {
  const provider = await PaymentProviderModel.findByPk(id);
  return provider ? provider.toJSON() : null;
};

export const getUserProviders = async (userId: string) => {
  const providers = await UserProviderModel.findAll({
    where: { userId, isActive: true },
    order: [['priority', 'ASC']],
    include: [PaymentProviderModel],
  });
  return providers.map((provider) => provider.toJSON());
};
