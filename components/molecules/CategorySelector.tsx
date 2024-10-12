import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { useGetAllCategories } from "@/db/useGetAllCategories";
import AddCategoryDialog from "./AddCategoryDialog";
import { useThemeStore } from "@/theme/useThemeState";

const CategorySelector = ({
  categoryId,
  setCategoryId,
}: {
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
}) => {
  const { theme } = useThemeStore();
  const { data: categories } = useGetAllCategories();
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            categoryId === null && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setCategoryId(null)}
        >
          <Text
            style={[
              styles.chipText,
              categoryId === null && styles.selectedChipText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories?.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              categoryId === category.id && { backgroundColor: category.color },
            ]}
            onPress={() => {
              if (categoryId !== category.id) {
                setCategoryId(category.id);
              } else {
                setCategoryId(null);
              }
            }}
          >
            <Text
              style={[
                styles.chipText,
                categoryId === category.id && styles.selectedChipText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.addCategoryChip, { borderColor: theme.colors.primary }]}
          onPress={() => setOpenPopup(true)}
        >
          <Text style={[styles.addChipText, { color: theme.colors.primary }]}>+ Add Category</Text>
        </TouchableOpacity>
      </ScrollView>
      {openPopup && (
        <AddCategoryDialog
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 10,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 5,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  chipText: {
    color: "#333",
    fontSize: 14,
  },
  selectedChipText: {
    color: "#fff",
  },
  addCategoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderColor: "#6200EE",
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  addChipText: {
    color: "#6200EE",
    fontSize: 14,
  },
});

export default CategorySelector;
