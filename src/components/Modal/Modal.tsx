import { inter } from '@/utils/media.utils';
import classNames from "classnames";
import { FC, ReactNode, memo, useCallback } from "react";
import { createPortal } from "react-dom";
import OutsideClickHandler from 'react-outside-click-handler';
import SafeHydrate from '../SafeHydrate';
import styles from './Modal.module.scss';

interface ModalProps {
  children: ReactNode;
  onClose?: () => unknown;
  open: boolean;
  contentClassName?: string;
  center?: boolean;
}

const Modal: FC<ModalProps> = memo(({
  children,
  contentClassName,
  open,
  center,
  onClose
}) => {
  const onCloseModal = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      className={classNames(
        styles.modal,
        inter.className,
        'fadeIn',
        { [styles.center]: center }
      )}
    >
      <OutsideClickHandler onOutsideClick={onCloseModal}>
        <div className={classNames(styles.content, contentClassName)}>
          {children}
        </div>
      </OutsideClickHandler>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

const WrappedModal: FC<ModalProps> = (props) => (
  <SafeHydrate>
    <Modal {...props} />
  </SafeHydrate>
);

WrappedModal.displayName = 'WrappedModal';

export default WrappedModal;