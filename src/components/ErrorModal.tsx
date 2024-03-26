import { useTranslation } from "next-i18next";
import { FC } from "react";
import { XIcon } from "./CustomIcons";
import Modal from "./Modal/Modal";

interface ErrorModalProps {
  error: string;
  onClose?: () => void;
  action?: {
    onAction: () => void;
    label: string;
  }
}

export const ErrorModal: FC<ErrorModalProps> = ({
  error,
  onClose,
  action
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      onClose={onClose}
      contentClassName="error-modal"
      open={Boolean(error)}
      center
    >
      <XIcon />
      <span className="heading--secondary">
        {t('attention')}
      </span>
      <p className="text">
        {error}
      </p>
      {action && (
        <button
          title={action.label}
          onClick={action.onAction}
          type="button"
          className="btn btn--primary btn--full"
        >
          {action.label}
        </button>
      )}
    </Modal>
  );
};