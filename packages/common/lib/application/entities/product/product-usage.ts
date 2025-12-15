export interface IProductUsage<T = string> {
  _id: T;
  concentrationPercent?: number;
  quantity?: number;
}
