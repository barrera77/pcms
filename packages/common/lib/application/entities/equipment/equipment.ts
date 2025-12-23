import { IBaseEntity } from "lib/pcms-core";

export interface IEquipment<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  description: string;
  sku: string;
  serialNumber?: string | undefined;
}
