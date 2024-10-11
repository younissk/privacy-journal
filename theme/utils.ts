import AsyncStorage from "@react-native-async-storage/async-storage";

export const getThemePreference = async () => {
  const value = await AsyncStorage.getItem("theme");
  return value;
};

export const setThemePreference = async (value: string) => {
  await AsyncStorage.setItem("theme", value);
};
