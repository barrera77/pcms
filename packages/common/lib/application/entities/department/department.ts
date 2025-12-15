import { IBaseEntity } from "lib/pcms-core";

export interface IDepartment<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  description?: string;
}
