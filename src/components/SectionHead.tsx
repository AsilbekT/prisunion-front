import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, ReactNode, useCallback } from "react";
import { ArrowLeft } from "./CustomIcons";

interface SectionHeadProps {
  title: string;
  onGoBack?: () => void;
  className?: string;
  children?: ReactNode;
}

export const SectionHead: FC<SectionHeadProps> = ({
  title,
  onGoBack,
  className,
  children,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const goBackAction = useCallback(() => {
    if (typeof onGoBack === 'function') {
      onGoBack();
      return;
    }
    router.back();
  }, []);

  return (
    <div className={classNames(`head`, className)}>
      <div className="container">
        <div className="head__content">
          <div className="head__group">
            <button title={t('back')} onClick={goBackAction} className="btn-back">
              <ArrowLeft />
            </button>
            <h5 className="heading--secondary">
              {title}
            </h5>
            {children && (
              <div className="mobile-only">
                {children}
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};