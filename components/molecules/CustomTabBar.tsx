// components/CustomTabBar.tsx

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const totalWidth = Dimensions.get('window').width;
  const tabWidth = totalWidth / state.routes.length;

  return (
    <View style={[styles.container]}>
      <Svg width={totalWidth} height={70} style={styles.svgStyle}>
        <Path
          d={`M0 0 L${totalWidth} 0 L${totalWidth} 70 L0 70 Z`}
          fill={colors.card}
        />
      </Svg>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const iconName = options.tabBarIcon
            ? (options.tabBarIcon({ focused: isFocused, color: colors.text, size: 24 }) as React.ReactElement).props.name
            : 'ellipse';

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.8}
            >
              <Ionicons
                name={iconName}
                size={28}
                color={isFocused ? colors.primary : colors.text}
              />
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.primary : colors.text },
                ]}
              >
                {typeof label === 'string' ? label : label({ focused: isFocused, color: isFocused ? colors.primary : colors.text, position: 'below-icon', children: '' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Central Floating Action Button */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('addJournal')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    alignItems: 'center',
  },
  svgStyle: {
    position: 'absolute',
    bottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default CustomTabBar;
