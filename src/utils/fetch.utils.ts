import { DEFAULT_LOCALE } from '@/interfaces/locales.interface';
import { IFetchResponse } from '@/interfaces/utils.interface';

const { NEXT_PUBLIC_API_URL } = process.env;

export const fetchData = async <T = any>(
  path: string,
  options?: RequestInit,
  locale: string = DEFAULT_LOCALE
): Promise<IFetchResponse<T> | null> => {
  try {
    if (!NEXT_PUBLIC_API_URL) {
      throw new Error('NO API URL FOUND, PLEASE ADD URL TO ENV FILE');
    }
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/${path}`, {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        'Accept-Language': locale,
      },
    });
    if (response.ok) {
      return (await response.json()) as IFetchResponse<T>;
    }
    return null;
  } catch (er) {
    console.log(er);
    return null;
  }
};
