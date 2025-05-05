import { createContext, useContext, useEffect, useState } from "react";
import useIGDB from "@/app/hooks/useIGDB";

type Genre = { id: number; name: string };
type Platform = { id: number; name: string };

type GameMetaContextType = {
  genres: Genre[];
  platforms: Platform[];
  loading: boolean;
};

const GameMetaContext = createContext<GameMetaContextType>({
  genres: [],
  platforms: [],
  loading: true,
});

export const GameMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { fetchGames, isReady } = useIGDB();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    const fetchMeta = async () => {
      try {
        const genreQuery = `fields name; sort name asc; limit 100;`;
        const platformQuery = `
          fields name, category;
          where category = (1, 4);
          sort name asc;
          limit 100;
        `;
        const [genreData, platformData] = await Promise.all([
          fetchGames(genreQuery, "genres"),
          fetchGames(platformQuery, "platforms"),
        ]);
        setGenres(genreData);
        setPlatforms(platformData);
      } catch (err) {
        console.error("Failed to fetch genres/platforms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, [isReady]);

  return (
    <GameMetaContext.Provider value={{ genres, platforms, loading }}>
      {children}
    </GameMetaContext.Provider>
  );
};

export const useGameMeta = () => useContext(GameMetaContext);

export default GameMetaProvider;
