import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createRole, updateRole, deleteRole, getRoles, getRoleById } from '../services/RoleService';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';
import { logger } from '../utils/logger';

export const handleCreateRole = async (req: Request, res: Response) => {
  try {
    const validation = CreateRoleDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const roleData = { ...validation.data, id: uuidv4() };
    const role = await createRole(roleData);
    res.status(201).json(role);
  } catch (error) {
    logger.error('Failed to create role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

export const handleUpdateRole = async (req: Request, res: Response) => {
  try {
    const validation = UpdateRoleDTO.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Validation error', details: validation.error.format() });
    }

    const role = await updateRole(req.params.id, validation.data);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    logger.error('Failed to update role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const handleDeleteRole = async (req: Request, res: Response) => {
  try {
    const success = await deleteRole(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};

export const handleGetRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    logger.error('Failed to fetch roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

export const handleGetRole = async (req: Request, res: Response) => {
  try {
    const role = await getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    logger.error('Failed to fetch role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};
