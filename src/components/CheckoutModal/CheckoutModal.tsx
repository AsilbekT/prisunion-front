import { useCheckoutContext } from "@/contexts/CheckoutContext";
import { useTranslation } from "next-i18next";
import { FC, FormEvent, memo, useCallback, useRef } from "react";
import { CellInput } from "../CellInput";
import Modal from "../Modal/Modal";
import { StepsBar } from "../StepsBar/StepsBar";
import styles from './CheckoutModal.module.scss';

const CARD_NUMBER_LENGTH = 16;
const CARD_EXPIRES_LENGTH = 4;

export const CheckoutModal: FC = memo(() => {
  const {
    isCheckingOut,
    setCardExpires,
    setCardNumber,
    cardExpires,
    cardNumber,
    stage,
    confirmTransaction,
    smsCode,
    setSmsCode,
    onOrderCreate,
    reset
  } = useCheckoutContext();
  const cardInputRef = useRef<HTMLInputElement>(null);
  const expirationInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const onCardNumberChange = useCallback((val: string) => {
    const slicedVal = val.slice(0, CARD_NUMBER_LENGTH);
    if (slicedVal.length === CARD_NUMBER_LENGTH) {
      expirationInputRef.current?.focus();
    }
    setCardNumber(slicedVal);
  }, []);

  const onCardExpiresChange = useCallback((val: string) => {
    const slicedVal = val.slice(0, CARD_EXPIRES_LENGTH);
    if (!slicedVal.length) {
      cardInputRef.current?.focus();
    }
    setCardExpires(slicedVal);
  }, []);

  const onSubmitOrderCreate = useCallback((e: FormEvent) => {
    e.preventDefault();
    onOrderCreate();
  }, [onOrderCreate,]);

  const onSubmitSmsCode = useCallback((e: FormEvent) => {
    e.preventDefault();
    confirmTransaction();
  }, [confirmTransaction]);

  const viewContent = [
    <form key={0} onSubmit={onSubmitOrderCreate}>
      <div>
        <label className="input-wrapper">
          <span className="text-pale">
            {t('cardNumber')}
          </span>
          <input
            className="input"
            ref={cardInputRef}
            required
            value={cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            type="number"
            placeholder="8600570444171903"
          />
        </label>
        <label className="input-wrapper">
          <span className="text-pale">{t('cardExpires')}</span>
          <input
            className="input"
            value={cardExpires}
            required
            ref={expirationInputRef}
            onChange={(e) => onCardExpiresChange(e.target.value)}
            type="number"
            placeholder="01/28"
          />
        </label>
      </div>
      <button className="btn btn--primary btn--full">
        {t('continue')}
      </button>
    </form>,
    <form key={1} onSubmit={onSubmitSmsCode}>
      <span className="text-pale">{t('enterCode')}</span>
      <CellInput
        required
        autoFocus
        setValue={setSmsCode}
        value={smsCode}
        cellsCount={6}
      />
      <button className="btn btn--primary btn--full">
        {t('confirm')}
      </button>
    </form>
  ];

  return (
    <Modal
      open={isCheckingOut}
      contentClassName={styles.checkout}
      onClose={() => stage === 0 && reset()}
    >
      <h6 className="heading--tertiary">{t('payment')}</h6>
      <StepsBar
        stepsCount={2}
        currentStep={stage}
        title={stage > 0 ? t('confirm') : t('card')}
      />
      {viewContent[stage]}
    </Modal>
  );
});

CheckoutModal.displayName = 'CheckoutModal';