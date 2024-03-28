import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, memo } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { PiTelegramLogo } from "react-icons/pi";
import { RiAndroidLine, RiPhoneLine } from "react-icons/ri";
import { Logo } from '../CustomIcons';
import styles from './Footer.module.scss';

const PHONE_NUMBER = '+998932700003';
const TELEGRAM = 'https://t.me/prisunion';
const EMAIL = 'info@prisunion.uz';
const MOBILE_APPLICATION = 'https://api.prisunion.uz/en/uploads/prisunion.apk';

interface FooterProps {
  asPage?: boolean;
}

export const Footer: FC<FooterProps> = memo(({ asPage }) => {
  const { t } = useTranslation();

  return (
    <footer className={classNames(styles.footer, { [styles.asPage]: asPage })}>
      <div className="container">
        <div className={styles.content}>
          {!asPage && (
            <Link title="PrisUnion" href="/">
              <Logo />
            </Link>
          )}
          <div className="horizontal-group">
            <a href={MOBILE_APPLICATION} className="blue-link horizontal-group" download title="PrisUnion">
              <span className={styles.iconWrapper}>
                <RiAndroidLine />
              </span>
              {t('downloadApp')}
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="blue-link horizontal-group" download title={t('phone')}>
              <span className={styles.iconWrapper}>
                <RiPhoneLine />
              </span>
              {PHONE_NUMBER}
            </a>
            <a href={`mailto:${EMAIL}`} className="blue-link horizontal-group" download title={t('email')}>
              <span className={styles.iconWrapper}>
                <MdOutlineMailOutline />
              </span>
              {EMAIL}
            </a>
            <a href={TELEGRAM} className="blue-link horizontal-group" download title={t('telegram')}>
              <span className={styles.iconWrapper}>
                <PiTelegramLogo />
              </span>
              {t('telegram')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';