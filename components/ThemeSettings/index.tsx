// components/ThemeSettings.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { darkTheme, lightTheme } from '@/theme';
import { useThemeStore } from '@/theme/useThemeState';

const ThemeSettings = () => {
  const { theme, setTheme } = useThemeStore();
  const router = useRouter();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Settings</Text>

      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => router.push('/customizeTheme')}
      >
        <Text style={styles.customizeButtonText}>Customize Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Define your styles here, using theme if needed
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    // You can use theme colors here if desired
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 16,
  },
  customizeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 10,
  },
  customizeButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ThemeSettings;
