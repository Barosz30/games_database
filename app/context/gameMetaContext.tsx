import { createContext, useContext, useEffect, useState } from "react";
import useIGDB from "@/app/hooks/useIGDB";

type GameMetaContextType = {
  genres: string[];
  platforms: string[];
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
  const [genres, setGenres] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    const fetchMeta = async () => {
      try {
        const genreQuery = `fields name; sort name asc; limit 100;`;
        const platformQuery = `fields name; sort name asc; limit 100;`;
        const [genreData, platformData] = await Promise.all([
          fetchGames(genreQuery, "genres"),
          fetchGames(platformQuery, "platforms"),
        ]);
        setGenres(genreData.map((g: any) => g.name));
        setPlatforms(platformData.map((p: any) => p.name));
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
