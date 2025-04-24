import { Stack } from "expo-router";
import "./globals.css";
import TokenProvider from "./context/tokenContext";

export default function RootLayout() {
  return (
    <TokenProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="games" options={{ headerShown: false }} /> */}
      </Stack>
    </TokenProvider>
  );
}
