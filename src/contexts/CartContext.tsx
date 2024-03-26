import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import { ICartItem } from "@/interfaces/cart.interface";
import { IProduct } from "@/interfaces/products.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { getCartTotals, getSavedCartItems, saveCartItems } from "@/utils/cart.utils";
import { generateRandomString } from "@/utils/string.utils";
import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";
import { useGlobalContext } from "./GlobalContext";

type ChangeCartItemFn = (
  itemId: string,
  key: keyof ICartItem,
  value: ((prev: ICartItem[keyof ICartItem]) => ICartItem[keyof ICartItem]) |
    ICartItem[keyof ICartItem]
) => void

interface ICart {
  cart: ICartItem[];
  setCart: StateSetter<ICartItem[]>;
  setShowCart: StateSetter<boolean>;
  showCart: boolean;
  changeCartItem: ChangeCartItemFn;
  addCartItem: (product: IProduct, quantity: number) => void;
  deleteCartItem: (id: string) => void;
  MAX_WEIGHT: number;
  totalPrice: number;
  isAddedToCart: (product: IProduct | number) => boolean;
  totalWeight: number;
  clearCart: () => void;
  totalCount: number;
  changeItemByProductId: (
    productId: number,
    key: keyof ICartItem,
    val: ICartItem[keyof ICartItem]
  ) => void;
}

const MAX_WEIGHT = 12;

interface CartProviderProps {
  children: ReactNode;
}

const Cart = createContext({} as ICart);

export const useCart = () => useContext(Cart);

export const CartProvider: FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>(getSavedCartItems());
  const [showCart, setShowCart] = useState(false);
  const { media } = useGlobalContext();

  useHideScrollbar(showCart && !media.tablet);

  const [totalPrice, totalWeight, totalCount] = useMemo(() => {
    return getCartTotals(cart);
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCartItems([]);
  }, []);

  const isAddedToCart = useCallback((product: IProduct | number) => {
    return cart.some(({ product: { id } }) => (
      (typeof product === 'object' ? product.id : product) === id
    ));
  }, [cart]);

  const addCartItem = useCallback((product: IProduct, quantity: number) => {
    if (totalWeight >= MAX_WEIGHT) return;
    setCart(prev => {
      const productExists = prev.find(({ product: { id } }) => product.id === id);
      let updatedCartItems = prev;
      if (productExists) {
        updatedCartItems = prev.map((item) => {
          if (item.product.id === product.id) {
            return {
              ...item,
              quantity: quantity + item.quantity
            };
          }
          return item;
        });
      } else {
        updatedCartItems = [...prev, {
          id: generateRandomString(9),
          quantity,
          product
        }];
      }
      saveCartItems(updatedCartItems);
      return updatedCartItems;
    });
  }, [totalWeight]);

  const deleteCartItem = useCallback((cartItemId: string) => {
    setCart((prev) => {
      const updatedCartItems = prev.filter(({ id }) => id !== cartItemId);
      saveCartItems(updatedCartItems);
      return updatedCartItems;
    });
  }, []);

  const changeCartItem: ChangeCartItemFn = useCallback(
    (itemId, key, value) => {
      setCart(prev => {
        let updatedCartItems = prev.map(item => {
          let newItem = item;
          if (itemId === newItem.id) {
            newItem = {
              ...item,
              [key]: typeof value === 'function' ? value(item[key]) : value
            };
          }
          return newItem;
        });
        if (getCartTotals(updatedCartItems)[1] > MAX_WEIGHT) {
          updatedCartItems = prev;
        }
        saveCartItems(updatedCartItems);
        return updatedCartItems;
      });
    },
    []
  );

  const changeItemByProductId = (
    productId: number,
    key: keyof ICartItem,
    val: ICartItem[keyof ICartItem]
  ) => {
    const item = cart.find(({ product }) => product.id === productId);
    if (!item) return;
    changeCartItem(item.id, key, val);
  };

  const state: ICart = {
    cart,
    setCart,
    showCart,
    setShowCart,
    addCartItem,
    deleteCartItem,
    totalCount,
    changeCartItem,
    totalPrice,
    totalWeight,
    clearCart,
    MAX_WEIGHT,
    changeItemByProductId,
    isAddedToCart,
  };

  return (
    <Cart.Provider value={state}>
      {children}
    </Cart.Provider>
  );
};