import { useAuthContext } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, memo } from "react";
import { BookmarkIcon, CartIcon, HomeIcon, Logo, UserIcon, UserOutlineIcon } from "../CustomIcons";
import { SearchBar } from "../Searchbar/Searchbar";
import styles from './MobileNavigation.module.scss';

const MobileNavigation: FC = memo(() => {
  const { prisonerContactFetch } = useAuthContext();
  const router = useRouter();
  const { setShowCart, totalCount } = useCart();
  const { favorites } = useFavoritesContext();
  const { t } = useTranslation();

  const user = prisonerContactFetch.data;

  return (
    <>
      {router.pathname === '/' && (
        <header className={styles.nav}>
          <nav>
            <div className="container">
              <div className={styles.content}>
                <div className={styles.top}>
                  <Link
                    href={user ? '/profile' : '/login'}
                    title={user ? t('profile') : t('login')}
                    className="horizontal-group"
                  >
                    <span className="rounded-btn">
                      <UserIcon />
                    </span>
                    {user ? (
                      <span className="vertical-group">
                        <span className="title-lg">
                          {user.full_name}
                        </span>
                        <span className="text-pale">
                          {t(`relationships.${user.relationship}`)}
                        </span>
                      </span>
                    ) : (
                      <span className="title-lg">{t('login')}</span>
                    )}
                  </Link>
                  <Link href="/" title="PrisUnion">
                    <Logo />
                  </Link>
                </div>
                <SearchBar />
              </div>
            </div>
          </nav>
        </header>
      )}
      <header>
        <nav role="navigation" className={styles.panel}>
          <li className={styles.item} data-active={router.pathname === '/'}>
            <Link href="/" title="PrisUnion">
              <HomeIcon />
              {t('home')}
            </Link>
          </li>
          <li
            tabIndex={0}
            onClick={() => setShowCart(true)}
            data-has-items
            data-items={totalCount ? totalCount : undefined}
            className={styles.item}
          >
            <CartIcon />
            {t('cart')}
          </li>
          <li
            className={styles.item}
            data-has-items
            data-items={favorites.length ? favorites.length : undefined}
            data-active={'/favorites' === router.pathname}
          >
            <Link href="/favorites" title={t('saved')}>
              <BookmarkIcon />
              {t('saved')}
            </Link>
          </li>
          <li
            className={styles.item}
            data-active={router.pathname.includes(user ? 'profile' : 'login')}
          >
            <Link
              href={user ? '/profile' : '/login'}
              title={user ? t('profile') : t('login')}
              className="horizontal-group"
            >
              <UserOutlineIcon />
              {t('profile')}
            </Link>
          </li>
        </nav>
      </header>
    </>
  );
});

MobileNavigation.displayName = 'MobileNavigation';


export default MobileNavigation;
