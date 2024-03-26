import { useCart } from '@/contexts/CartContext';
import { useCheckoutContext } from '@/contexts/CheckoutContext';
import { getPrice } from '@/utils/string.utils';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useTranslation } from "next-i18next";
import { FC, memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CgClose } from "react-icons/cg";
import OutsideClickHandler from 'react-outside-click-handler';
import { BubbleText } from '../BubbleText/BubbleText';
import { CartItem } from '../CartItem/CartItem';
import { TrashIcon, WarningIcon } from '../CustomIcons';
import { EmptyContent } from '../EmptyContent/EmptyContent';
import styles from './CartDrawer.module.scss';

const CartDrawer: FC = memo(() => {
  const {
    cart,
    setShowCart,
    showCart,
    MAX_WEIGHT,
    clearCart,
    totalPrice,
    totalWeight,
  } = useCart();
  const headRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(window.innerHeight);
  const { t } = useTranslation();
  const [drawerHeight, setDrawerHeight] = useState(window.innerHeight);
  const { onCreateCheckout } = useCheckoutContext();
  const [showTooltip, setShowTooltip] = useState(false);

  const getContentHeight = useCallback(() => {
    if (headRef.current) {
      const headHeight = headRef.current.getBoundingClientRect().height;
      const footerHeight = footerRef.current?.getBoundingClientRect()?.height || 0;
      setContentHeight(window.innerHeight - (headHeight + footerHeight));
      setDrawerHeight(window.innerHeight);
    }
  }, []);

  useLayoutEffect(() => {
    getContentHeight();
    const debouncedFunc = debounce(getContentHeight, 500);
    window.addEventListener('resize', debouncedFunc);
    return () => {
      window.removeEventListener('resize', debouncedFunc);
    };
  }, [getContentHeight, cart.length]);

  const cartItemEls = useMemo(() => {
    return cart.map(item => <CartItem isModal item={item} key={item.id} />);
  }, [cart]);

  const hasItems = cart.length > 0;

  const closeDrawer = useCallback(() => setShowCart(false), []);

  return (
    <div
      role="dialog"
      style={{ height: drawerHeight ? `${drawerHeight}px` : undefined }}
      className={classNames(
        styles.cart,
        { [styles.active]: showCart }
      )}
    >
      <OutsideClickHandler onOutsideClick={closeDrawer}>
        <div className={styles.content}>
          <div className={styles.head} ref={headRef}>
            <h3 className="title-lg">{t('cart')}</h3>
            <div className="horizontal-group">
              {hasItems && (
                <button title="Tozalash" onClick={clearCart}>
                  <TrashIcon />
                </button>
              )}
              <button
                onClick={closeDrawer}
                className={classNames(
                  styles.closeBtn,
                  "btn btn--secondary"
                )}
                title={t('close')}
              >
                <CgClose />
              </button>
            </div>
          </div>
          <div
            style={{ minHeight: `${contentHeight}px` }}
            className={styles.body}
          >
            {hasItems
              ? <ul>{cartItemEls}</ul>
              : <EmptyContent message={t('savedShown')} />
            }
          </div>
          {hasItems && (
            <div className={styles.footer} ref={footerRef}>
              <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={styles.limitContainer}
              >
                <BubbleText show={showTooltip} contentText={t('limitText')}>
                  <WarningIcon />
                </BubbleText>
                <span className='text-pale'>{t('limit')}</span>
                <span className='text-bold'>{totalWeight.toFixed(2)}/{MAX_WEIGHT}kg</span>
                <div className='progress'>
                  <span style={{ width: `${+totalWeight / MAX_WEIGHT * 100}%` }} />
                </div>
              </div>
              <div className={styles.totalsContainer}>
                <div className={styles.text}>
                  <span className='text-pale'>
                    {t('totalPrice')}
                  </span>
                  <span className='heading--tertiary'>
                    {getPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={() => onCreateCheckout()}
                  type='button'
                  className='btn btn--primary btn--lg'
                  title={t('pay')}
                >
                  {t('pay')}
                </button>
              </div>
            </div>
          )}
        </div>
      </OutsideClickHandler>
    </div>
  );
});

CartDrawer.displayName = 'CartDrawer';

export default CartDrawer;