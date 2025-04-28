import { Stack } from "expo-router";
import "./globals.css";
import TokenProvider from "./context/tokenContext";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <TokenProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="games" options={{ headerShown: false }} /> */}
      </Stack>
    </TokenProvider>
  );
}
