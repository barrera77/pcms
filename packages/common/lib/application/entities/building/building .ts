import { IBaseEntity } from "lib/pcms-core";

export interface IBuilding<T = string> extends IBaseEntity {
  _id: T;
  areaId: T;
  numofUnits: number;
  units: string[];
}
