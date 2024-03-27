import { useGlobalContext } from "@/contexts/GlobalContext";
import { useFetch } from "@/hooks/useFetch";
import { IProduct } from "@/interfaces/products.interface";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { useTranslation } from "next-i18next";
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "../CustomIcons";
import styles from './Searchbar.module.scss';

interface SearchBarProps {
  onInputFocusToggle?: (focused: boolean) => void;
}

export const SearchBar: FC<SearchBarProps> = memo(({ onInputFocusToggle }) => {
  const { search, setSearch, setActiveProductView } = useGlobalContext();
  const fetch = useFetch<IProduct[]>();
  const [inputFocused, setInputFocused] = useState(false);
  const { t } = useTranslation();

  const onSubmitSearch = useCallback((e: any) => {
    e.preventDefault();
    fetchSearchResults(search);
  }, [search]);

  const fetchSearchResults = useCallback((searchQuery: string) => {
    const trimmedSearch = searchQuery.trim();
    if (trimmedSearch) {
      fetch.makeRequest({
        url: `search/?q=${trimmedSearch}`,
        dataAt: ['data']
      });
    }
  }, [fetch.makeRequest]);

  const debouncedFunc = useRef(debounce(fetchSearchResults, 750));

  useEffect(() => {
    if (!search.trim().length) {
      fetch.setData([]);
    }
  }, [search]);

  useEffect(() => {
    debouncedFunc.current(search);
  }, [search, fetchSearchResults]);

  const foundItemEls = useMemo(() => {
    return fetch.data?.map(product => {
      return (
        <li
          key={product.id}
          onClick={() => setActiveProductView(product.id)}
          tabIndex={0}
        >
          {product.image && (
            <div>
              <figure className="sixteen-nine">
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${product.image}`} alt={product.name} />
              </figure>
            </div>
          )}
          <span className="title">
            {product.name}
          </span>
        </li>
      );
    });
  }, [fetch.data]);

  useEffect(() => {
    if (typeof onInputFocusToggle === 'function') {
      onInputFocusToggle(inputFocused);
    }
  }, [inputFocused, onInputFocusToggle]);

  return (
    <form className={styles.form} onSubmit={onSubmitSearch}>
      <SearchIcon />
      <input
        type="search"
        className="input input--grey"
        value={search}
        placeholder={t('search')}
        onBlur={() => setTimeout(() => setInputFocused(false), 500)}
        onFocus={() => setInputFocused(true)}
        onChange={(e) => setSearch(e.target.value)}
      />
      {inputFocused && (
        fetch.data && fetch.data?.length > 0
          ? (
            <ul className={classNames('fadeIn scroll', styles.drop)}>
              {foundItemEls}
            </ul>
          )
          : !fetch.loading && search.length > 0 && (
            <div className={classNames('fadeIn scroll', styles.drop)}>
              <div className={styles.empty}>
                <h5 className="title-lg">{t('nothingFound')}</h5>
              </div>
            </div>
          )
      )}
    </form>
  );
});

SearchBar.displayName = 'SearchBar';
