import { Request, Response } from 'express';
import {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissions,
  assignPermissionToRole,
  removePermissionFromRole,
} from '../services/PermissionService';
import { CreatePermissionDTO, UpdatePermissionDTO, AssignPermissionDTO } from '../dtos/permission.dto';

export const handleCreatePermission = async (req: Request, res: Response) => {
  try {
    const validation = CreatePermissionDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const permission = await createPermission(validation.data);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create permission' });
  }
};

export const handleUpdatePermission = async (req: Request, res: Response) => {
  try {
    const validation = UpdatePermissionDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const permission = await updatePermission(req.params.id, validation.data);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update permission' });
  }
};

export const handleDeletePermission = async (req: Request, res: Response) => {
  try {
    const success = await deletePermission(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete permission' });
  }
};

export const handleGetPermissions = async (_req: Request, res: Response) => {
  try {
    const permissions = await getPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
};

export const handleAssignPermissions = async (req: Request, res: Response) => {
  try {
    const validation = AssignPermissionDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const { roleId, permissions } = validation.data;
    const result = await assignPermissionToRole(roleId, permissions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign permissions' });
  }
};

export const handleRemovePermissions = async (req: Request, res: Response) => {
  try {
    const validation = AssignPermissionDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const { roleId, permissions } = validation.data;
    const result = await removePermissionFromRole(roleId, permissions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove permissions' });
  }
};
