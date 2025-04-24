import { useToken } from "../context/tokenContext";
import { fetchFromIGDB } from "../../services/api";

const useIGDB = () => {
  const { token, loading } = useToken();
  const clientId = process.env.EXPO_PUBLIC_CLIENTID;

  const fetchGames = (query: string) => {
    if (!token || !clientId) {
      throw new Error("IGDB credentials not ready yet");
    }
    return fetchFromIGDB("games", query, token, clientId);
  };

  return { fetchGames, isReady: !!token && !!clientId && !loading };
};

export default useIGDB;