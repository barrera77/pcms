export interface IInventory<T = string> {
  _id: T;
  itemId: T;
  itemType: "product" | "equipment";
  minimumThreshold: number;
  quantity: number;
  unit?: string;
}
