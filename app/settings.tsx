// Settings.tsx

import React from "react";
import { SafeAreaView, StyleSheet, ScrollView, Alert } from "react-native";
import { ListItem } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { deleteDatabase } from "@/db/database";

const Settings = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const settingsOptions = [
    {
      title: "Theme Settings",
      icon: "color-palette-outline",
      onPress: () => router.push("/customizeTheme"),
    },
    {
      title: "Home Settings",
      icon: "home-outline",
      onPress: () => router.push("/homeSettings"),
    },
    {
      title: "Export Journals as PDF",
      icon: "document-text-outline",
      onPress: () => router.push("/ExportJournalsScreen"),
    },
    {
      title: "Export Data as JSON",
      icon: "download-outline",
      onPress: () => router.push("/ExportDataScreen"),
    },
    {
      title: "Delete Database",
      icon: "trash-outline",
      onPress: async () => {
        Alert.alert(
          "Delete Database",
          "Are you sure you want to delete the database? This action cannot be undone and would delete all your data, journals and habits. Your Data is only stored on your device and never on any servers.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await deleteDatabase();
                router.back();
              },
            },
          ]
        );
      },
      iconColor: "#E91E63",
    },
    // Add more settings options as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {settingsOptions.map((option, index) => (
          <ListItem
            key={index}
            bottomDivider
            onPress={option.onPress}
            containerStyle={{ backgroundColor: colors.card }}
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              color={option.iconColor || colors.primary}
            />
            <ListItem.Content>
              <ListItem.Title style={{ color: colors.text }}>
                {option.title}
              </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color={colors.text} />
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Settings;
