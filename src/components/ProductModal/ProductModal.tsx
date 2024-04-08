import { useCart } from "@/contexts/CartContext";
import { useCheckoutContext } from "@/contexts/CheckoutContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useFetch } from "@/hooks/useFetch";
import { IProduct } from "@/interfaces/products.interface";
import { getPrice } from "@/utils/string.utils";
import { useTranslation } from "next-i18next";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { CartIcon } from "../CustomIcons";
import Modal from "../Modal/Modal";
import { ProductFormControls } from "../ProductFormControls/ProductFormControlls";
import { ModalSpinner } from "../Spinner";
import styles from './ProductModal.module.scss';

const ProductModal: FC = memo(() => {
  const {
    activeProductView: productId,
    setActiveProductView,
    setError
  } = useGlobalContext();
  const { onCreateCheckout, checkoutCurrentProduct } = useCheckoutContext();
  const {
    makeRequest,
    data: product,
    loading,
    setLoading,
  } = useFetch<IProduct>(true);
  const { changeFavoriteItem } = useFavoritesContext();
  const { addCartItem, cart, changeCartItem, changeItemByProductId } = useCart();
  const { t } = useTranslation();

  const currentCartItem = useMemo(() => {
    return cart.find(({ product: { id } }) => id === productId);
  }, [productId, cart]);

  const [quantity, setQuantity] = useState(currentCartItem?.quantity || 1);

  useEffect(() => {
    if (productId) {
      makeRequest({
        url: `products/${productId}/`,
        dataAt: ['data']
      }).catch((r) => {
        setError(t('somethingWrong'));
        setActiveProductView(null);
      });
    } else {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    setQuantity(currentCartItem?.quantity || 1);
  }, [productId, currentCartItem?.quantity]);

  useEffect(() => {
    if (product) {
      changeItemByProductId(product.id, 'product', product);
      changeFavoriteItem(product.id, product);
    }
  }, [product, changeFavoriteItem]);

  const onAddToCart = useCallback(() => {
    if (!product) return;

    if (!currentCartItem) {
      addCartItem(product, quantity);
    } else {
      changeCartItem(currentCartItem.id, 'quantity', quantity);
    }
  }, [currentCartItem, product, addCartItem, quantity]);

  const onCloseModal = useCallback(() => {
    if (checkoutCurrentProduct) return;
    setActiveProductView(null);
  }, [checkoutCurrentProduct]);

  const onBuyProduct = useCallback(async () => {
    if (!product) return;
    onAddToCart();
    onCreateCheckout(undefined, {
      product,
      quantity,
      onSuccess: () => setActiveProductView(null)
    });
  }, [onAddToCart, quantity, product, onCreateCheckout]);

  if (loading) return <ModalSpinner />;

  if (!product || !productId) return null;

  return (
    <Modal
      open={Boolean(product && productId)}
      contentClassName={styles.content}
      onClose={onCloseModal}
    >
      <figure className="sixteen-nine">
        <img src={product.image} alt={product.name} />
      </figure>
      <h4 className="title-lg">{product.name}</h4>
      {product.description && (
        <p className="text">{product.description}</p>
      )}
      <div className={styles.priceGroup}>
        <span className="price-lg">
          {getPrice(product.price)}
        </span>
        {Boolean(product.stock) && (
          <ProductFormControls
            plainForm={{
              product,
              onQtyChange: setQuantity,
              quantity,
            }}
            productId={productId}
          />
        )}
      </div>
      <div className={styles.ctaGroup}>
        <button
          className="btn btn--primary btn--full"
          disabled={!product.stock}
          onClick={onBuyProduct}
        >
          {product.stock ? t('buy') : t('outOfStock')}
        </button>
        <button
          onClick={onAddToCart}
          disabled={!product.stock}
          className="btn btn--secondary"
        >
          <CartIcon />
        </button>
      </div>
    </Modal>
  );
});

ProductModal.displayName = 'ProductModal';

export default ProductModal;