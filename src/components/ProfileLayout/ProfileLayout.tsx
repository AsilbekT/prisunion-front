import { useAuthContext } from "@/contexts/AuthContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { ELocales } from "@/interfaces/locales.interface";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, ReactNode, memo, useCallback, useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { BsBell } from 'react-icons/bs';
import { IoLogOutOutline } from "react-icons/io5";
import { Badge } from "../Badge";
import {
  ClockIcon,
  GlobeIcon,
  PassportIcon,
  PhoneIcon,
  TelegramIcon,
  UserGroup,
  UserIcon,
  WarningIcon
} from "../CustomIcons";
import Modal from "../Modal/Modal";
import { ProfileInfo } from "../ProfileInfo/ProfileInfo";
import { ModalSpinner } from "../Spinner";
import styles from './ProfileLayout.module.scss';

interface ProfileLayoutProps {
  children: ReactNode;
}

const CONTACT_URL = 'https://t.me/asilbek_turgunboev';

export const ProfileLayout: FC<ProfileLayoutProps> = memo(({ children, }) => {
  const { prisonerContactFetch, logout, isApproved } = useAuthContext();
  const { media, showLanguages, setShowLanguages, notifications } = useGlobalContext();
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const user = prisonerContactFetch.data;

  useEffect(() => {
    if (!user && !prisonerContactFetch.loading) {
      router.push('/login');
    }
  }, [user, prisonerContactFetch.loading]);

  const onCloseModal = useCallback(() => setShowPersonalInfo(false), []);

  if (prisonerContactFetch.loading || !user) {
    return <ModalSpinner />;
  }

  const isIndexProfilePage = router.pathname === '/profile';
  const hideNavigation = media.tablet && !isIndexProfilePage;

  return (
    <>
      <Modal open={showPersonalInfo} onClose={onCloseModal}>
        <ProfileInfo />
      </Modal>
      <section className={styles.profile}>
        <div className="container">
          <div className={styles.content}>
            {!hideNavigation && (
              <div className={styles.nav}>
                <div className={styles.head}>
                  <button
                    onClick={() =>
                      media.tablet
                        ? setShowPersonalInfo(true)
                        : router.push('/profile')
                    }
                    title={t('personalInfo')}
                    className={styles.personalInfoBtn}
                  >
                    <PassportIcon />
                  </button>
                  <div className={styles.user}>
                    <UserIcon />
                  </div>
                  <h1 className="title-lg">
                    {user.full_name}
                  </h1>
                  <Badge
                    content={
                      isApproved
                        ? t('approved')
                        : t('approvedStatusNone')
                    }
                    type={isApproved ? 'success' : 'fail'}
                  />
                  <Link
                    href="/profile/prisoners"
                    title={t('prisonersCount')}
                    className="btn btn--secondary btn--full"
                    data-active={router.pathname === '/profile/prisoners'}
                  >
                    <span className="horizontal-group label">
                      <UserGroup />
                      {t('prisonersCount')}
                    </span>
                    <span className="horizontal-group label">
                      1<BiChevronRight />
                    </span>
                  </Link>
                </div>
                <div className={styles.body}>
                  <ul>
                    <li>
                      <a href={`tel:+${user.phone_number}`} title={t('phoneNumber')}>
                        <span className="horizontal-group label">
                          <PhoneIcon />
                          {t('phoneNumber')}
                        </span>
                        <span className="horizontal-group text-pale">
                          +{user.phone_number}
                          <BiChevronRight />
                        </span>
                      </a>
                    </li>
                    <li>
                      <Link
                        data-active={router.pathname.includes('/profile/orders')}
                        href="/profile/orders"
                        title={t('orderHistory')}
                      >
                        <span className="horizontal-group label">
                          <ClockIcon />
                          {t('orderHistory')}
                        </span>
                        <BiChevronRight />
                      </Link>
                    </li>
                    {/* <li tabIndex={0}>
                      <Link
                        href="/profile/transactions"
                        title="Tranzaksiyalar tarixi"
                        data-active={router.pathname === '/profile/transactions'}
                      >
                        <span className="horizontal-group label">
                          <StatsIcon />
                          Tranzaksiyalar tarixi
                        </span>
                        <BiChevronRight />
                      </Link>
                    </li> */}
                    <li>
                      <a href={CONTACT_URL} rel="noopener noreferrer" target="_blank" title={t('contactUs')}>
                        <span className="horizontal-group label">
                          <TelegramIcon />
                          {t('contactUs')}
                        </span>
                        <BiChevronRight />
                      </a>
                    </li>
                    <li>
                      <Link
                        href="/profile/notifications"
                        title={t('notifications')}
                        data-active={router.pathname === '/profile/notifications'}
                      >
                        <span className="horizontal-group label">
                          <span data-items={notifications.length ? notifications.length : undefined}>
                            <BsBell />
                          </span>
                          {t('notifications')}
                        </span>
                      </Link>
                      <BiChevronRight />
                    </li>
                    <li
                      tabIndex={0}
                      data-active={showLanguages}
                      onClick={() => setShowLanguages(true)}
                    >
                      <span className="horizontal-group label">
                        <GlobeIcon />
                        {t('language')}
                      </span>
                      <span className="horizontal-group text-pale">
                        {ELocales[i18n.language as keyof typeof ELocales]}
                        <BiChevronRight />
                      </span>
                    </li>
                    <li>
                      <Link
                        href="/profile/faq"
                        title={t('faq')}
                        data-active={router.pathname === '/profile/faq'}
                      >
                        <span className="horizontal-group label">
                          <WarningIcon />
                          {t('faq')}
                        </span>
                        <BiChevronRight />
                      </Link>
                    </li>
                    <li tabIndex={0} onClick={logout}>
                      <span className="horizontal-group label">
                        <IoLogOutOutline />
                        {t('logout')}
                      </span>
                      <BiChevronRight />
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {!(media.tablet && isIndexProfilePage) && (
              <div className={styles.right}>
                {children}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
});

ProfileLayout.displayName = 'ProfileLayout';
