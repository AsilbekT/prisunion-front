import { ITokenPairs } from '@/interfaces/auth.interface';

const TOKEN_KEY = '___t_user';

export const getAuthTokens = () => {
  if (typeof window === 'undefined') return null;
  return JSON.parse(
    localStorage.getItem(TOKEN_KEY) || 'null'
  ) as ITokenPairs | null;
};

export const setAuthTokens = (token: ITokenPairs | null) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
};
