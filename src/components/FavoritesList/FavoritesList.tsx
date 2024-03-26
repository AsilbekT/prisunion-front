import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useTranslation } from "next-i18next";
import { FC, memo, useMemo } from "react";
import { TrashIcon } from "../CustomIcons";
import { EmptyContent } from "../EmptyContent/EmptyContent";
import { ProductCard } from "../ProductCard/ProductCard";
import { SectionHead } from "../SectionHead";
import styles from './FavoritesList.module.scss';

export const FavoritesList: FC = memo(() => {
  const { favorites, clearFavorites } = useFavoritesContext();
  const { t } = useTranslation();

  const productEls = useMemo(() => {
    return favorites.map((product) => {
      return <ProductCard key={product.id} product={product} isModal />
    });
  }, [favorites]);

  const hasFavorites = favorites.length > 0;

  return (
    <section className={styles.list}>
      <SectionHead title={t('saved')}>
        {hasFavorites && (
          <button title={t('clear')} onClick={clearFavorites}>
            <TrashIcon />
          </button>
        )}
      </SectionHead>
      <div className="container">
        <div className={styles.content}>
          {hasFavorites ? (
            <div className={styles.products}>
              {productEls}
            </div>
          ) : (
            <div className={styles.empty}>
              <EmptyContent message={t('savedShown')} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

FavoritesList.displayName = 'FavoritesList';
