import { useAuthContext } from "@/contexts/AuthContext";
import { getFormattedDate } from "@/utils/date.utils";
import { useTranslation } from "next-i18next";
import { FC, memo } from "react";
import { IoBodyOutline, IoBookOutline, IoCalendarNumberOutline, IoMapOutline } from "react-icons/io5";
import styles from './ProfileInfo.module.scss';


export const ProfileInfo: FC = memo(() => {
  const { prisonerContactFetch } = useAuthContext();
  const { t, i18n } = useTranslation();

  const user = prisonerContactFetch.data

  if (!user) return null;

  return (
    <div className={styles.profile}>
      <h6 className="heading--tertiary">
        {t('personalInfo')}
      </h6>
      <ul>
        <li className="horizontal-group">
          <IoBookOutline />
          <div className="vertical-group">
            <span className="text-pale">{t('fullName')}</span>
            <span className="label">{user.full_name}</span>
          </div>
        </li>
        <li className="horizontal-group">
          <IoCalendarNumberOutline />
          <div className="vertical-group">
            <span className="text-pale">{t('birthday')}</span>
            <span className="label">{getFormattedDate(user.date_of_birth, i18n.language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </li>
        <li className="horizontal-group">
          <IoMapOutline />
          <div className="vertical-group">
            <span className="text-pale">{t('address')}</span>
            <span className="label">{user.address}</span>
          </div>
        </li>
        <li className="horizontal-group">
          <IoBodyOutline />
          <div className="vertical-group">
            <span className="text-pale">{t('gender')}</span>
            <span className="label">{t('male')}</span>
          </div>
        </li>
      </ul>
    </div>
  );
});

ProfileInfo.displayName = 'ProfileInfo';
