import { z } from 'zod';

export const CreatePermissionDTO = z.object({
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().min(1, 'Permission description is required'),
});

export const UpdatePermissionDTO = CreatePermissionDTO.partial();

export const AssignPermissionDTO = z.object({
  roleId: z.string().uuid('Invalid role ID format'),
  permissions: z.array(z.string().min(1, 'Permission name is required')),
});

export type CreatePermissionInput = z.infer<typeof CreatePermissionDTO>;
export type UpdatePermissionInput = z.infer<typeof UpdatePermissionDTO>;
export type AssignPermissionInput = z.infer<typeof AssignPermissionDTO>;
