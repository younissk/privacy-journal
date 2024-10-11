import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FlatList } from "react-native";
import { Dialog } from "@rneui/themed";
import { useState } from "react";

const ColorSelector = ({
  color,
  setColor,
}: {
  color: string;
  setColor: (color: string) => void;
}) => {
  const [openPopup, setOpenPopup] = useState(false);

  const colorOptions = [
    "#451F55",
    "#724E91",
    "#E54F6D",
    "#F8C630",
    "#CC2936",
    "#F1BF98",
    "#65AFFF",
    "#FB5607",
    "#FFBE0B",
  ];

  return (
    <View>
      <TouchableOpacity
        style={{ marginHorizontal: 10 }}
        onPress={() => setOpenPopup(true)}
      >
        <View
          style={{
            width: 24,
            height: 24,
            backgroundColor: color,
            borderRadius: 100,
          }}
        />
      </TouchableOpacity>
      {openPopup && (
        <Dialog
          isVisible={openPopup}
          onBackdropPress={() => setOpenPopup(false)}
        >
          <FlatList
            data={colorOptions}
            numColumns={5}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setColor(item);
                  setOpenPopup(false);
                }}
                style={styles.iconContainer}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: item,
                    borderRadius: 100,
                  }}
                />
              </TouchableOpacity>
            )}
          />
        </Dialog>
      )}
    </View>
  );
};

export default ColorSelector;

const styles = StyleSheet.create({
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
});
