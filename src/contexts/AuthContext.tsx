import { useFetch } from "@/hooks/useFetch";
import { IPrisonerContact, ITokenPairs } from "@/interfaces/auth.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { getAuthTokens, setAuthTokens } from "@/utils/auth.utils";
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

interface IAuthContext {
  tokens: ITokenPairs | null;
  setTokens: StateSetter<ITokenPairs | null>;
  prisonerContactFetch: ReturnType<typeof useFetch<IPrisonerContact>>;
  logout: () => void;
  isApproved: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IAuthContext);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children, }) => {
  const [tokens, setTokens] = useState<ITokenPairs | null>(getAuthTokens());
  const prisonerContactFetch = useFetch<IPrisonerContact>(Boolean(tokens));

  const logout = useCallback(() => {
    setTokens(null);
    setAuthTokens(null);
    prisonerContactFetch.setData(null);
  }, [prisonerContactFetch.setData]);

  useEffect(() => {
    if (tokens) {
      prisonerContactFetch.makeRequest({
        url: 'api/get_prisoner_contact/',
        options: {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        },
        dataAt: ['data']
      })
    }
  }, [prisonerContactFetch.makeRequest, tokens]);

  const state: IAuthContext = {
    prisonerContactFetch,
    tokens,
    setTokens,
    logout,
    isApproved: Boolean(
      prisonerContactFetch?.data?.prisoner
    )
  };

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
};