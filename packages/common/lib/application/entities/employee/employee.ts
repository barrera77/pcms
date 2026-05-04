import { EmployeeRole } from "lib/application/entities/employee/roles";
import { IBaseEntity } from "lib/pcms-core";

export interface IEmployee<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  departmentId: T;
  phone: string;
  email: string;
  role: EmployeeRole;
  licenseNumber?: string;
  userId?: T;
}
