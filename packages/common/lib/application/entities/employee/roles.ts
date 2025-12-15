export const EmployeeRoles = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  TECHNICIAN: "TECHNICIAN",
} as const;

export type EmployeeRole = (typeof EmployeeRoles)[keyof typeof EmployeeRoles];
