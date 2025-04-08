import { IRoleCreate } from '../interfaces';
import RoleModel from '../models/Role';
import { logger } from '../utils/logger';

export const createRole = async (data: IRoleCreate) => {
  try {
    const role = await RoleModel.create(data);
    logger.info('Role created successfully', { roleId: role.id });
    return role.toJSON();
  } catch (error) {
    logger.error('Failed to create role:', error);
    throw error;
  }
};

export const updateRole = async (id: string, data: Partial<IRoleCreate>) => {
  try {
    const role = await RoleModel.findByPk(id);
    if (!role) return null;

    await role.update(data);
    logger.info('Role updated successfully', { roleId: id });
    return role.toJSON();
  } catch (error) {
    logger.error('Failed to update role:', error);
    throw error;
  }
};

export const deleteRole = async (id: string) => {
  try {
    const deleted = await RoleModel.destroy({ where: { id } });
    if (deleted > 0) {
      logger.info('Role deleted successfully', { roleId: id });
    }
    return deleted > 0;
  } catch (error) {
    logger.error('Failed to delete role:', error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const roles = await RoleModel.findAll();
    return roles.map((role) => role.toJSON());
  } catch (error) {
    logger.error('Failed to fetch roles:', error);
    throw error;
  }
};

export const getRoleById = async (id: string) => {
  try {
    const role = await RoleModel.findByPk(id);
    return role ? role.toJSON() : null;
  } catch (error) {
    logger.error('Failed to fetch role:', error);
    throw error;
  }
};
