import { createTask } from "@/functions/tasks";
import { useRouter } from "expo-router";
import { Button, View } from "react-native";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex flex-1 items-center justify-center">
      <Button
        title="New Task"
        onPress={async () => {
          await createTask(Date.now() + "");
          router.back();
        }}
      />
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
    </View>
  );
}
