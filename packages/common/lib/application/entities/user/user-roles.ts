export const UserRoles = {
  ADMIN: "ADMIN",
  EXECUTIVE: "EXECUTIVE",
  TECHNICIAN: "TECHNICIAN",
  SUPERVISOR: "SUPERVISOR",
  MANAGER: "MANAGER",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
