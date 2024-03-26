import { CellInput } from '@/components/CellInput';
import { ArrowIcon, ArrowLeft } from '@/components/CustomIcons';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useLoginContext } from '@/contexts/LoginContext';
import { useFetch } from '@/hooks/useFetch';
import { setAuthTokens } from '@/utils/auth.utils';
import { getFutureTimeBySeconds } from '@/utils/date.utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, FormEvent, memo, useCallback, useEffect, useState } from 'react';
import styles from './Confirm.module.scss';

const CODE_LENGTH = 4;

export const LoginConfirm: FC = memo(() => {
  const { setPhase, phone, confirmationTimer } = useLoginContext();
  const { setTokens } = useAuthContext();
  const [code, setCode] = useState('');
  const { restart, isRunning, minutes, seconds, pause } = confirmationTimer;
  const fetch = useFetch();
  const router = useRouter();
  const { setLoading, setError } = useGlobalContext();
  const { t } = useTranslation();

  useEffect(() => {
    restart(getFutureTimeBySeconds(60));
  }, [restart]);

  const onRequestCode = useCallback(async () => {
    try {
      if (isRunning) return;
      setLoading(true);

      const response = await fetch.makeRequest({
        url: 'api/contact/resend_code/',
        options: {
          body: JSON.stringify({
            phone_number: phone.replace('+', ''),
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });

      if (response?.status === 'success') {
        restart(getFutureTimeBySeconds(60));
      } else if (response?.status === 'error') {
        setError(t('somethingWrong'));
      }
    } catch (er) {
      setError(t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  }, [restart, isRunning]);

  const onSubmitForm = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (code.length < CODE_LENGTH) return;

    const response = await fetch.makeRequest({
      url: 'api/contact/login/verify/',
      options: {
        body: JSON.stringify({
          phone_number: phone.replace('+', '').replace(/\s/g, ''),
          code
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    });

    if (response?.status === 'success') {
      pause();
      if (!response.data?.access) {
        setPhase(p => p + 1);
        setCode('');
      } else if (response.data?.access && response.data.refresh) {
        setTokens(response.data);
        setAuthTokens(response.data);
        router.replace('/');
      }
    } else if (
      response?.status === 'error' &&
      response.message?.toUpperCase()?.includes('INVALID')
    ) {
      fetch.setError(t('wrongCode'));
    }
  }, [code, fetch.makeRequest, phone, pause]);

  return (
    <div className={styles.confirm}>
      <div className={styles.content}>
        <div className={styles.head}>
          <button onClick={() => setPhase(p => p - 1)} className="btn-back">
            <ArrowLeft />
          </button>
          <p className="title-lg">{t('confirm')}</p>
        </div>
        <form onSubmit={onSubmitForm}>
          <p className="text-pale">
            <span className="label">{phone}</span>&nbsp;
            {t('codeSent')}
          </p>
          {fetch.error && (
            <p className="error">{fetch.error}</p>
          )}
          <label>
            <span className="label">
              Kodni kiriting
            </span>
            <CellInput
              value={code}
              autoFocus
              setValue={setCode}
              required
              cellsCount={CODE_LENGTH}
            />
          </label>
          {isRunning
            ? (
              <span className="label">
                {minutes}:{seconds}
              </span>
            )
            : (
              <button
                type="button"
                onClick={onRequestCode}
                className="blue-link"
                title={t('resend')}
              >
                {t('resend')}
              </button>
            )
          }
          <button
            disabled={fetch.loading}
            type="submit"
            title={t('confirm')}
            className="btn btn--primary btn--full btn--arrow"
          >
            {t('confirm')}
            <ArrowIcon />
          </button>
        </form>
      </div>
    </div>
  );
});

LoginConfirm.displayName = 'LoginConfirm';
