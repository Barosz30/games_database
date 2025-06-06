import { useToken } from "../context/tokenContext";
import { fetchFromIGDB } from "../../services/api";
import Constants from 'expo-constants';

const useIGDB = () => {
  const { token, loading } = useToken();
  const clientId = process.env.EXPO_PUBLIC_CLIENTID || Constants.expoConfig?.extra?.EXPO_PUBLIC_CLIENTID;

  const fetchGames = (query: string, endpoint = "games") => {
    if (!token || !clientId) {
      throw new Error("IGDB credentials not ready yet");
    }
    return fetchFromIGDB(endpoint, query, token, clientId);
  };

  return { fetchGames, isReady: !!token && !!clientId && !loading };
};

export default useIGDB;