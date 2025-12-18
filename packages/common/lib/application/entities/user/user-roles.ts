export const UserRoles = {
  ADMIN: "ADMIN",
  TECHNICIAN: "TECHNICIAN",
  SUPERVISOR: "SUPERVISOR",
  VIEWER: "VIEWER",
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];
