import { UserRole } from "lib/application/entities/user/user-roles";
import { IBaseEntity } from "lib/pcms-core";

export interface IUser<T = string> extends IBaseEntity {
  _id: T;
  userName: string;
  hashedPassword: string;
  role: UserRole;
}
