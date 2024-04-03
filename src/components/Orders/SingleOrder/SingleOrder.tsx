import { CompleteIcon, DisabledStatusIcon, PaperIcon } from "@/components/CustomIcons";
import { EmptyContent } from "@/components/EmptyContent/EmptyContent";
import { SectionHead } from "@/components/SectionHead";
import { Spinner } from "@/components/Spinner";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { STATUS_LABELS } from "@/data/common.data";
import { useFetch } from "@/hooks/useFetch";
import { IOrder, IOrderLineItem } from "@/interfaces/order.interface";
import { getFormattedDate } from "@/utils/date.utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
import styles from './SingleOrder.module.scss';

import { Badge } from "@/components/Badge";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCheckoutContext } from "@/contexts/CheckoutContext";
import { getPrice } from "@/utils/string.utils";

// @ts-ignore
import domToPdf from 'dom-to-pdf';

const STATUS_KEYS = Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[];

export const SingleOrder: FC = memo(() => {
  const fetch = useFetch<IOrder>(true);
  const orderItemsFetch = useFetch<IOrderLineItem[]>(true);
  const router = useRouter();
  const { setActiveProductView, setError } = useGlobalContext();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { prisonerContactFetch } = useAuthContext();
  const { t, i18n } = useTranslation();
  const { onCreateCheckout, } = useCheckoutContext();

  const orderId = router.query.id;
  const orderData = fetch.data;
  const orderItems = orderItemsFetch.data;

  const onPrintOrder = useCallback(() => {
    try {
      if (!mainContentRef.current ||
        !prisonerContactFetch.data ||
        !orderData
      ) {
        return;
      }

      domToPdf(
        mainContentRef.current,
        {
          filename: `order_${prisonerContactFetch.data.full_name}_${orderData?.id}.pdf`,
          excludeTagNames: ['img']
        },
      )
    } catch (er) {
      console.log('Error generating pdf', er);
      setError(t('somethingWrong'));
    }
  }, [orderData, prisonerContactFetch.data]);

  useEffect(() => {
    Promise.all([
      fetch.makeRequest({
        url: `orders/${orderId}/`,
        dataAt: ['data']
      }),
      orderItemsFetch.makeRequest({
        url: `orders/${orderId}/items/`,
        dataAt: ['data']
      })
    ]);
  }, [orderId]);

  const statusEls = useMemo(() => {
    if (!orderData) return null;

    const activeStatusIndex = STATUS_KEYS.findIndex((key) =>
      key === (orderData.status?.toUpperCase() || '')
    );

    return STATUS_KEYS.map((status, index) => {
      const isActive = index <= activeStatusIndex;
      const statusObject = STATUS_LABELS[status];
      const Icon = statusObject.icon;
      const previouslyCompletedStatus = index < activeStatusIndex;

      return (
        <div className={classNames(styles.status, styles[status])} key={status}>
          <div className="text horizontal-group">
            <div className={styles.icon}>
              {previouslyCompletedStatus
                ? <CompleteIcon />
                : (isActive && Icon ? <Icon /> : <DisabledStatusIcon />)
              }
            </div>
            {t(`status.${status}`)}
          </div>
          {previouslyCompletedStatus && (
            <span className="label">
              {getFormattedDate(orderData.updated_at, i18n.language)}
            </span>
          )}
        </div>
      );
    });
  }, [orderData, i18n.language]);

  const productEls = useMemo(() => {
    if (!orderItems) return null;

    return orderItems.map(item => {
      return (
        <li
          className={styles.product}
          tabIndex={0}
          onClick={() => setActiveProductView(item.product.id)}
          key={item.id}
        >
          <figure>
            <img alt={item.product.name} src={item.product.image} />
          </figure>
          <div className="vertical-group">
            <span className="title">{item.product.name}</span>
            <span className="price">{getPrice(item.product.price)}</span>
            <span className="price">{item.quantity}x</span>
          </div>
        </li>
      );
    });
  }, [orderItems]);

  const totalWeight = useMemo(() => {
    if (!orderItems) return 0;

    return orderItems.reduce((acc, item) => acc + +item.product.weight * item.quantity, 0);
  }, [orderItems]);

  if (fetch.loading || orderItemsFetch.loading) {
    return (
      <div className="abs-center">
        <Spinner />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="abs-center">
        <EmptyContent />
      </div>
    );
  }

  const isPaidOrder = orderData.payment_status === 'completed';

  return (
    <div className={styles.order}>
      <SectionHead title={t('aboutOrder')}>
        <button type="button" title={t('download')} onClick={onPrintOrder}>
          <PaperIcon />
        </button>
      </SectionHead>
      <div className={styles.content} ref={mainContentRef}>
        <div className={styles.head}>
          <span className="minor-label">{t('orderInfo')}</span>
          <div className="vertical-group">
            <span className="text-pale">{t('orderNumber')}</span>
            <span className="title-lg">№{orderData.id}</span>
          </div>
          <div className="vertical-group">
            <span className="text-pale">{t('orderDate')}</span>
            <span className="title-lg">{getFormattedDate(orderData.created_at, i18n.language)}</span>
          </div>
        </div>
        <div className={styles.body}>
          <span className="minor-label">
            {t('orderStatus')}
          </span>
          {statusEls}
        </div>
        {orderData.delivery_confirmation_image && (
          <figure>
            <img src={orderData.delivery_confirmation_image} alt="Confirmation Image" />
          </figure>
        )}
        <div className={styles.products}>
          <span className="minor-label">{t('products')}</span>
          <ul>{productEls}</ul>
          <div className={styles.totals}>
            <div>
              <span className="text-pale">{t('productsWeight')}</span>
              <span className={classNames(styles.weight, "heading--tertiary")}>
                {totalWeight.toFixed(2)} kg
              </span>
            </div>
            <div>
              <span className="text-pale">
                {t('totalPrice')}
              </span>
              <div className="price-bold horizontal-group">
                <Badge
                  content={isPaidOrder ? t('paid') : t('pendingPayment')}
                  noIcon
                  type={isPaidOrder ? 'success' : 'warning'}
                />
                {getPrice(orderData.total)}
              </div>
            </div>
          </div>
        </div>
        {!isPaidOrder && (
          <button
            className="btn btn--primary btn--full"
            type="button"
            onClick={() => onCreateCheckout({
              id: orderData.id,
              totalPrice: +orderData.total,
              onSuccess: () => window.location.reload()
            })}
          >
            {t('pay')}
          </button>
        )}
      </div>
    </div>
  );
});

SingleOrder.displayName = 'SingleOrder';
