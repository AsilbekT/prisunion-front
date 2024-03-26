import { IProduct } from './products.interface';

export interface ICartItem {
  id: string;
  product: IProduct;
  quantity: number;
}

export interface ILineItem {
  quantity: number;
  product_id: number;
}

export interface IOrderCreatePayload {
  prisoner_id: number;
  contact_id: number;
  products: ILineItem[];
}

export interface ICompletedTransaction {
  transactionId: string;
  status: string;
  phone: string;
  qrCodeUrl: string;
}

export interface ICreateTransaction {
  transactionId: string;
}

export interface IExistingOrder {
  id: number;
  totalPrice: number;
  onSuccess?: () => unknown;
}
