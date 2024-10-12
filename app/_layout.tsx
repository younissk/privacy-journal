// _layout.tsx
import { Stack } from "expo-router";
import { createTheme, ThemeProvider as RNEThemeProvider } from "@rneui/themed";
import { useEffect } from "react";
import { useThemeStore } from "../theme/useThemeState";
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  const { theme, loadTheme } = useThemeStore();

  useEffect(() => {
    loadTheme();
  }, []);

  const rneTheme = createTheme({
    lightColors: theme.colors,
    darkColors: theme.colors,
    mode: "light",
  });

  // Create a navigation theme based on the current theme
  const navigationTheme = {
    dark: false,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border || "#cccccc",
      notification: theme.colors.notification || theme.colors.primary,
    },
  };

  return (
    <RNEThemeProvider theme={rneTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.card,
              },
              headerTitleStyle: {
                color: theme.colors.text,
                fontWeight: "bold",
              },
              headerTintColor: theme.colors.primary,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="addJournal"
              options={{ title: "Add Journal" }}
            />
            <Stack.Screen
              name="journalView"
              options={{ title: "Journal View", presentation: "modal" }}
            />
            <Stack.Screen
              name="addHabit"
              options={{ title: "Add Habit", presentation: "modal" }}
            />
            <Stack.Screen
              name="habitPage"
              options={{ title: "Habit Page", presentation: "modal" }}
            />
            <Stack.Screen
              name="journalFlow"
              options={{ title: "Journal Flow", headerShown: false }}
            />
            <Stack.Screen
              name="addJournalFlow"
              options={{ title: "Add Journal Flow", presentation: "modal" }}
            />
            <Stack.Screen
              name="customizeTheme"
              options={{ title: "Customize Theme", presentation: "modal" }}
            />
            <Stack.Screen
              name="settings"
              options={{ title: "Settings", presentation: "modal" }}
            />
            <Stack.Screen
              name="homeSettings"
              options={{ title: "Home Settings", presentation: "modal" }}
            />
            <Stack.Screen
              name="ExportDataScreen"
              options={{ title: "Export Data", presentation: "modal" }}
            />
            <Stack.Screen
              name="ExportJournalsScreen"
              options={{ title: "Export Journals", presentation: "modal" }}
            />
            <Stack.Screen
              name="QuotePackEditor"
              options={{ title: "Quote Pack Editor", presentation: "modal" }}
            />
          </Stack>
        </QueryClientProvider>
      </NavigationThemeProvider>
    </RNEThemeProvider>
  );
}
