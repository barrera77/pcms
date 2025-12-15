import { IBaseEntity } from '../base-entity';

export interface ICity<T = string> extends IBaseEntity {
  _id?: T;
  name: string;
  provinceId: T;
}
