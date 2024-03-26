import { useCart } from '@/contexts/CartContext';
import { IProduct } from '@/interfaces/products.interface';
import classNames from 'classnames';
import { FC, useCallback, useEffect, useMemo } from "react";
import { MinusIcon, PlusIcon } from "../CustomIcons";
import styles from './ProductFormControls.module.scss';

interface ProductFormControlsProps {
  onAddToCart?: (quantity: number) => unknown;
  plainForm?: {
    product: IProduct;
    quantity: number;
    onQtyChange?: (quantity: number) => unknown;
  };
  onQtyEnd?: () => unknown;
  productId: number;
  size?: 'mid' | 'sm' | 'lg';
}

export const ProductFormControls: FC<ProductFormControlsProps> = ({
  size = 'mid',
  productId,
  onQtyEnd,
  plainForm
}) => {
  const { cart, changeCartItem, deleteCartItem, } = useCart();

  const cartItem = useMemo(() => {
    return cart.find(({ product: { id } }) => id === productId)!;
  }, [productId, cart, plainForm]);

  useEffect(() => {
    if (!cartItem?.quantity) {
      if (typeof onQtyEnd === 'function') {
        onQtyEnd();
      }
      if (cartItem) {
        deleteCartItem(cartItem.id)
      }
    }
  }, [cartItem?.quantity, cartItem?.quantity, onQtyEnd]);

  const onChangeQty = useCallback(
    (type: 'increment' | 'decrement') => {
      const isDecrement = type === 'decrement';

      const currentQty = plainForm?.quantity || cartItem?.quantity;
      let newQty = currentQty;

      if (isDecrement) {
        newQty--;
      } else if (isDecrement && currentQty <= 1) {
        newQty = currentQty;
      } else {
        newQty++;
      }

      if (plainForm && typeof plainForm.onQtyChange === 'function') {
        plainForm.onQtyChange(newQty);
      } else {
        changeCartItem(cartItem.id, 'quantity', newQty);
      }
    },
    [plainForm, changeCartItem, cartItem]
  );

  if (!cartItem && !plainForm) return null;

  return (
    <form className={classNames(styles.form, styles[size])}>
      <button
        onClick={() => onChangeQty('decrement')}
        type="button"
        className="btn btn--secondary"
      >
        <MinusIcon />
      </button>
      <input
        type="number"
        value={(plainForm?.quantity || cartItem?.quantity)?.toString() || ''}
        min={1}
        onBlur={() => !cartItem.quantity && deleteCartItem(cartItem.id)}
        onChange={(e) => changeCartItem(cartItem.id, 'quantity', +e.target.value)}
      />
      <button
        onClick={() => onChangeQty('increment')}
        type="button"
        className="btn btn--primary btn--box"
      >
        <PlusIcon />
      </button>
    </form>
  );
};