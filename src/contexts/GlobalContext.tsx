import { ErrorModal } from "@/components/ErrorModal";
import { LanguageModal } from "@/components/LanguageModal/LanguageModal";
import { ModalSpinner } from "@/components/Spinner";
import { useFetch } from "@/hooks/useFetch";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import useMedia from "@/hooks/useMedia";
import { ICategory } from "@/interfaces/category.interface";
import { INotification } from "@/interfaces/notifications.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

declare global {
  interface Window {
    OneSignal: any;
  }
}
interface IGlobalContext {
  media: ReturnType<typeof useMedia>;
  search: string;
  setSearch: StateSetter<string>;
  categories: ICategory[];
  showFloatinMenu: boolean;
  setShowFloatinMenu: StateSetter<boolean>;
  error: string;
  setError: StateSetter<string>;
  activeProductView: number | null;
  setActiveProductView: StateSetter<number | null>;
  loading: boolean;
  notifications: INotification[];
  notificationsLoading: boolean;
  setLoading: StateSetter<boolean>;
  setShowLanguages: StateSetter<boolean>;
  showLanguages: boolean;
}

interface GlobalContextProviderProps {
  children: ReactNode;
  categories: ICategory[];
}

const GlobalContext = createContext({} as IGlobalContext);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider: FC<GlobalContextProviderProps> =
  ({ children, ...restProps }) => {
    const [search, setSearch] = useState('');
    const [showFloatinMenu, setShowFloatinMenu] = useState(false);
    const [activeProductView, setActiveProductView] = useState<number | null>(null);
    const [showLanguages, setShowLanguages] = useState(false);
    const { prisonerContactFetch } = useAuthContext();
    const media = useMedia(
      ['tablet', 'screen and (max-width: 1024px)']
    );
    const [error, setError] = useState('');
    const notificationsFetch = useFetch<INotification[]>(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    useHideScrollbar(showFloatinMenu);

    useEffect(() => {
      if (prisonerContactFetch.data?.id) {
        notificationsFetch.makeRequest({
          url: 'notifications/'
        });
      }
    }, [prisonerContactFetch.data, notificationsFetch.makeRequest]);

    useEffect(() => {
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(function () {
        window.OneSignal.init({
          appId: "e61b716e-c22d-4aaf-96cb-dbd8ee4327ed",
        });
      });

      if (navigator.userAgent.indexOf('iPhone') > -1) {
        document
          .querySelector("[name=viewport]")!
          .setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
      }
    }, []);

    useEffect(() => {
      setShowFloatinMenu(false);
      setActiveProductView(null);
    }, [router.query, router.pathname]);

    useHideScrollbar(Boolean(activeProductView));

    const state: IGlobalContext = {
      media,
      search,
      setSearch,
      categories: restProps.categories,
      showFloatinMenu,
      setShowFloatinMenu,
      activeProductView,
      setActiveProductView,
      error,
      setShowLanguages,
      showLanguages,
      setError,
      loading,
      notificationsLoading: notificationsFetch.loading,
      notifications: notificationsFetch.data || [],
      setLoading,
    };

    const clearError = useCallback(() => setError(''), []);

    return (
      <GlobalContext.Provider value={state}>
        {children}
        {loading && <ModalSpinner />}
        <ErrorModal
          error={error}
          onClose={clearError}
          action={{
            label: t('close'),
            onAction: clearError
          }}
        />
        <LanguageModal />
      </GlobalContext.Provider>
    );
  };