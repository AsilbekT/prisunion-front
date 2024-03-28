import { useFetch } from "@/hooks/useFetch";
import { ICategory } from "@/interfaces/category.interface";
import { IProduct } from "@/interfaces/products.interface";
import { IFetchResponse } from "@/interfaces/utils.interface";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useMemo, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyContent } from "../EmptyContent/EmptyContent";
import { ProductCard } from "../ProductCard/ProductCard";
import { SectionHead } from "../SectionHead";
import styles from './CategoryProducts.module.scss';

interface CategoryProductsProps {
  firstProducts: IFetchResponse<IProduct[]> | null;
  category: ICategory;
}

export const CategoryProducts: FC<CategoryProductsProps> = memo(
  ({ firstProducts, category }) => {
    const router = useRouter();
    const fetch = useFetch(!firstProducts, firstProducts);
    const [products, setProducts] = useState<IProduct[]>(firstProducts?.data || []);
    const [page, setPage] = useState(2);

    const categoryId = router.query.id;
    const isPopularCategory = categoryId === 'popular';

    const loadMoreProducts = useCallback(async () => {
      if (
        (fetch.data?.pagination && !fetch.data.pagination.next) ||
        fetch.loading
      ) {
        return;
      }
      const response = await fetch.makeRequest({
        url:
          isPopularCategory
            ? `products/?trending=true&page=${page}`
            : `productcategories/${categoryId}/products/?page=${page}`,
      });
      const newProducts = response?.data;
      if (newProducts?.length) {
        setProducts(prev => ([...prev, ...newProducts]));
        setPage(p => p + 1);
      }
    }, [
      categoryId,
      page,
      fetch.data,
      isPopularCategory,
      fetch.makeRequest,
      fetch.loading
    ]);

    const productEls = useMemo(() => {
      return products.map(product => (
        <ProductCard isModal key={product.id} product={product} />
      ));
    }, [products]);

    return (
      <section className={styles.category}>
        <SectionHead
          className={styles.head}
          title={isPopularCategory ? 'Ommabop Mahsulotlar' : category.name}
          onGoBack={() => router.push('/')}
        />
        <div className="container">
          {products.length > 0 ? (
            <InfiniteScroll
              className={styles.list}
              hasMore={fetch.data?.pagination?.next || false}
              next={loadMoreProducts}
              loader=""
              dataLength={products.length}
            >
              {productEls}
            </InfiniteScroll>
          ) : (
            <div className="abs-center">
              <EmptyContent />
            </div>
          )}
        </div>
      </section>
    );
  }
);

CategoryProducts.displayName = 'CategoryProducts';
