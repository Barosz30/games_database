import React, { createContext, useContext, useEffect, useState } from "react";
import { getIGDBToken } from "@/services/auth";

type TokenContextType = {
  token: string | null;
  loading: boolean;
};

const TokenContext = createContext<TokenContextType>({
  token: null,
  loading: true,
});

export const useToken = () => useContext(TokenContext);

interface TokenProviderProps {
  children: React.ReactNode;
}

const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getIGDBToken();
        setToken(newToken);
      } catch (error) {
        console.error("Failed to fetch IGDB token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <TokenContext.Provider value={{ token, loading }}>
      {children}
    </TokenContext.Provider>
  );
};

export default TokenProvider;
