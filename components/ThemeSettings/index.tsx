import { View, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getThemePreference } from "../../theme/utils";
import { useThemeStore } from "../../theme/useThemeState";

const ThemeSettings = () => {
  const { isDarkMode, setTheme } = useThemeStore();

  useEffect(() => {
    getThemePreference().then((value) => setTheme(value === "dark"));
  }, []);

  const setThemePreference = (value: boolean) => {
    AsyncStorage.setItem("theme", value ? "dark" : "light");
    setTheme(value);
  };

  return (
    <View>
      <Text>Theme Settings</Text>
      <View>
        <Text>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setThemePreference} />
      </View>
    </View>
  );
};

export default ThemeSettings;
