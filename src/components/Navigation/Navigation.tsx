import { useAuthContext } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, memo, useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { BookmarkIcon, CartIcon, GlobeIcon, Logo, UserIcon } from "../CustomIcons";
import { FloatingMenu } from "../FloatingMenu/FloatingMenu";
import { SearchBar } from "../Searchbar/Searchbar";
import styles from './Navigation.module.scss';


const Navigation: FC = memo(() => {
  const { setShowFloatinMenu, setShowLanguages, notifications } = useGlobalContext();
  const { setShowCart, totalCount } = useCart();
  const { favorites } = useFavoritesContext();
  const { prisonerContactFetch } = useAuthContext();
  const { t, i18n } = useTranslation();
  const [inputFocused, setInputFocused] = useState(false);

  const user = prisonerContactFetch.data;

  return (
    <header className={styles.nav}>
      <nav role="navigation">
        <div className="container">
          <div className={styles.content}>
            <div className={styles.logoContainer}>
              <Link href="/" onClick={() => setShowFloatinMenu(false)}>
                <Logo />
              </Link>
              <button onClick={() => setShowFloatinMenu(p => !p)} className="btn btn--secondary">
                <BiCategoryAlt />
                {t('categories')}
              </button>
            </div>
            <div className={classNames(styles.search, 'abs-center')}>
              <SearchBar onInputFocusToggle={setInputFocused} />
            </div>
            {inputFocused && <div className="backdrop" />}
            <div className={styles.leftGroup}>
              <button
                title={t('language')}
                className="btn btn--pale"
                onClick={() => setShowLanguages(true)}
              >
                <GlobeIcon />
                {i18n.language.toUpperCase()}
              </button>
              <button
                title={t('cart')}
                className="btn btn--pale"
                onClick={() => setShowCart(true)}
                data-items={totalCount ? totalCount : undefined}
              >
                <CartIcon />
                {t('cart')}
              </button>
              <Link
                className="btn btn--pale"
                data-items={favorites.length ? favorites.length : undefined}
                href="/favorites"
                title={t('saved')}
              >
                <BookmarkIcon />
                {t('saved')}
              </Link>
              {!prisonerContactFetch.loading && (
                <Link
                  href={user ? '/profile' : '/login'}
                  title={user ? t('profile') : t('login')}
                  className={styles.user}
                  data-items={notifications.length ? notifications.length : undefined}
                >
                  <span className="rounded-btn">
                    <UserIcon />
                  </span>
                  {user && (
                    <span className="vertical-group">
                      <span className="title-lg">
                        {user.full_name}
                      </span>
                      <span className="text-pale">
                        {user.relationship}
                      </span>
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <FloatingMenu />
    </header>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;