export const IGDB_CONFIG = {
    BASE_URL: "https://api.igdb.com/v4/"
}

export const fetchFromIGDB = async (
    endpoint: string,
    query: string,
    accessToken: string,
    clientId: string
  ) => {
    const res = await fetch(`${IGDB_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "text/plain",
        "Accept-Language": "pl",
      },
      body: query,
    });
  
    if (!res.ok) {
      throw new Error(`IGDB request failed: ${res.status}`);
    }
  
    return res.json();
  };