import { IBaseEntity } from "../base-entity";

export interface IProvince<T = string> extends IBaseEntity {
  _id?: T;
  name: string;
  code: string;
}
