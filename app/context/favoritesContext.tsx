import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoritesContext = createContext<{
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("@favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id));
  };

  const isFavorite = (id: number) => {
    return favorites.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

const useFavorites = () => useContext(FavoritesContext);

export default useFavorites;
