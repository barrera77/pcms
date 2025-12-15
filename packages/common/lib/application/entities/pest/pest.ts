import { PestCategory } from "lib/application/entities/pest/pest-categories";
import { IBaseEntity } from "lib/pcms-core";

export interface IPest<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  category: PestCategory;
  description: string;
}
