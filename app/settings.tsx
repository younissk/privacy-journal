import { Button, SafeAreaView, Text } from "react-native";
import ThemeSettings from "../components/ThemeSettings";
import { deleteDatabase } from "@/db/database";
import { useRouter } from "expo-router";
import FeatureSettings from "@/components/organisms/FeatureSettings";

const Settings = () => {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Text>Settings</Text>
      <ThemeSettings />
      <Button
        title="Delete Database"
        onPress={async () => {
          await deleteDatabase();
          router.back();
        }}
      />
    </SafeAreaView>
  );
};

export default Settings;
