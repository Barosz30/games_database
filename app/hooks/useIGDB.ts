import { useToken } from "../context/tokenContext";
import { fetchFromIGDB } from "../../services/api";

const useIGDB = () => {
  const { token } = useToken();
  const clientId = process.env.EXPO_PUBLIC_CLIENTID;

  if (!token || !clientId) {
    throw new Error("Missing IGDB credentials in context");
  }

  const fetchGames = (query: string) => {
    return fetchFromIGDB("games", query, token, clientId);
  };

  return { fetchGames };
};

export default useIGDB;