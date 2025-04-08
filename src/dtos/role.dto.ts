import { z } from 'zod';

export const CreateRoleDTO = z.object({
  name: z.string().min(1, 'Role name is required'),
  permissions: z.array(z.string().min(1, 'Permission name is required')),
});

export const UpdateRoleDTO = CreateRoleDTO.partial();

export type CreateRoleInput = z.infer<typeof CreateRoleDTO>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleDTO>;
