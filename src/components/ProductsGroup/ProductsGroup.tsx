import { useFetch } from "@/hooks/useFetch";
import { IProduct } from "@/interfaces/products.interface";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, memo, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from './ProductsGroup.module.scss';

interface ProductsGroupProps {
  products?: IProduct[];
  title: string;
  isModalProduct?: boolean;
  fetchLink?: string;
  categoryId?: string | number;
}

export const ProductsGroup: FC<ProductsGroupProps> = memo(({
  isModalProduct,
  products = [],
  fetchLink,
  categoryId,
  title,
}) => {
  const productsFetch = useFetch<IProduct[]>(Boolean(fetchLink));
  const productObjects = products.length ? products : (productsFetch.data || []);
  const { t } = useTranslation();

  useEffect(() => {
    if (fetchLink && !products.length) {
      productsFetch.makeRequest({
        url: fetchLink,
        dataAt: ['data']
      });
    }
  }, [fetchLink, products.length, productsFetch.makeRequest]);

  const productEls = useMemo(() => {
    return productObjects.map(product => (
      <SwiperSlide key={product.id}>
        <ProductCard isModal={isModalProduct} product={product} />
      </SwiperSlide>
    ));
  }, [productObjects, isModalProduct]);

  if (productsFetch.loading || !productObjects.length) {
    return null;
  }

  return (
    <section className={styles.container}>
      <div className="container">
        <div className={styles.head}>
          <h2 className="title-lg">{title}</h2>
          {categoryId && (
            <Link
              href={`/categories/${categoryId}/products`}
              title={title}
              className="blue-link"
            >
              {t('all')}
            </Link>
          )}
        </div>
        <Swiper
          slidesPerView={1.95}
          spaceBetween={15}
          breakpoints={{
            330: {
              slidesPerView: 2.25,
            },
            550: {
              slidesPerView: 3.35
            },
            768: {
              slidesPerView: 5
            },
            1024: {
              slidesPerView: 6.15
            }
          }}
        >
          {productEls}
        </Swiper>
      </div>
    </section>
  );
});

ProductsGroup.displayName = 'ProductsGroup';
