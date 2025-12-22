import { IBaseEntity } from "lib/pcms-core";

export interface ICity<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  provinceId: T;
}
