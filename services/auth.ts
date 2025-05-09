import Constants from 'expo-constants';

export const getIGDBToken = async () => {
  const clientId = process.env.EXPO_PUBLIC_CLIENTID || Constants.expoConfig?.extra?.EXPO_PUBLIC_CLIENTID;
  const clientSecret = process.env.EXPO_PUBLIC_SECRET || Constants.expoConfig?.extra?.EXPO_PUBLIC_SECRET;
  
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      {
        method: 'POST',
      }
    );
  
    if (!response.ok) {
      throw new Error('Failed to get access token');
    }
  
    const data = await response.json();
    return data.access_token;
  };