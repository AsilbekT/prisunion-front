import { Badge } from "@/components/Badge";
import { EmptyContent } from "@/components/EmptyContent/EmptyContent";
import { SectionHead } from "@/components/SectionHead";
import { Spinner } from "@/components/Spinner";
import { STATUS_LABELS } from "@/data/common.data";
import { useFetch } from "@/hooks/useFetch";
import { IOrder } from "@/interfaces/order.interface";
import { IFetchResponse } from "@/interfaces/utils.interface";
import { getFormattedDate } from "@/utils/date.utils";
import { getPrice } from "@/utils/string.utils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from './OrdersList.module.scss';

export const OrdersList: FC = memo(() => {
  const fetch = useFetch<IFetchResponse<IOrder[]>>(true);
  const { data: fetchedData } = fetch;
  const [page, setPage] = useState(2);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetch.makeRequest({ url: 'orders/', })
      .then(r => setOrders(r?.data || []));
  }, []);

  const onLoadMoreOrder = useCallback(async () => {
    if (
      (fetchedData?.pagination && !fetchedData.pagination.next) ||
      fetch.loading
    ) {
      return;
    }

    const newOrders = await fetch.makeRequest({
      url: `orders/?page=${page}`,
    });

    if (newOrders?.data?.length) {
      setOrders(prev => ([...prev, ...newOrders.data!]));
      setPage(p => p + 1);
    }
  }, [page, fetchedData, fetch.loading,]);

  const orderEls = useMemo(() => {
    return orders.map((order) => {
      const status = STATUS_LABELS[order.status as keyof typeof STATUS_LABELS];
      return (
        <Link
          href={`/profile/orders/${order.id}`}
          key={order.id}
          className={styles.item}
        >
          <div>
            <span className="label">№{order.id}</span>
            <span className="price-bold">{getPrice(order.total)}</span>
          </div>
          <div>
            <span className="text-pale">{getFormattedDate(order.created_at, i18n.language)}</span>
            <Badge content={t(`status.${order.status}`)} type={status.type as any} noIcon />
          </div>
        </Link>
      );
    });
  }, [orders, i18n.language]);

  if (!orders.length && fetch.loading) {
    return (
      <div className="abs-center">
        <Spinner />
      </div>
    );
  }

  if (!orders.length || !fetchedData) {
    return <EmptyContent message={t('orderHistoryShown')} />;
  }

  return (
    <section className={styles.orders}>
      <SectionHead title={t('orderHistory')} className={styles.head} />
      {fetchedData.pagination
        ? (
          <InfiniteScroll
            hasMore={fetchedData.pagination.next}
            loader=""
            next={onLoadMoreOrder}
            dataLength={orders.length}
          >
            {orderEls}
          </InfiniteScroll>
        )
        : (
          <div className={styles.list}>
            {orderEls}
          </div>
        )
      }
    </section>
  );
});

OrdersList.displayName = 'OrdersList';
