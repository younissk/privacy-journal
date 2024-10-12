import { FAB } from "@rneui/themed";
import { SafeAreaView, StyleSheet } from "react-native";
import { useThemeStore } from "@/theme/useThemeState";

const PageWithFAB = ({
  children,
  onFabPress,
}: {
  children: React.ReactNode;
  onFabPress: () => void;
}) => {
  const { theme } = useThemeStore();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {children}
      <FAB
        icon={{ name: "add", color: "white" }}
        color={theme.colors.primary}
        style={styles.fab}
        onPress={onFabPress}
      />
    </SafeAreaView>
  );
};

export default PageWithFAB;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  container: {
    flex: 1,
  },
});
