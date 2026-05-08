import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';

import { UserRole } from '@pcms/pcms-common';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
