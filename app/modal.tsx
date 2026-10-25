import { createTask } from "@/utils/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Button, View } from "react-native";

export default function ModalScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.back();
    },
  });

  return (
    <View className="flex flex-1 items-center justify-center">
      <Button
        title="New Task"
        onPress={() => {
          mutation.mutate(Date.now() + "");
        }}
      />
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
    </View>
  );
}
