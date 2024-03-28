import Modal from '@/components/Modal/Modal';
import { useGlobalContext } from "@/contexts/GlobalContext";
import { INotification } from "@/interfaces/notifications.interface";
import { getFormattedDate } from "@/utils/date.utils";
import { useTranslation } from "next-i18next";
import { FC, useCallback, useMemo, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { BellIcon } from "../CustomIcons";
import { EmptyContent } from "../EmptyContent/EmptyContent";
import { SectionHead } from "../SectionHead";
import { Spinner } from "../Spinner";
import styles from './NotificationsList.module.scss';

export const NotificationsList: FC = () => {
  const { notifications, notificationsLoading } = useGlobalContext();
  const { t } = useTranslation();
  const [activeNotication, setActiveNotification] = useState<INotification | null>(null);

  const onOpenNotification = useCallback((notification: INotification) => {
    setActiveNotification(notification);
  }, []);

  const notificationEls = useMemo(() => {
    return notifications.map((notification) => {
      return (
        <li
          key={notification.id}
          tabIndex={0}
          onClick={() => onOpenNotification(notification)}
        >
          <div>
            <div className={styles.icon}>
              <BellIcon />
            </div>
            <div className="vertical-group">
              <span className="label">{notification.title}</span>
              <p className="text-pale text-hide">{notification.message}</p>
            </div>
          </div>
          <BiChevronRight />
        </li>
      );
    });
  }, [notifications]);

  if (notificationsLoading) {
    return <Spinner />;
  }

  return (
    <section className={styles.notifications}>
      {activeNotication && (
        <Modal open={Boolean(activeNotication)} contentClassName={styles.modal} onClose={() => setActiveNotification(null)}>
          <div className={styles.icon}>
            <BellIcon />
          </div>
          <div>
            <h6 className="title-lg">
              {activeNotication.title}
            </h6>
            <p className="text">{activeNotication.message}</p>
            <span className="text-pale">{getFormattedDate(activeNotication.created_at)}</span>
          </div>
        </Modal>
      )}
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