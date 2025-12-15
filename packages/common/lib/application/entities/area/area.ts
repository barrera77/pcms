import { IBaseEntity } from "../base-entity";

export interface IArea<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  cityId: T;
  managerId?: T | null;
  techIds: T[];
}
