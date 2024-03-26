import { ICartItem } from '@/interfaces/cart.interface';

export const getSavedCartItems = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('cartItems') || '[]') as ICartItem[];
};

export const saveCartItems = (items: ICartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

export const getCartTotals = (cart: ICartItem[]) => {
  return cart.reduce<[number, number, number]>(
    (acc, item) => {
      return [
        acc[0] + +item.product.price * item.quantity,
        acc[1] + +item.product.weight * item.quantity,
        acc[2] + item.quantity,
      ];
    },
    [0, 0, 0]
  );
};
