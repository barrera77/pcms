import { ProductCategory } from "lib/application/entities/product/category";
import { IBaseEntity } from "lib/pcms-core";

export interface IProduct<T = string> extends IBaseEntity {
  _id: T;
  name: string;
  category: ProductCategory;
  activeIngredient: string;
  labelUrl: string;
  msdsUrl: string;
  supplier: T;
}
