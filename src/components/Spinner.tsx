import { useTranslation } from "next-i18next";
import { FC } from "react";
import Modal from "./Modal/Modal";

interface SpinnerProps {
  title?: string;
}

export const Spinner: FC<SpinnerProps> = ({ title }) => (
  <div className="spinner-wrapper">
    <div className="spinner">
      <div />
      <div />
      <div />
      <div />
    </div>
    {title && (
      <span className="title">{title}</span>
    )}
  </div>
);

export const ModalSpinner: FC<SpinnerProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Modal center open contentClassName="spinner-modal">
      <Spinner title={props.title || t('loading')} />
    </Modal>
  );
}