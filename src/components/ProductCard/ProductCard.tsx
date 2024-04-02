import { useCart } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { IProduct } from "@/interfaces/products.interface";
import { getPrice } from "@/utils/string.utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, MouseEvent, memo, useCallback, useEffect, useMemo, useState } from "react";
import { AddCartIcon, BookmarkIcon, BookmarkPlus } from "../CustomIcons";
import { ProductFormControls } from "../ProductFormControls/ProductFormControlls";
import SafeHydrate from "../SafeHydrate";
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: IProduct;
  isModal?: boolean;
}

export const ProductCard: FC<ProductCardProps> = memo(({ product, isModal }) => {
  const { setActiveProductView } = useGlobalContext();
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const { cart, addCartItem, isAddedToCart } = useCart();
  const { t } = useTranslation();

  const onGoToProduct = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if (isModal) {
      e.preventDefault();
      setActiveProductView(product.id);
    }
  }, [isModal, product.id]);

  const addedToCart = useMemo(
    () => isAddedToCart(product),
    [product, isAddedToCart]
  );
  const [addingToCart, setAddingToCart] = useState(addedToCart);

  useEffect(() => {
    if (addedToCart) {
      setAddingToCart(true);
    }
  }, [addedToCart]);

  const isFavoriteProduct = useMemo(
    () => isFavorite(product),
    [isFavorite, product]
  );

  const onQtyEnd = useCallback(() => {
    setAddingToCart(false);
  }, []);

  const onAddToCart = useCallback(() => {
    const itemExists = cart.find(({ product: { id } }) => id === product.id);
    if (!itemExists) {
      addCartItem(product, 1);
    }
    setAddingToCart(true);
  }, [cart, addCartItem, product]);

  return (
    <div className={styles.product}>
      <SafeHydrate releaseContent>
        <button
          onClick={() => toggleFavorite(product)}
          title={t('save')}
          className={classNames(
            styles.bookmark,
            "rounded-bordered-btn",
            { ["rounded-bordered-btn--primary"]: isFavoriteProduct }
          )}
        >
          {isFavoriteProduct ? <BookmarkIcon /> : <BookmarkPlus />}
        </button>
      </SafeHydrate>
      <Link onClick={onGoToProduct} href={`/products/${product.id}`} title={product.name}>
        <figure className="sixteen-nine">
          <img src={product.image} alt={product.name} />
        </figure>
        <span className="title">{product.name}</span>
        <span className="price">{getPrice(product.price)}</span>
      </Link>
      <SafeHydrate>
        {addingToCart ? (
          <ProductFormControls onQtyEnd={onQtyEnd} productId={product.id} />
        ) : (
          <button
            onClick={onAddToCart}
            title={t('addToCart')}
            className="btn-add-to-cart"
            disabled={!product.stock}
          >
            {Boolean(product.stock) && <AddCartIcon />}
            {!product.stock ? t('outOfStock') : t('addToCart')}
          </button>
        )}
      </SafeHydrate>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
