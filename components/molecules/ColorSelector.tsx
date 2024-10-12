import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

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
    "#000000",
    "#FFFFFF",
    "#F3F3F3",
  ];

  return (
    <View>
      <TouchableOpacity
        style={styles.colorButton}
        onPress={() => setOpenPopup(true)}
      >
        <View
          style={[styles.colorPreview, { backgroundColor: color }]}
        />
      </TouchableOpacity>
      <Modal visible={openPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Color</Text>
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
                  style={styles.colorOption}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: item },
                      color === item && styles.selectedColorCircle,
                    ]}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.colorList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpenPopup(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ColorSelector;

const styles = StyleSheet.create({
  colorButton: {
    alignItems: "center",
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    color: "#6200EE",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  colorList: {
    alignItems: "center",
  },
  colorOption: {
    margin: 10,
    alignItems: "center",
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedColorCircle: {
    borderWidth: 2,
    borderColor: "#6200EE",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#6200EE",
  },
});
