import { Button, ScrollView, TextInput, View } from "react-native";
import { Category } from "@/interfaces/Journal";
import { useGetAllCategories } from "@/db/useGetAllCategories";
import { Chip } from "@rneui/themed";
import { Dialog } from "@rneui/themed";
import { useState } from "react";
import AddCategoryDialog from "./AddCategoryDialog";

const CategorySelector = ({
  categoryId,
  setCategoryId,
}: {
  categoryId: number | null;
  setCategoryId: (id: number | null) => void;
}) => {
  const { data: categories } = useGetAllCategories();
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <ScrollView horizontal>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {categories?.map((category) => (
          <Chip
            color={categoryId === category.id ? "green" : category.color}
            key={category.id}
            title={category.name}
            onPress={() => {
              if (categoryId !== category.id) {
                setCategoryId(category.id);
              } else {
                setCategoryId(null);
              }
            }}
          />
        ))}
        <Chip title="Add Category" onPress={() => setOpenPopup(true)} />
        {openPopup && (
          <AddCategoryDialog
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default CategorySelector;
