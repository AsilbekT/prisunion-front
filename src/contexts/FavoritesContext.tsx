import { IProduct } from "@/interfaces/products.interface";
import { StateSetter } from "@/interfaces/utils.interface";
import { FC, ReactNode, createContext, useCallback, useContext, useState } from "react";

interface IFavoritesContext {
  favorites: IProduct[];
  removeFavorite: (id: number) => void;
  addFavorite: (product: IProduct) => void;
  setFavorites: StateSetter<IProduct[]>;
  toggleFavorite: (product: IProduct) => void;
  isFavorite: (product: IProduct | number) => boolean;
  clearFavorites: () => void;
  changeFavoriteItem: (productId: number, newProduct: IProduct) => void;
}

interface FavoritesContextProviderProps {
  children: ReactNode;
}

const getSavedFavories = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('favorites') || '[]') as IProduct[];
};

const saveFavorites = (favorites: IProduct[]) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

const FavoritesContext = createContext({} as IFavoritesContext);

export const useFavoritesContext = () => useContext(FavoritesContext);

export const FavoritesContextProvider: FC<FavoritesContextProviderProps> =
  ({ children, }) => {
    const [favorites, setFavorites] = useState(getSavedFavories());

    const removeFavorite = useCallback((productId: number) => {
      setFavorites(prev => {
        const updatedFavorites = prev.filter(({ id }) => id !== productId);
        saveFavorites(updatedFavorites);
        return updatedFavorites;
      });
    }, []);

    const isFavorite = useCallback((product: IProduct | number) => {
      return favorites.some(({ id }) =>
        id === (typeof product === 'object' ? product.id : product)
      );
    }, [favorites]);

    const toggleFavorite = useCallback((product: IProduct) => {
      if (isFavorite(product)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    }, [isFavorite]);

    const addFavorite = useCallback((product: IProduct) => {
      setFavorites(prev => {
        const updatedFavorites = [...prev, product];
        saveFavorites(updatedFavorites);
        return updatedFavorites;
      })
    }, []);

    const changeFavoriteItem = useCallback(
      (productId: number, newProduct: IProduct) => {
        setFavorites(prev => {
          const updatedFavorites = prev.map(item => {
            if (item.id === productId) {
              return { ...newProduct };
            }
            return item;
          });
          saveFavorites(updatedFavorites);
          return updatedFavorites;
        });
      },
      []
    );

    const clearFavorites = useCallback(() => {
      setFavorites([]);
      saveFavorites([]);
    }, []);

    const state: IFavoritesContext = {
      favorites,
      removeFavorite,
      addFavorite,
      toggleFavorite,
      isFavorite,
      setFavorites,
      clearFavorites,
      changeFavoriteItem,
    };

    return (
      <FavoritesContext.Provider value={state}>
        {children}
      </FavoritesContext.Provider>
    );
  };