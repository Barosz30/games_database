import { Stack } from "expo-router";
import "./globals.css";
import TokenProvider from "./context/tokenContext";
import { StatusBar } from "react-native";
import { FavoritesProvider } from "./context/favoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <TokenProvider>
        <StatusBar hidden={true} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </TokenProvider>
    </FavoritesProvider>
  );
}
