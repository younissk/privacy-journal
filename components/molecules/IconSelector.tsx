import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        style={styles.iconButton}
        onPress={() => setOpenPopup(true)}
      >
        <Ionicons name={icon as any} size={30} color={color} />
      </TouchableOpacity>
      <Modal visible={openPopup} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Icon</Text>
            <FlatList
              data={iconOptions}
              numColumns={3}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(item);
                    setOpenPopup(false);
                  }}
                  style={styles.iconOption}
                >
                  <Ionicons
                    name={item as any}
                    size={30}
                    color={icon === item ? color : "#333"}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.iconList}
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

export default IconSelector;

const styles = StyleSheet.create({
  iconButton: {
    alignItems: "center",
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
  iconList: {
    alignItems: "center",
  },
  iconOption: {
    margin: 15,
    alignItems: "center",
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
