export interface IProductUsage<T = string> {
  _id: T;
  productId: T;
  concentrationPercent?: number;
  quantity?: string;
}
