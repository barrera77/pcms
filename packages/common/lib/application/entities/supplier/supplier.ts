export interface ISupplier<T = string> {
  _id: T;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}
