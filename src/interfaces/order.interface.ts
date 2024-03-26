export interface IOrder {
  id: number;
  created_at: string;
  updated_at: string;
  status: string;
  total: string;
  payment_status: string;
  delivery_confirmation_image: string | null;
  prisoner: number;
  ordered_by: number;
  transaction: null | string;
}

export interface IOrderLineItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    weight: string;
    image: string;
    category: number;
  };
  quantity: number;
  price_at_time_of_order: string;
  order: number;
}
