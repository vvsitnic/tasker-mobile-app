import { View } from "@/components/Themed";
import { useSubtasks } from "@/utils/subtasks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, StyleSheet } from "react-native";

export default function Subtask() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const addSubtask = useSubtasks((s) => s.addSubtask);
  const updateSubtask = useSubtasks((s) => s.updateSubtask);

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <View style={styles.container}>
      {id ? (
        <Button
          title="Update task"
          onPress={() => {
            updateSubtask(id, { label: "hello", dueDate: 1 });
          }}
        />
      ) : (
        <Button
          title="Create task"
          onPress={() => {
            addSubtask("hello", 0);
            router.back();
          }}
        />
      )}
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
