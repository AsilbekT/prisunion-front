import { useGlobalContext } from "@/contexts/GlobalContext";
import { ICategory } from "@/interfaces/category.interface";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { ComponentType, FC, memo, useCallback, useMemo, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FcBiohazard, FcBiomass, FcStackOfPhotos } from "react-icons/fc";
import { GiClothes, GiMeatCleaver, GiShinyApple } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";
import { PiCarrot } from "react-icons/pi";
import styles from './FloatingMenu.module.scss';

const ICONS_MAP: Record<string, ComponentType> = {
  books: FcStackOfPhotos,
  meets: GiMeatCleaver,
  cigares: FcBiohazard,
  fruits: GiShinyApple,
  clothes: GiClothes,
  'hygiene-products': FcBiomass,
  'oziq-ovqatlar': PiCarrot
};

export const FloatingMenu: FC = memo(() => {
  const { categories, showFloatinMenu, setShowFloatinMenu } = useGlobalContext();
  const [activeCategory, setActiveCategory] = useState<ICategory | null>(null);
  const { t } = useTranslation();

  const categoryEls = useMemo(() => {
    return categories.map(category => {
      const Icon = ICONS_MAP[category.icon_class || ''];
      return (
        <li
          key={category.id}
          onMouseEnter={() => setActiveCategory(category)}
          onMouseLeave={() => setActiveCategory(null)}
          className={classNames(
            styles.category,
            styles[category.icon_class || ''],
            { [styles.noIcon]: !Icon }
          )}
        >
          <Link className="horizontal-group" href={`/categories/${category.id}/products`}>
            <span>{Icon ? <Icon /> : <BiCategory />}</span>
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
            <div className={styles.image}>
              <figure className="sixteen-nine">
                <img alt={activeCategory.name} src={activeCategory.image} />
              </figure>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

FloatingMenu.displayName = 'FloatingMenu';
