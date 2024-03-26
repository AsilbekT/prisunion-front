import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslation } from "next-i18next";
import { FC } from "react";
import { UserIcon } from "../CustomIcons";
import { SectionHead } from "../SectionHead";
import styles from './PrisonersList.module.scss';

export const PrisonersList: FC = () => {
  const { prisonerContactFetch } = useAuthContext();
  const { t } = useTranslation();

  const user = prisonerContactFetch.data;

  if (!user) return null;

  return (
    <section className={styles.list}>
      <SectionHead title="Mahbuslar soni" />
      <div className="container">
        <div className={styles.content}>
          <span className="rounded-btn">
            <UserIcon />
          </span>
          <div className="vertical-group">
            <span className="label">{user.prisoner_full_name}</span>
            <span className="text-pale">{t(`relationships.${user.relationship}`)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}