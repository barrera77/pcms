import { IBaseEntity } from "lib/pcms-core";

export interface IProvince<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  code: string;
}
