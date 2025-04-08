import { v4 as uuidv4 } from 'uuid';
import { IPermission } from '../interfaces';
import PermissionModel from '../models/Permission';
import RoleModel from '../models/Role';

export const createPermission = async (data: Omit<IPermission, 'id' | 'createdAt' | 'updatedAt'>) => {
  const permission = await PermissionModel.create({ id: uuidv4(), ...data });
  return permission.toJSON();
};

export const updatePermission = async (
  id: string,
  data: Partial<Omit<IPermission, 'id' | 'createdAt' | 'updatedAt'>>,
) => {
  const permission = await PermissionModel.findByPk(id);
  if (!permission) return null;

  await permission.update(data);
  return permission.toJSON();
};

export const deletePermission = async (id: string) => {
  const deleted = await PermissionModel.destroy({ where: { id } });
  return deleted > 0;
};

export const getPermissions = async () => {
  const permissions = await PermissionModel.findAll();
  return permissions.map((permission) => permission.toJSON());
};

export const assignPermissionToRole = async (roleId: string, permissions: string[]) => {
  const role = await RoleModel.findByPk(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  const currentPermissions = new Set(role.permissions);
  permissions.forEach((p) => currentPermissions.add(p));

  await role.update({ permissions: Array.from(currentPermissions) });
  return role.toJSON();
};

export const removePermissionFromRole = async (roleId: string, permissions: string[]) => {
  const role = await RoleModel.findByPk(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  const currentPermissions = new Set(role.permissions);
  permissions.forEach((p) => currentPermissions.delete(p));

  await role.update({ permissions: Array.from(currentPermissions) });
  return role.toJSON();
};
