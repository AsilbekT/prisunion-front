import { useGlobalContext } from "@/contexts/GlobalContext";
import { ICategory } from "@/interfaces/category.interface";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, memo, useCallback, useMemo, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import styles from './FloatingMenu.module.scss';

export const FloatingMenu: FC = memo(() => {
  const { categories, showFloatinMenu, setShowFloatinMenu } = useGlobalContext();
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const { t } = useTranslation();

  const categoryEls = useMemo(() => {
    return categories.map(category => {
      return (
        <li
          key={category.id}
          onMouseEnter={() => setActiveCategory(category)}
          onMouseLeave={() => setActiveCategory(null)}
          className={styles.category}
        >
          <Link className="underline-link" href={`/categories/${category.id}/products`}>
            {category.name}
          </Link>
        </li>
      );
    });
  }, [categories]);

  const onCloseMenu = useCallback(() => {
    setShowFloatinMenu(false);
  }, []);

  if (!showFloatinMenu) {
    return null;
  }

  return (
    <div className={classNames(styles.floating, 'fadeIn')}>
      <div className="container">
        <div className={styles.head}>
          <h2 className="heading--secondary">{t('categories')}</h2>
          <button className="btn btn--pale" title="Menuni yopish" onClick={onCloseMenu}>
            <IoCloseOutline />
            {t('close')}
          </button>
        </div>
        <div className={styles.body}>
          <ul>
            {categoryEls}
          </ul>
          {activeCategory?.image && (
            <figure>
              <img alt={activeCategory.name} src={activeCategory.image} />
            </figure>
          )}
        </div>
      </div>
    </div>
  );
});

FloatingMenu.displayName = 'FloatingMenu';
