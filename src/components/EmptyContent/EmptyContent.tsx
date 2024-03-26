import { useTranslation } from "next-i18next";
import { FC } from "react";
import IllustrationNoneHuman from "../IllustrationNoneHuman";
import styles from './EmptyContent.module.scss';

interface EmptyContentProps {
  message?: string;
}

export const EmptyContent: FC<EmptyContentProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.empty}>
      <IllustrationNoneHuman />
      <span className='heading--tertiary'>
        {t('nothingFound')}
      </span>
      {message && (
        <p className='text-pale'>
          {message}
        </p>
      )}
    </div>
  );
};