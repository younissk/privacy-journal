import { deleteDatabase } from "@/db/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const features = {
  habitTracking: true,
  journal: true,
};

export const resetApp = async () => {
  await deleteDatabase();
};

export const getFeatures = async () => {
  const features = await AsyncStorage.getItem("features");
  return features ? JSON.parse(features) : {};
};

export const saveFeature = async (
  feature: keyof typeof features,
  value: boolean
) => {
  features[feature] = value;
  await AsyncStorage.setItem("features", JSON.stringify(features));
};

export const toggleFeature = async (feature: keyof typeof features) => {
  const features = await getFeatures();
  await saveFeature(feature, !features[feature]);
};
