import { ErrorModal } from "@/components/ErrorModal";
import { LanguageModal } from "@/components/LanguageModal/LanguageModal";
import { ModalSpinner } from "@/components/Spinner";
import { useHideScrollbar } from "@/hooks/useHideScrollbar";
import useMedia from "@/hooks/useMedia";
import { ICategory } from "@/interfaces/category.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

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
    const media = useMedia(
      ['tablet', 'screen and (max-width: 1024px)']
    );
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
      setShowFloatinMenu(false);
    }, [router.query]);

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