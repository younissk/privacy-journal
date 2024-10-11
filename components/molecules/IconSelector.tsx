import {
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
import { useState } from "react";
import { Dialog } from "@rneui/themed";

const IconSelector = ({
  setIcon,
  icon,
  color,
}: {
  setIcon: (icon: string) => void;
  icon: string;
  color: string;
}) => {
  const [openPopup, setOpenPopup] = useState(false);
  const iconOptions = [
    "home",
    "star",
    "heart",
    "checkmark",
    "book",
    "calendar",
    "leaf",
    "flame",
    "moon",
  ];

  return (
    <View>
      <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        onPress={() => setOpenPopup(true)}
      >
        <Ionicons name={icon as any} size={24} color={color} />
      </TouchableOpacity>
      {openPopup && (
        <Dialog
          isVisible={openPopup}
          onBackdropPress={() => setOpenPopup(false)}
        >
          <FlatList
            data={iconOptions}
            numColumns={5}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setIcon(item);
                  setOpenPopup(false);
                }}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={item as any}
                  size={24}
                  color={icon === item ? color : "gray"}
                />
              </TouchableOpacity>
            )}
          />
        </Dialog>
      )}
    </View>
  );
};

export default IconSelector;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});
