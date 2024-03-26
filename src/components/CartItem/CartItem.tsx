import { useCart } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { ICartItem } from "@/interfaces/cart.interface";
import { getPrice } from "@/utils/string.utils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, MouseEvent, memo, useCallback, useMemo, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { BookmarkPlus, CartMinus, ThreeDots } from "../CustomIcons";
import { ProductFormControls } from "../ProductFormControls/ProductFormControlls";
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: ICartItem;
  isModal?: boolean;
}

export const CartItem: FC<CartItemProps> = memo(({ item, isModal }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const { deleteCartItem, setShowCart } = useCart();
  const { setActiveProductView } = useGlobalContext();
  const { t } = useTranslation();

  const isFavoriteProduct = useMemo(
    () => isFavorite(item.product),
    [isFavorite, item.product]
  );

  const onClickLink = useCallback((e: MouseEvent) => {
    if (isModal) {
      e.preventDefault();
      setActiveProductView(item.product.id);
      setShowCart(false);
    }
  }, [isModal, item.product.id]);

  const onToggleFavorite = useCallback(() => {
    setShowOptions(false);
    toggleFavorite(item.product);
  }, [toggleFavorite, item.product]);

  const onDeleteItem = useCallback(() => {
    setShowOptions(false);
    deleteCartItem(item.id);
  }, [deleteCartItem, item.id]);

  return (
    <li className={styles.item}>
      <div className={styles.itemContent}>
        <Link
          href={`/products/${item.product.id}`}
          title={item.product.name}
          onClick={onClickLink}
        >
          <figure className='sixteen-nine'>
            <img src={item.product.image} alt={item.product.name} />
          </figure>
        </Link>
        <div className={styles.textContent}>
          <Link
            onClick={onClickLink}
            href={`/products/${item.product.id}`}
            title={item.product.name}
            className={styles.labelGroup}
          >
            <span className="title">{item.product.name}</span>
            <span className="price">{getPrice(item.product.price)}</span>
          </Link>
          <ProductFormControls productId={item.product.id} size="sm" />
        </div>
      </div>
      <OutsideClickHandler onOutsideClick={() => setShowOptions(false)}>
        <div className={styles.optionsWrapper}>
          <button onClick={() => setShowOptions(true)} title="Mahsulot">
            <ThreeDots />
          </button>
          {showOptions && (
            <ul className="fadeIn">
              <li tabIndex={0} onClick={onToggleFavorite}>
                <BookmarkPlus />
                {isFavoriteProduct ? t('removeFavorite') : t('save')}
              </li>
              <li tabIndex={0} onClick={onDeleteItem}>
                <CartMinus />
                {t('removeItem')}
              </li>
            </ul>
          )}
        </div>
      </OutsideClickHandler>
    </li>
  );
});

CartItem.displayName = 'CartItem';