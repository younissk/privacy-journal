import { Stack } from "expo-router";
import { ThemeProvider as RNEThemeProvider } from "@rneui/themed";
import { theme } from "../theme";
import { getThemePreference } from "../theme/utils";
import { useEffect, useState } from "react";
import { useThemeStore } from "../theme/useThemeState";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  const { isDarkMode, setTheme } = useThemeStore();

  useEffect(() => {
    getThemePreference().then((value) => setTheme(value === "dark"));
  }, [setTheme]);

  return (
    <RNEThemeProvider theme={{ ...theme, mode: isDarkMode ? "dark" : "light" }}>
      <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="addJournal"
              options={{ title: "Add Journal" }}
            />
            <Stack.Screen
              name="journalView"
              options={{ title: "Journal View" }}
            />
            <Stack.Screen
              name="addHabit"
              options={{ title: "Add Habit", presentation: "modal" }}
            />
            <Stack.Screen
              name="habitPage"
              options={{ title: "Habit Page", presentation: "modal" }}
            />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </RNEThemeProvider>
  );
}
