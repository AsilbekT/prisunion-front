import { useAuthContext } from '@/contexts/AuthContext';
import { setAuthTokens } from '@/utils/auth.utils';
import { useTranslation } from 'next-i18next';
import { useCallback, useState } from 'react';

interface IFetchOptions {
  url: string;
  options?: RequestInit;
  dataAt?: string[];
}

export const useFetch = <T = any>(
  initiallyLoading: boolean = false,
  initialState?: T
) => {
  const [data, setData] = useState<T | null>(initialState || null);
  const [loading, setLoading] = useState(initiallyLoading);
  const [error, setError] = useState('');
  const { tokens, logout, setTokens } = useAuthContext();
  const { i18n } = useTranslation();

  const makeRequest = useCallback(
    async ({
      url,
      options = {},
      dataAt,
    }: IFetchOptions): Promise<T | undefined> => {
      try {
        setError('');
        setLoading(true);

        let headers: HeadersInit = {
          ...(options.headers || {}),
          'Accept-Language': i18n.language,
        };
        if (tokens?.access) {
          headers = {
            Authorization: `Bearer ${tokens.access}`,
            ...headers,
          };
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${i18n.language}/${url}`,
          {
            ...options,
            headers,
          }
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setAuthTokens(null);
            setTokens(null);
            return makeRequest({ url, options, dataAt });
          }
          return await response.json();
        }

        let data = (await response.json()) as T;
        if (dataAt?.length) {
          dataAt.forEach((key) => (data = (data as any)[key]));
        }
        setData(data);
        return data as T;
      } catch (er) {
        const errorString = JSON.stringify(er);
        console.log('Error fetching data', errorString);
      } finally {
        setLoading(false);
      }
    },
    [i18n.language, logout]
  );

  return {
    data,
    loading,
    makeRequest,
    setData,
    error,
    setError,
    setLoading,
  };
};
