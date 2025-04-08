import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../models/User';
import ApiKeyModel from '../models/ApiKey';
import { CreateUserInput, UpdateUserInput } from '../dtos/user.dto';
import { logger } from '../utils/logger';

const generateApiKey = async (userId: string) => {
  const key = `pk_${uuidv4().replace(/-/g, '')}`;
  const apiKey = await ApiKeyModel.create({
    id: uuidv4(),
    userId,
    key,
    isActive: true,
  });

  return apiKey;
};

export const createUser = async (data: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await UserModel.create({
    ...data,
    id: uuidv4(),
    password: hashedPassword,
  });
  const apiKey = await generateApiKey(user.get('id'));
  logger.info('User created successfully', { userId: user.get('id') });

  return {
    user: user.toJSON(),
    apiKey: apiKey.toJSON(),
  };
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  const user = await UserModel.findByPk(id);
  if (!user) return null;

  let updatedData = data;
  if (data.password) {
    updatedData = { ...data, password: await bcrypt.hash(data.password, 10) };
  }

  await user.update(updatedData);
  return user.toJSON();
};

export const deleteUser = async (id: string) => {
  const deleted = await UserModel.destroy({ where: { id } });
  return deleted > 0;
};

export const getUsers = async () => {
  const users = await UserModel.findAll({
    attributes: { exclude: ['password'] },
  });
  return users.map((user) => user.toJSON());
};

export const getUserById = async (id: string) => {
  const user = await UserModel.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  return user ? user.toJSON() : null;
};
