import { Dialog, FAB } from "@rneui/themed";
import { useState } from "react";
import { TextInput, View } from "react-native";
import ColorSelector from "./ColorSelector";
import { Button } from "@rneui/base";
import { addCategory } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";

const AddCategoryDialog = ({
  openPopup,
  setOpenPopup,
}: {
  openPopup: boolean;
  setOpenPopup: (open: boolean) => void;
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#000000");

  const client = useQueryClient();

  return (
    <Dialog isVisible={openPopup} onBackdropPress={() => setOpenPopup(false)}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ColorSelector
          color={newCategoryColor}
          setColor={setNewCategoryColor}
        />
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            marginRight: 10,
          }}
          placeholder="Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <FAB
          icon={{ name: "add", color: "white" }}
          size="small"
          color="black"
          onPress={async () => {
            await addCategory(newCategoryName, newCategoryColor);
            setOpenPopup(false);
            client.invalidateQueries({ queryKey: ["categories"] });
          }}
        />
      </View>
    </Dialog>
  );
};

export default AddCategoryDialog;
