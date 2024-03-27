import { useGlobalContext } from "@/contexts/GlobalContext";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, useMemo } from "react";
import { EmptyContent } from "../EmptyContent/EmptyContent";
import { SectionHead } from "../SectionHead";
import { Spinner } from "../Spinner";
import styles from './NotificationsList.module.scss';

export const NotificationsList: FC = () => {
  const { notifications, notificationsLoading } = useGlobalContext();
  const { t } = useTranslation();

  const notificationEls = useMemo(() => {
    return notifications.map((notification) => {
      return (
        <li key={notification.id}>
          <Link href="">
            { }
          </Link>
        </li>
      );
    });
  }, [notifications]);

  if (notificationsLoading) {
    return <Spinner />;
  }

  return (
    <section className={styles.notifications}>
      <SectionHead title={t('notifications')} />
      <div className="container" >
        <div className={styles.content}>
          {!notifications.length ? (
            <div className="abs-center">
              <EmptyContent />
            </div>
          ) : (
            <ul>{notificationEls}</ul>
          )}
        </div>
      </div>
    </section>
  );
};

NotificationsList.displayName = 'NotificationsList';