import { View } from "react-native";
import { features, getFeatures } from "@/utils/settings";
import { useMemo } from "react";
import { Switch, Text } from "react-native";
import { toggleFeature } from "@/utils/settings";

const FeatureSettings = () => {
  const features = useMemo(() => getFeatures(), []);

  return (
    <View>
      {Object.entries(features).map(([feature, value]) => (
        <FeatureToggle
          key={feature}
          feature={feature as any}
          value={value}
        />
      ))}
    </View>
  );
};

const FeatureToggle = ({
  feature,
  value,
}: {
  feature: keyof typeof features;
  value: boolean;
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text>{feature}</Text>
      <Switch value={value} onValueChange={() => toggleFeature(feature)} />
    </View>
  );
};

export default FeatureSettings;