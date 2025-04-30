import "react-native-reanimated";
import { Stack } from "expo-router";
import "./globals.css";
import TokenProvider from "./context/tokenContext";
import { StatusBar } from "react-native";
import { FavoritesProvider } from "./context/favoritesContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GameMetaProvider } from "./context/gameMetaContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <TokenProvider>
        <GameMetaProvider>
          <SafeAreaProvider>
            <StatusBar hidden={true} translucent cssInterop />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </SafeAreaProvider>
        </GameMetaProvider>
      </TokenProvider>
    </FavoritesProvider>
  );
}
