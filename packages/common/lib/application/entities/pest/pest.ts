import type { PestCategory } from "lib/pcms-core";
import { IBaseEntity } from "lib/pcms-core";

export interface IPest<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  category: PestCategory;
  description: string;
}
