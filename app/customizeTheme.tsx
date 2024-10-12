// screens/CustomizeTheme.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useThemeStore } from "../theme/useThemeState";
import { useNavigation } from "@react-navigation/native";
import { Theme } from "@/interfaces/theme";
import ColorSelector from "@/components/molecules/ColorSelector";

const CustomizeTheme = () => {
  const { theme, setTheme } = useThemeStore();
  const [customTheme, setCustomTheme] = useState<Theme>({ ...theme });
  const navigation = useNavigation();

  const handleSave = () => {
    setTheme(customTheme);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Customize Theme</Text>

      <View style={styles.colorPickerContainer}>
        <Text style={styles.label}>Primary Color</Text>
        <ColorSelector
          color={customTheme.colors.primary}
          setColor={(color: string) =>
            setCustomTheme({ ...customTheme, colors: { ...customTheme.colors, primary: color } })
          }
        />
      </View>

      {/* Repeat for other colors */}
      <View style={styles.colorPickerContainer}>
        <Text style={styles.label}>Background Color</Text>
        <ColorSelector
          color={customTheme.colors.background}
          setColor={(color: string) =>
            setCustomTheme({
              ...customTheme,
              colors: { ...customTheme.colors, background: color },
            })
          }
        />
      </View>

      {/* Add more color pickers as needed */}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Theme</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  colorPickerContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  colorPicker: {
    height: 200,
    width: "100%",
  },
  saveButton: {
    padding: 15,
    backgroundColor: "#6200EE",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CustomizeTheme;
