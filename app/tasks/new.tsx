import { Text, View } from "@/components/Themed";
import { addTask } from "@/db/tasks";
import { useDbVersion } from "@/utils/dbVersion";
import { useSubtasks } from "@/utils/subtasks";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect } from "react";
import { Button, Pressable, StyleSheet } from "react-native";

export default function NewTask() {
  const router = useRouter();
  const db = useSQLiteContext();
  const subtasks = useSubtasks((s) => s.subtasks);
  const clear = useSubtasks((s) => s.clear);
  const bump = useDbVersion((s) => s.bump);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const create = useCallback(
    async (label: string, dueDate: number, parentId?: number) =>
      await addTask(db, label, dueDate, parentId),
    [db],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <Button title="New Subtask" onPress={() => router.navigate("/subtask")} />
      <View>
        {subtasks.map((t) => (
          <Pressable
            key={t.id}
            onPress={() =>
              router.navigate({
                pathname: "/subtask",
                params: { id: t.id, minDueDate: 0 },
              })
            }
          >
            <Text>{JSON.stringify(t)}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        title="Create Task"
        onPress={async () => {
          await create("hello-main", 0);
          bump();
          router.back();
        }}
      />
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
