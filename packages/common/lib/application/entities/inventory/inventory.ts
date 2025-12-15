export interface IInventory<T = string> {
  _id: T;
  productId: T;
  equipmentId: T;
  minimumThreshold: number;
}
