import { useGlobalContext } from "@/contexts/GlobalContext";
import { useLoginContext } from "@/contexts/LoginContext";
import { useFetch } from "@/hooks/useFetch";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FC, FormEvent, memo, useCallback, useRef } from "react";
import { ArrowIcon, Logo } from "../../CustomIcons";
import styles from './Phone.module.scss';

export const LoginPhone: FC = memo(() => {
  const { setPhase, phone, onPhoneValueChange } = useLoginContext();
  const fetch = useFetch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { setLoading, setError } = useGlobalContext();
  const { t } = useTranslation();

  const onSubmitForm = useCallback(async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!inputRef.current || fetch.loading) return;

      inputRef.current.setCustomValidity('');

      if (isNaN(parseInt(phone)) || phone.length < 13) {
        inputRef.current.setCustomValidity(t('invalidPhone'));
        return;
      }

      const response = await fetch.makeRequest({
        url: 'api/contact/login/request/',
        options: {
          body: JSON.stringify({
            phone_number: phone.replace('+', '').replace(/\s/g, '')
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      if (response?.status === 'success') {
        setPhase(prev => prev + 1);
      } else if (!response?.status) {
        setError(t('somethingWrong'));
      }
    } catch (er) {
      console.log(er);
      setError(t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  }, [fetch.makeRequest, phone, fetch.loading]);

  return (
    <div className={styles.login}>
      <div className="mobile-only">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <form onSubmit={onSubmitForm}>
        <Link href="/">
          <Logo />
        </Link>
        <div className={styles.text}>
          <h2 className="heading--secondary">
            {t('login')}
          </h2>
          <p className="text-pale">
            {t('pleaseEnterPhoneTitle')}
          </p>
        </div>
        <label className="text-pale">
          {t('yourPhone')}
          <input
            required
            ref={inputRef}
            className="input input--grey"
            value={phone}
            type="tel"
            placeholder={t('yourPhone')}
            onChange={(e) => onPhoneValueChange(e.currentTarget.value)}
          />
        </label>
        <button
          disabled={fetch.loading}
          onClick={onSubmitForm}
          className="btn btn--primary btn--full btn--arrow"
          title={t('continue')}
        >
          {t('continue')}
          <ArrowIcon />
        </button>
      </form>
    </div>
  );
});

LoginPhone.displayName = 'LoginPhone';